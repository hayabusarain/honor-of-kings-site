#!/usr/bin/env node
/**
 * 掲載文にしか出てこない語を洗い出す。
 *
 * 狙いは「文法は正しいのに、このゲームに無い概念を持ち込んでいる語」を見つけること。
 * 誤字でも係り受けの崩れでもないので、読んでいる限り出てこない型の誤りになる。
 * 2026-08-30 の点検では、この観点で「ワード」「陣営」「資源」「リソース」「反殺」
 * 「中衛」「遠隔」の26箇所が見つかった。ゲームに設置型の視界アイテムは無く、
 * ジャングルの狩り場は「キャンプ」で、通貨と経験値をまとめて呼ぶ語も無い。
 *
 * 「珍しい語を数える」だと文の断片（「半分返」「回目重撃」）ばかり出て使えなかった。
 * 問うているのは珍しさではなく「ゲームの語彙に無い」ことなので、そのまま測る。
 *   自作文に出る語 － ゲーム内表記に出る語
 * ゲーム内表記＝スキル説明・ステータス表記・ヒーロー名・装備名・アルカナ名・スペル名。
 *
 * 出てくるのは誤りではなく「まだ確かめていない語」。1語ずつ次を問う。
 *   1. この語はゲームの画面に出るか。出ないなら、サイトは同じものを何と呼んでいるか
 *   2. 別の呼び方が多数派なら、ここだけ表記が割れている
 *   3. 別の呼び方が存在しないなら、このゲームに無い概念を持ち込んでいる
 *
 * 正しいものも当然出る。「エレベーター」は鉤括弧つきの比喩で、誤りではなかった。
 * 判定は人がやる。この道具は候補を出すだけ。
 *
 * 使い方:
 *   node scripts/prose-vocab.mjs              カタカナ語（既定）
 *   node scripts/prose-vocab.mjs --kanji      漢語も出す（断片が混ざるので参考程度）
 *   node scripts/prose-vocab.mjs --min 3      3回以上出る語だけ
 *   node scripts/prose-vocab.mjs --where 語   その語がどこに出るかを表示
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const args = process.argv.slice(2);
const withKanji = args.includes('--kanji');
const minCount = Number(args[args.indexOf('--min') + 1]) || 1;
const where = args.includes('--where') ? args[args.indexOf('--where') + 1] : null;

/** 文字列を (キーパス, 本文) に開く */
function walk(node, keys, out) {
  if (typeof node === 'string') out.push([keys.join('.'), node]);
  else if (Array.isArray(node)) node.forEach((v, i) => walk(v, [...keys, i], out));
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walk(v, [...keys, k], out);
}

/* ---------- ゲーム内表記（書き起こしと公式の名前） ---------- */
const inGame = [];
const skills = readJson('public/data/skills/ja.json');
for (const hero of Object.values(skills)) {
  for (const key of ['passive', 'skill1', 'skill2', 'skill3', 'skill4']) {
    const s = hero[key];
    if (s && typeof s === 'object') {
      const o = [];
      walk(s, [], o);
      for (const [, text] of o) inGame.push(text);
    }
  }
  const o = [];
  walk(hero.status_text ?? {}, [], o);
  for (const [, text] of o) inGame.push(text);
  inGame.push(`${hero.hero_name ?? ''} ${hero.hero_title ?? ''}`);
}
for (const [file, fields] of [
  ['src/data/hok_items.json', ['name', 'stats', 'passive', 'active']],
  ['src/data/hok_arcanas.json', ['name', 'stats']],
  ['src/data/hok_spells.json', ['japanese_name', 'japanese_description']],
  ['src/data/hok_heroes.json', ['name', 'title', 'title_alias']],
]) {
  for (const row of readJson(file)) inGame.push(fields.map(f => row[f] ?? '').join(' '));
}

/* ---------- 自作文（書き起こしを除く） ---------- */
// skills/ja.json はスキル説明とステータス表記だけがゲーム内表示の書き起こし。残りは自作文
const SKIP = /(^|\.)(passive|skill[1-4]|status_text|stats|cooldown_text)(\.|$)/;
const prose = [];
{
  const o = [];
  walk(skills, [], o);
  for (const [key, text] of o) if (!SKIP.test(key)) prose.push([`skills/ja.json:${key}`, text]);
}
for (const file of ['public/data/guide/ja.json', 'src/data/patches.json', 'src/data/patch_meta.json', 'messages/ja.json']) {
  const o = [];
  walk(readJson(file), [], o);
  for (const [key, text] of o) prose.push([`${file}:${key}`, text]);
}
for (const f of fs.readdirSync(path.join(root, 'src/content')).sort()) {
  prose.push([`src/content/${f}`, fs.readFileSync(path.join(root, 'src/content', f), 'utf8')]);
}

/* ---------- 語を数える ---------- */
// カタカナは語の切れ目がはっきりしているので、そのまま拾える。
// 漢語は形態素解析なしだと文の途中で切れるため、既定では出さない。
const patterns = [/[ァ-ヴ][ァ-ヴー]{2,}/g];
if (withKanji) patterns.push(/[一-龥]{2,4}/g);
const grab = text => patterns.flatMap(re => text.match(re) ?? []);

const known = new Set(inGame.flatMap(grab));
const count = new Map();
const seen = new Map();
for (const [key, text] of prose) {
  for (const w of grab(text)) {
    if (known.has(w)) continue;
    count.set(w, (count.get(w) ?? 0) + 1);
    if (!seen.has(w)) seen.set(w, key);
  }
}

if (where) {
  const hits = prose.filter(([, t]) => t.includes(where));
  console.log(`「${where}」 ${hits.length}件`);
  for (const [key, text] of hits) {
    const i = text.indexOf(where);
    console.log(`  ${key}\n    …${text.slice(Math.max(0, i - 40), i + where.length + 40).replace(/\n/g, ' ')}…`);
  }
  process.exit(0);
}

const rows = [...count].filter(([, n]) => n >= minCount).sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
console.log(`自作文 ${prose.length}本 / ゲーム内表記に無い語 ${rows.length}種（${minCount}回以上）`);
console.log('出現の少ない順。少ないものほど、うっかり紛れ込んだ語である見込みが高い。\n');
for (const [w, n] of rows) console.log(`  ${String(n).padStart(3)}回  ${w.padEnd(16)} ${seen.get(w)}`);
console.log('\n個別に見るときは --where 語');
