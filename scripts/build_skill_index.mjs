/**
 * 横断検索用のスキル名の索引を作る。
 *
 * 使い方: node scripts/build_skill_index.mjs          書き出す
 *         node scripts/build_skill_index.mjs --check  ずれているかだけ見る（audit の検査27が使う）
 *
 * スキルの JSON は日本語 1.76MB・英語 1.55MB あり、検索モーダルにそのまま読ませられない。
 * 名前だけを抜き出して src/data/generated/skill_index.json に置く（2026-09-25 追加）。
 * skills/*.json のスキル名を直したら、これを実行し直すこと。忘れると audit が落とす。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const OUT = 'src/data/generated/skill_index.json';
const SLOTS = ['passive', 'skill1', 'skill2', 'skill3', 'skill4'];

export function buildSkillIndex() {
  const ja = read('src/data/skills/ja.json');
  const en = read('src/data/skills/en.json');
  const heroIds = new Set(read('src/data/hok_heroes.json').map((h) => String(h.id)));
  const rows = [];
  for (const id of Object.keys(ja).sort((a, b) => Number(a) - Number(b))) {
    // hok_heroes.json に無いヒーローはページが無いので、検索に出しても飛び先が無い
    if (!heroIds.has(id)) continue;
    for (const slot of SLOTS) {
      const nameJa = ja[id]?.[slot]?.name?.trim();
      if (!nameJa) continue;
      const nameEn = en[id]?.[slot]?.name?.trim() || '';
      rows.push({ h: id, s: slot, ja: nameJa, en: nameEn });
    }
  }
  return JSON.stringify(rows) + '\n';
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const next = buildSkillIndex();
  const outPath = path.join(root, OUT);
  const cur = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
  if (process.argv.includes('--check')) {
    if (cur !== next) {
      console.error(`✗ ${OUT} が skills/*.json とずれている。node scripts/build_skill_index.mjs を実行する`);
      process.exit(1);
    }
    console.log(`✓ ${OUT} は最新`);
  } else {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, next);
    console.log(`${OUT} を書き出した（${JSON.parse(next).length}件・${Buffer.byteLength(next)}B）`);
  }
}
