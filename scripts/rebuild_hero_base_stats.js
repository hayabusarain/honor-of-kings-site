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
 *   1. skills/ja.json の status_text（ゲーム内ステータス画面の書き起こし）
 *   2. hero_detailed_stats.json の "hero_<id>" キー
 *   3. hero_detailed_stats.json の "<id>" キーのうち、ダミーの型と一致しないもの
 *
 * status_text を先頭に置いているのは、2026-08-24 に 112 体を実機で撮り直したため。
 * hero_detailed_stats.json のリソース欄はそれ以前のもので、雲中君を MP 640、
 * 李信を MP 0、司馬懿をエネルギー 80 とするなど、10 体で実機と食い違っていた。
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

/** ゲーム内ステータス画面の表記。2026-08-24 に実機で確認した */
const HP_REGEN = '1秒ごとのHP回復量';

const heroes = read('src/data/hok_heroes.json');
const rawStats = read('src/data/hero_detailed_stats.json');
const ja = read('public/data/skills/ja.json');

// UI が表示する固定項目。リソース（MP・闘志など）はヒーローごとに名前が変わるので別扱い
const FIXED = [
  '最大HP', '物理攻撃', '魔法攻撃', '物理防御', '魔法防御',
  '移動速度', '攻撃範囲', HP_REGEN,
];

// 出所によってキーの綴りが違う。hero_detailed_stats.json は旧表記のままなので、
// 読むときは両方を受け、書くときはゲーム画面どおりの HP_REGEN に寄せる
const readFixed = (src, f) =>
  f === HP_REGEN ? (src[HP_REGEN] ?? src['5秒ごとのHP回復']) : src[f];

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
    const v = baseValue(readFixed(src, f));
    if (v !== undefined) stats[f] = v;
  }
  if (!stats['最大HP']) return null; // HP が無いものは実測値とみなさない

  // リソース名はヒーローごとに違う（MP / 闘志 / エネルギー / オーラ / 怒気 …）。
  // status_text からは画面の並び順で取れているので、あればそちらを使う
  const resource = src.__resource || resourceFromKeys(src);
  // リソースを持たないヒーローでは、キーごと落とす（null を書くと型が緩くなる）
  return resource ? { source, stats, resource } : { source, stats };
};

/** hero_ キーのように「最大◯◯」「5秒ごとの◯◯回復」が揃っている出所から拾う */
const resourceFromKeys = (src) => {
  for (const key of Object.keys(src)) {
    const m = key.match(/^最大(.+)$/);
    if (!m || m[1] === 'HP') continue;
    const max = baseValue(src[key]);
    if (max === undefined) continue;
    const name = m[1];
    const regenKey = Object.keys(src).find((k) => /回復$/.test(k) && k.includes(name));
    const regen = regenKey ? baseValue(src[regenKey]) : undefined;
    const out = { name, max, maxLabel: key };
    if (regen !== undefined) Object.assign(out, { regen, regenLabel: regenKey });
    return out;
  }
  return null;
};

/**
 * リソース欄を画面の並び順で拾う。
 * 見出しが揃っていないので、名前で突き合わせると落ちる:
 *   曜「エネルギー 3」・デーヴァラ「電力充満 6」… 『最大』が付かない
 *   ミーユエ「最大シャドーパワー」↔「5秒ごとのシャドー回復」… 名前が一致しない
 *   デーヴァラ「電力充満」↔「毎秒のMP回復」        … そもそも別の語
 *   廉頗「闘志回復」                                … 時間の接頭辞が無い
 * 画面の並びは固定なので、基本ステータスは最大HPの次、
 * 防御ステータスはHP回復の次がリソースだと決められる。
 */
const KNOWN_BASIC = /^(最大HP|物理攻撃|魔法攻撃|物理防御|魔法防御)/;
const numRow = (line) => {
  const m = String(line).match(/^(.+?)\s+(-?[0-9][0-9.]*)$/);
  return m ? { label: m[1].trim(), value: m[2] } : null;
};

const resourceFromLayout = (text) => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  let name = null;
  let max = null;
  let maxLabel = null;
  for (const line of lines.slice(lines.indexOf('基本ステータス') + 1)) {
    if (line === '攻撃ステータス') break;
    const row = numRow(line);
    if (!row || KNOWN_BASIC.test(row.label)) continue;
    maxLabel = row.label;
    name = row.label.replace(/^最大/, '');
    max = row.value;
    break;
  }
  if (!name) return null;

  const defense = lines.slice(lines.indexOf('防御ステータス') + 1);
  const hpAt = defense.findIndex((l) => /HP回復/.test(l));
  const after = hpAt >= 0 ? numRow(defense[hpAt + 1] || '') : null;
  const hasRegen = after && /回復$/.test(after.label);

  // 見出しはヒーローごとに違うので、作り直さずゲーム画面の文言をそのまま持たせる
  const out = { name, max, maxLabel };
  if (hasRegen) Object.assign(out, { regen: after.value, regenLabel: after.label });
  return out;
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
  ['(?:1秒ごとのHP回復量|5秒ごとのHP回復)', HP_REGEN],
];
const VALUE = '([0-9]+(?:\\.[0-9]+)?(?:\\s*\\|\\s*[0-9.]+%?)?(?:\\s*\\([^)]*\\))?|近距離|遠距離)';

const fromStatusText = (text) => {
  if (!text || !/最大HP/.test(text)) return null;
  const src = {};
  for (const [pattern, key] of LABELS) {
    const m = text.match(new RegExp(pattern + '\\s*[:：]?\\s*' + VALUE));
    if (m) src[key] = m[1].trim();
  }
  const resource = resourceFromLayout(text);
  if (resource) src.__resource = resource;
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

  const parsed = fromStatusText(ja[id] && ja[id].status_text);
  if (parsed) entry = shape(parsed, 'status_text');
  if (!entry && rawStats['hero_' + id]) entry = shape(rawStats['hero_' + id], 'hero_key');
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
