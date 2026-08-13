/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * スキルアイコンを、グローバル版公式「HoK Camp」の画像に差し替える。
 *
 * 背景:
 *   public/images/skills/ の 472 点は中国版CDN(game.gtimg.cn)由来だった。
 *   2026-08-14 に全116体を照合したところ、23体で絵柄が中国版と食い違っていた
 *   （孫策・蒙牙・少司縁・カルラ・ファーティフなどは色も構図も別物）。
 *   グローバル版を見ている読者に別の絵を出していることになるので差し替える。
 *
 * 対応付け:
 *   サイトのスキル配列は parseHeroSkills が [パッシブ, skill1, skill2, skill3(, skill4)] の順に
 *   組み、ファイル名は {heroId}_{配列index}.png。公式 skillGroups[0].skills も同じ並びで、
 *   先頭は必ずパッシブ。全116体で点数が一致することを確認済みなので、index をそのまま使う。
 *
 *   注意: 公式ファイル名の数字（10820 の "2"）は内部アセットIDであって表示スロットではない。
 *   ファイル名から順番を推測してはいけない。並び順は skillList の順序が正。
 *
 * 前提:
 *   scratch/camp_global_skill_icons.json（scratch/fetch_global_skill_icons.js の出力）
 *
 * 使い方:
 *   node scripts/sync_global_skill_icons.js [--dry]
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'scratch/camp_global_skill_icons.json');
const DEST = path.join(ROOT, 'public/images/skills');
const BACKUP = path.join(ROOT, 'scratch/backup_skill_icons_cn');
const DRY = process.argv.includes('--dry');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36',
        Referer: 'https://camp.honorofkings.com/',
      },
    }, (res) => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

(async () => {
  if (!fs.existsSync(SRC)) {
    console.error('先に scratch/fetch_global_skill_icons.js を実行してください');
    process.exit(1);
  }
  const camp = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const heroes = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/hok_heroes.json'), 'utf8'));
  const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/skills/ja.json'), 'utf8'));
  const KEYS = ['passive', 'skill1', 'skill2', 'skill3', 'skill4'];

  if (!DRY) fs.mkdirSync(BACKUP, { recursive: true });
  let written = 0, added = 0, failed = 0;
  const problems = [];
  const needed = new Set();

  for (const h of heroes) {
    const hid = String(h.id).replace('hero_', '');
    const entry = camp[hid];
    const need = KEYS.filter((k) => (site[hid] || {})[k]).length;
    const icons = ((entry && entry.skillGroups) || [])[0];
    const list = (icons && icons.skills) || [];

    if (!entry || !list.length) { problems.push(`${hid} ${h.name}: 公式データなし`); continue; }
    if (list.length !== need) {
      // 点数が合わないときは触らない。ずれたアイコンを載せるより、古いままの方が害が小さい
      problems.push(`${hid} ${h.name}: 点数不一致 サイト${need} / 公式${list.length} … スキップ`);
      continue;
    }

    for (let i = 0; i < list.length; i++) {
      const url = list[i].icon;
      if (!url) { problems.push(`${hid}_${i}: URLなし`); continue; }
      const dest = path.join(DEST, `${hid}_${i}.png`);
      const exists = fs.existsSync(dest);
      needed.add(`${hid}_${i}.png`);
      if (DRY) { exists ? written++ : added++; continue; }
      try {
        const buf = await get(url);
        if (buf.length < 500) throw new Error(`本文が小さすぎる (${buf.length}B)`);
        if (exists) fs.copyFileSync(dest, path.join(BACKUP, `${hid}_${i}.png`));
        fs.writeFileSync(dest, buf);
        exists ? written++ : added++;
      } catch (e) {
        failed++;
        problems.push(`${hid}_${i} (${list[i].name}): ${e.message}`);
      }
    }
  }

  console.log(DRY ? '--- dry run（書き込みなし）---' : '--- 完了 ---');
  console.log(`上書き ${written} 点 / 新規追加 ${added} 点 / 失敗 ${failed} 点`);
  if (!DRY) console.log(`旧アイコン（中国版）の退避先: ${BACKUP}`);

  // サイトが描画しない位置に残っているファイル。放置すると中国版の絵が混ざったままになる
  const orphans = fs.readdirSync(DEST).filter((f) => f.endsWith('.png') && !needed.has(f));
  if (orphans.length) {
    console.log(`\nサイトから参照されていない残存ファイル ${orphans.length} 点（要削除）:`);
    orphans.forEach((f) => console.log('  ' + f));
  }
  if (problems.length) {
    console.log(`\n未処理・注意 ${problems.length} 件:`);
    problems.forEach((p) => console.log('  ' + p));
  }
})();
