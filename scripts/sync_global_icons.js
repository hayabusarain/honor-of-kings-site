/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * ヒーロー画像・アイテム画像・召喚士スキル画像を、グローバル版公式「HoK Camp」に差し替える。
 * （スキルアイコンは scripts/sync_global_skill_icons.js が担当）
 *
 * 差し替えの理由は種類ごとに違う。
 *   ヒーロー: 537 デーヴァラがひとりだけ全身イラスト、141 貂蝉が別バージョンの絵だった。
 *            他114体は同じ絵の色味違い。解像度も 90〜100px → 128px に上がる。
 *   アイテム: 絵柄は中国版とグローバル版で全件同一だった。差し替えは出所を揃えるためで、
 *            正確性の改善はない。公式は64pxの円形PNGで、サイトの87px正方形JPG
 *            （公式の中央68%を切り出したもの）より解像度は下がる。ただし表示は
 *            一覧48px・モーダル64pxなので実害は出ない。
 *   召喚士スキル: 絵柄は同一。85px → 128px に上がる。
 *
 * 対応付けの注意:
 *   公式は equipId とアイコンのファイル名が一致しない（equipId 1714 のアイコンは 1724.png）。
 *   IDからURLを組み立てず、公式が返す equipIcon の値を使い、名前で突き合わせる。
 *   名前で引けない6件のうち4件（1212/1311/1723/1753）は、同IDのBattleEquipが同じ絵で
 *   あることを目視で確認したうえで例外表に入れてある。残る2件は該当が見つからず、
 *   中国版のまま残す。
 *
 * 前提: scratch/camp_global_skill_icons.json と scratch/camp_global_equips.json
 *
 * 使い方: node scripts/sync_global_icons.js [--dry]
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry');
const BACKUP = path.join(ROOT, 'scratch/backup_icons_cn');
const HEROES_SRC = path.join(ROOT, 'scratch/camp_global_skill_icons.json');
const EQUIPS_SRC = path.join(ROOT, 'scratch/camp_global_equips.json');

// 名前では引けないが、同IDのBattleEquipが同じ絵であることを目視で確認したもの
const ITEM_ID_FALLBACK = {
  1212: 'ブルーサファイア',
  1311: 'レッドメノウ',
  1723: '極影の盾・奔狼',
  1753: 'ガーディアン・奔狼',
};

// 召喚士スキルのアイコンは、公式では数値IDのファイル名で配信されている（フラッシュだけ flash.png）。
// ただしURLを拾えるのは投稿されたビルドに使われているものだけで、ジャミングは1件も出てこない。
// 80105.png が同じ絵であることを目視で確認したうえで例外に入れてある。
const SPELL_ID_FALLBACK = { 80105: 'ジャミング' };

const norm = (s) => String(s || '').normalize('NFKC').replace(/[\s・\-–—:：()（）'"’]/g, '').toLowerCase();

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(encodeURI(url), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36',
        Referer: 'https://camp.honorofkings.com/',
      },
    }, (res) => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
      const c = [];
      res.on('data', (x) => c.push(x));
      res.on('end', () => resolve(Buffer.concat(c)));
    }).on('error', reject);
  });
}

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const writeJson = (p, v) => fs.writeFileSync(path.join(ROOT, p), JSON.stringify(v, null, 2) + '\n', 'utf8');

/** 1件を取得して public/images/<dir>/<id>.png に書き、置き換えた旧ファイルを退避する */
async function put(dir, id, url, stat) {
  const destDir = path.join(ROOT, 'public/images', dir);
  const dest = path.join(destDir, `${id}.png`);
  const old = fs.readdirSync(destDir).filter((f) => f.replace(/\.[^.]+$/, '') === String(id));
  if (DRY) { stat.planned++; return true; }
  let buf;
  try {
    buf = await get(url);
    if (buf.length < 400) throw new Error(`本文が小さすぎる (${buf.length}B)`);
  } catch (e) {
    stat.failed.push(`${dir}/${id}: ${e.message}`);
    return false;
  }
  fs.mkdirSync(path.join(BACKUP, dir), { recursive: true });
  for (const f of old) fs.copyFileSync(path.join(destDir, f), path.join(BACKUP, dir, f));
  // 拡張子を .png に揃える。旧 .jpg は消し、参照側のJSONも書き換える
  for (const f of old) if (f !== `${id}.png`) fs.unlinkSync(path.join(destDir, f));
  fs.writeFileSync(dest, buf);
  stat.done++;
  return true;
}

(async () => {
  for (const f of [HEROES_SRC, EQUIPS_SRC]) {
    if (!fs.existsSync(f)) { console.error(`${f} がありません。scratch の取得スクリプトを先に実行してください`); process.exit(1); }
  }
  const camp = JSON.parse(fs.readFileSync(HEROES_SRC, 'utf8'));
  const { equips, spells } = JSON.parse(fs.readFileSync(EQUIPS_SRC, 'utf8'));

  // ---------- ヒーロー ----------
  const heroes = readJson('src/data/hok_heroes.json');
  const hs = { done: 0, planned: 0, failed: [] };
  for (const h of heroes) {
    const hid = String(h.id).replace('hero_', '');
    const url = (camp[hid] || {}).heroIcon;
    if (!url) { hs.failed.push(`${hid} ${h.name}: 公式URLなし`); continue; }
    if (await put('heroes', hid, url, hs)) h.image = `/images/heroes/${hid}.png`;
    process.stdout.write(`\rヒーロー ${hs.done + hs.planned}/${heroes.length}   `);
  }
  if (!DRY) writeJson('src/data/hok_heroes.json', heroes);
  console.log('');

  // ---------- アイテム ----------
  const byName = {};
  for (const [eid, e] of Object.entries(equips)) if (!byName[norm(e.name)]) byName[norm(e.name)] = { eid, ...e };
  const items = readJson('src/data/hok_items.json');
  const is = { done: 0, planned: 0, failed: [] };
  const unmapped = [];
  for (const it of items) {
    let url = (byName[norm(it.name)] || {}).icon;
    if (!url && ITEM_ID_FALLBACK[it.id]) url = `https://camp.honorofkings.com/social/game/BattleEquip/${it.id}.png`;
    if (!url) { unmapped.push(`${it.id} ${it.name}`); continue; }
    if (await put('items', it.id, url, is)) it.icon = `/images/items/${it.id}.png`;
    process.stdout.write(`\rアイテム ${is.done + is.planned}/${items.length}   `);
  }
  if (!DRY) writeJson('src/data/hok_items.json', items);
  console.log('');

  // ---------- 召喚士スキル ----------
  const bySpell = {};
  for (const [name, v] of Object.entries(spells)) bySpell[norm(name)] = v;
  const sp = readJson('src/data/hok_spells.json');
  const ss = { done: 0, planned: 0, failed: [] };
  const SK = 'https://camp.honorofkings.com/Global/Common/UGUI/SystemRes/902_HeroSkillIcon/';
  for (const s of sp) {
    const hit = bySpell[norm(s.japanese_name)];
    const url = hit ? hit.icon : (SPELL_ID_FALLBACK[s.summoner_id] ? `${SK}${s.summoner_id}.png` : null);
    if (!url) { ss.failed.push(`${s.summoner_id} ${s.japanese_name}: 公式データに無い`); continue; }
    if (await put('summoners', s.summoner_id, url, ss)) s.icon = `/images/summoners/${s.summoner_id}.png`;
  }
  if (!DRY) writeJson('src/data/hok_spells.json', sp);

  console.log(DRY ? '\n--- dry run（書き込みなし）---' : '\n--- 完了 ---');
  const line = (label, st, total) =>
    console.log(`  ${label}: ${DRY ? st.planned : st.done} / ${total} 件${st.failed.length ? `  失敗 ${st.failed.length}` : ''}`);
  line('ヒーロー', hs, heroes.length);
  line('アイテム', is, items.length);
  line('召喚士スキル', ss, sp.length);
  if (unmapped.length) {
    console.log(`\n公式に対応が見つからず、中国版のまま残したアイテム ${unmapped.length} 件:`);
    unmapped.forEach((u) => console.log('  ' + u));
  }
  for (const st of [hs, is, ss]) st.failed.forEach((f) => console.log('  失敗: ' + f));
  if (!DRY) console.log(`\n旧アイコンの退避先: ${BACKUP}`);
})();
