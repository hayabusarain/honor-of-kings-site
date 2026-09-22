/**
 * パッチノートに書いた数値が、公式の原文に実在するかを突き合わせる。
 *
 *   node scripts/verify_patch_numbers.mjs --version "9月23日…のお知らせ" --source scratch/_s16_clean.txt
 *
 * なぜ要るか:
 *   本文は公式の告知を読んで手で書き起こす。写し間違いは目視では見つからない
 *   （2026-09-23 に運営者から「毎回確認しているのか」と聞かれ、していなかったので作った）。
 *   数値そのものが原文に無ければ、どこかで作ってしまったということ。
 *
 * 見ているのは日本語本文の数値だけ。英語は日本語と同じ構造で書くが、
 * 「6枚」を six blades と書くように語で表す箇所があり、数の一致では測れない。
 *
 * 原文に無くても通すもの:
 *   - 公式統計（hero_stats_camp.json）と実測ステータス（hero_base_stats.json）の値。
 *     解説で「勝率◯%」「基礎移動速度◯」に触れるため
 *   - --derived で渡した計算値。「飛刃6枚で270」のように、こちらが計算して出した数
 *   - 0〜30 の小さい整数。件数・順位・箇条書きの数に出るので、これを弾くと使い物にならない
 */
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf('--' + name);
  return i >= 0 ? argv[i + 1] : null;
};

const version = arg('version');
const source = arg('source');
const derived = (arg('derived') ?? '').split(',').map((s) => s.trim()).filter(Boolean);

if (!version || !source) {
  console.error('使い方: node scripts/verify_patch_numbers.mjs --version "<version の文字列>" --source <原文のテキスト> [--derived 270,12.6]');
  process.exit(2);
}

const root = path.join(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const readJson = (p) => JSON.parse(read(p));

const NUM = /\d+(?:\.\d+)?/g;
const norm = (s) => s.replace(/,/g, '').replace(/％/g, '%');
/** 日付（2026-09-11）は数値として数えない。年・月・日に割れて誤検知になる */
const numbersOf = (text) => norm(text).replace(/\d{4}-\d{2}-\d{2}/g, ' ').match(NUM) ?? [];

const src = read(source);
const known = new Set(numbersOf(src));
for (const v of Object.values(readJson('src/data/hero_stats_camp.json'))) {
  for (const k of ['win_rate', 'pick_rate', 'ban_rate']) known.add(String(v[k]));
}
for (const v of Object.values(readJson('src/data/hero_base_stats.json'))) {
  for (const x of Object.values(v.stats ?? {})) for (const n of String(x).match(NUM) ?? []) known.add(n);
}
for (const n of derived) known.add(n);

const isSmallCount = (n) => Number.isInteger(Number(n)) && Number(n) <= 30;

const contextOf = (text, n) => {
  const re = new RegExp('(^|[^0-9.])' + String(n).replace('.', '\\.') + '([^0-9]|$)');
  const line = norm(text).split(/[\n。]/).find((l) => re.test(l));
  return line ? line.trim().slice(0, 80) : '(該当行が見つからない)';
};

const patches = readJson('src/data/patches.json').filter((p) => p.version === version);
const metas = readJson('src/data/patch_meta.json').filter((m) => m.version === version);
if (patches.length === 0) {
  console.error(`patches.json に「${version}」がありません`);
  process.exit(2);
}

const targets = [
  ...patches.map((p) => ({ id: p.id, label: p.hero_name, text: p.description })),
  ...metas.map((m) => ({ id: m.id, label: 'メタ分析', text: [m.summary, ...(m.details ?? []), m.prediction_ja].join('\n') })),
];

let ng = 0;
for (const t of targets) {
  const unknown = [...new Set(numbersOf(t.text))].filter((n) => !known.has(n) && !isSmallCount(n));
  if (!unknown.length) continue;
  ng += unknown.length;
  console.log(`\n▲ ${t.id}（${t.label}）`);
  for (const n of unknown) console.log(`   原文に無い ${n}: ${contextOf(t.text, n)}`);
}

console.log(`\n${targets.length} 件を照合。${ng ? `原文に無い数値が ${ng} 件` : '原文に無い数値なし'}`);
process.exit(ng ? 1 : 0);
