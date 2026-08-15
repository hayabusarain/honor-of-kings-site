/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * ヒーロー詳細ページの「基本ステータス」を、実測値だけで組み直す。
 *
 * 背景:
 *   src/data/hero_detailed_stats.json には 2 種類のキーが同居していた。
 *     - "hero_105" 形式（91件）… ゲーム画面から起こした実測値
 *     - "105" 形式（117件）  … 2026-08-03 に後付けされた穴埋め用のダミー
 *   UI はダミー側だけを読んでいたため、116体中105体が「最大HP 3300」、108体が
 *   「最大MP 600」、109体が「攻撃範囲 近距離」という、あり得ない値を表示していた。
 *   廉頗のように闘志を使うヒーローにも一律で「最大MP 600」が出ていた。
 *
 * 方針:
 *   実測値のある出所だけを使い、無いヒーローは項目ごと出さない。
 *   screenshots/README.md の「読めない箇所は推測で埋めない」という運用方針に合わせる。
 *
 * 出所の優先順位:
 *   1. hero_detailed_stats.json の "hero_<id>" キー
 *   2. skills/ja.json の status_text（ゲーム内ステータス画面の書き起こし）
 *   3. hero_detailed_stats.json の "<id>" キーのうち、ダミーの型と一致しないもの
 *
 * 「3795 (3675+120)」のような表記はアルカナ込みの実表示。括弧内の第1項が素の値なので
 * そちらを採る。括弧が無い値は、その項目にアルカナが乗っていないということなので素の値。
 *
 * 使い方: node scripts/rebuild_hero_base_stats.js [--dry]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const heroes = read('src/data/hok_heroes.json');
const rawStats = read('src/data/hero_detailed_stats.json');
const ja = read('public/data/skills/ja.json');

// UI が表示する固定項目。リソース（MP・闘志など）はヒーローごとに名前が変わるので別扱い
const FIXED = [
  '最大HP', '物理攻撃', '魔法攻撃', '物理防御', '魔法防御',
  '移動速度', '攻撃範囲', '5秒ごとのHP回復',
];

// 「3795 (3675+120)」→「3675」。括弧内はアルカナ込みの内訳なので素の値を採る
const baseValue = (v) => {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  if (!s || s === '-') return undefined;
  const m = s.match(/\(\s*([0-9.]+)\s*\+/);
  return m ? m[1] : s;
};

/** hero_ キーと同じ形のオブジェクトから、表示用の形に整える */
const shape = (src, source) => {
  const stats = {};
  for (const f of FIXED) {
    const v = baseValue(src[f]);
    if (v !== undefined) stats[f] = v;
  }
  if (!stats['最大HP']) return null; // HP が無いものは実測値とみなさない

  // リソース名はヒーローごとに違う（MP / 闘志 / エネルギー / オーラ / 怒気 …）
  let resource = null;
  for (const key of Object.keys(src)) {
    const m = key.match(/^最大(.+)$/);
    if (!m || m[1] === 'HP') continue;
    const max = baseValue(src[key]);
    if (max === undefined) continue;
    const name = m[1];
    const regenKey = Object.keys(src).find((k) => /回復$/.test(k) && k.includes(name));
    const regen = regenKey ? baseValue(src[regenKey]) : undefined;
    resource = regen === undefined ? { name, max } : { name, max, regen };
    break;
  }
  // リソースを持たないヒーローでは、キーごと落とす（null を書くと型が緩くなる）
  return resource ? { source, stats, resource } : { source, stats };
};

/** status_text（ゲーム内ステータス画面の書き起こし）から拾う */
const LABELS = [
  ['最大HP', '最大HP'],
  ['物理攻撃', '物理攻撃'],
  ['魔法攻撃', '魔法攻撃'],
  ['物理防御(?!貫通)', '物理防御'],
  ['魔法防御(?!貫通)', '魔法防御'],
  ['移動速度', '移動速度'],
  ['攻撃範囲', '攻撃範囲'],
  ['5秒ごとのHP回復', '5秒ごとのHP回復'],
];
const VALUE = '([0-9]+(?:\\.[0-9]+)?(?:\\s*\\|\\s*[0-9.]+%?)?(?:\\s*\\([^)]*\\))?|近距離|遠距離)';

const fromStatusText = (text) => {
  if (!text || !/最大HP/.test(text)) return null;
  const src = {};
  for (const [pattern, key] of LABELS) {
    const m = text.match(new RegExp(pattern + '\\s*[:：]?\\s*' + VALUE));
    if (m) src[key] = m[1].trim();
  }
  // リソース（最大MP / 最大闘志 / 最大エネルギー …）とその回復
  for (const m of text.matchAll(/最大([^\s:：\n]+)\s*[:：]?\s*([0-9]+)/g)) {
    if (m[1] === 'HP') continue;
    src['最大' + m[1]] = m[2];
    const regen = text.match(new RegExp('5秒ごとの' + m[1] + '回復\\s*[:：]?\\s*([0-9]+)'));
    if (regen) src['5秒ごとの' + m[1] + '回復'] = regen[1];
    break;
  }
  return Object.keys(src).length ? src : null;
};

// プレーンキーのダミー判定。後付けされた穴埋めの型と一致するものは採用しない
const DUMMY = { 最大HP: '3300', 最大MP: '600', '5秒ごとのHP回復': '50', '5秒ごとのMP回復': '15' };
const isDummy = (o) => Object.entries(DUMMY).every(([k, v]) => String(o[k]) === v);

const out = {};
const bySource = { hero_key: [], status_text: [], plain_key: [] };
const missing = [];

for (const h of heroes) {
  const id = String(h.id);
  let entry = null;

  if (rawStats['hero_' + id]) entry = shape(rawStats['hero_' + id], 'hero_key');
  if (!entry) {
    const parsed = fromStatusText(ja[id] && ja[id].status_text);
    if (parsed) entry = shape(parsed, 'status_text');
  }
  if (!entry && rawStats[id] && !isDummy(rawStats[id])) entry = shape(rawStats[id], 'plain_key');

  if (entry) {
    out[id] = entry;
    bySource[entry.source].push(`${id} ${h.name}`);
  } else {
    missing.push(`${id} ${h.name}`);
  }
}

if (!DRY) {
  fs.writeFileSync(
    path.join(ROOT, 'src/data/hero_base_stats.json'),
    JSON.stringify(out, null, 2) + '\n',
    'utf8'
  );
}

console.log(DRY ? '--- dry run（書き込みなし）---' : '--- 完了: src/data/hero_base_stats.json ---');
console.log(`実測値を採用: ${Object.keys(out).length} 体 / 全 ${heroes.length} 体`);
console.log(`  hero_ キー     : ${bySource.hero_key.length}`);
console.log(`  status_text    : ${bySource.status_text.length}`);
console.log(`  プレーンキー   : ${bySource.plain_key.length}${bySource.plain_key.length ? ' … ' + bySource.plain_key.join(', ') : ''}`);

const withResource = Object.values(out).filter((e) => e.resource);
const nonMp = withResource.filter((e) => e.resource.name !== 'MP');
console.log(`\nリソース欄あり: ${withResource.length} 体（うち MP 以外 ${nonMp.length} 体）`);
nonMp.forEach((e) => {
  const id = Object.keys(out).find((k) => out[k] === e);
  const hero = heroes.find((h) => String(h.id) === id);
  console.log(`  ${id} ${hero.name} → 最大${e.resource.name} ${e.resource.max}`);
});

console.log(`\n実測値が見つからず非表示にするヒーロー: ${missing.length} 体`);
missing.forEach((m) => console.log('  ' + m));
