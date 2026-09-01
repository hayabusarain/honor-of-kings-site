#!/usr/bin/env node
/**
 * 装備データの日本語と英語で、数値が食い違っている箇所を洗い出す。
 *
 * **この検査は数値しか見ない。実機照合の代わりにはならない。**
 * 2026-09-01 の実機照合では、これが出した10件の候補のうち8件が本物だった一方で、
 * グリードバイトと巨人のグリップの「狩猟」が日本語だけ「魔法ダメージ」に
 * なっていた誤りは**この検査を素通りしている**。数字は日英で完全に一致していて、
 * 違うのは単語だけだったため。ジャングル装備のダメージ種別はビルドの判断を
 * 変えるので、今回いちばん実害の大きい誤りがこれだった。
 * つまり、ここが0件でもデータが正しい保証にはならない。一次点検として使う。
 *
 * なぜ日英を突き合わせるか。どちらも公式の表示を書き起こしたもので、
 * 独立に写した2つの写しになっている。片方の写し間違いは、もう片方と
 * 突き合わせれば浮く。実機を開かずに「怪しい場所」を絞れるのが利点。
 *
 * どちらが正しいかは、この検査では決まらない。写し間違いかもしれないし、
 * 片方だけ古いパッチのままかもしれない。出てくるのは「実機で見る順番」であって
 * 修正案ではない。装備ショップを開いて日本語表示と突き合わせること。
 *
 * 語順の違いは差分にしない。日本語と英語では句の並びが変わるので、
 * 数値は集合として比べる（「3.5秒間20%」と "by 20% ... for 3.5s" は同じ）。
 * 表記の違いも先に吸収する。英語の doubled は日本語の「2倍」、
 * "Before 04:00" は「開戦から4分まで」、日本語の「半減」は英語の 50%。
 * ここを揃えないと、実測で70件中60件が語順と表記の違いで埋まる。
 *
 *   npm run diff:items          差分を出す
 *   npm run diff:items -- --all 吸収した表記の違いも含めて出す（検査自体の点検用）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const items = JSON.parse(fs.readFileSync(path.join(root, 'src/data/hok_items.json'), 'utf8'));
const showAll = process.argv.includes('--all');

/**
 * 日英で書き方が違うだけのものを、同じ形に寄せる。
 * ここで吸収しそこねると、本物の差分がノイズに埋もれて読めなくなる。
 *
 * 吸収するのは「同じ意味を、片方は数字で、片方は言葉で書いている」型だけ。
 * 日本語の「2倍」と英語の doubled は同じことを言っていて、数えると 2 が
 * 片側にだけ立つ。実測では、こうした表記の違いが差分の大半（70件中56件）を
 * 占めていた。値そのものの違いは吸収しない。
 *
 * 対にならない語を足すと本物の差分を消してしまうので、
 * 規則を足すときは必ず --all で前後の本文を見てから入れること。
 */
const PAIRS = [
  // [日本語の書き方, 英語の書き方, 置き換え先] 置き換え先は数字を含まない語にする
  // 「半減」は英語で2通り。halved と「50%しか与えない」の言い換え
  [/半減/g, /\bhalved\b|ranged attacks (?:only )?deal 50% (?:of this )?damage/gi, 'ハンゲン'],
  [/(?:1秒ごと|毎秒)/g, /\b(?:per|every) second\b/gi, 'マイビョウ'],
  [/1回ごと/g, /\beach (?=dealing|deal)/gi, 'カイゴト'],
  [/1バトル中に/g, /\bper match\b/gi, 'ワンマッチ'],
  [/1回で/g, /\bfrom a single\b/gi, 'イッカイデ'],
  [/Lv\.2靴/g, /\bupgraded footwear\b/gi, 'ジョウイクツ'],
  [/2倍/g, /\bdoubled?\b/gi, 'ニバイ'],
  [/3回ごと/g, /\bevery third\b/gi, 'サンカイゴト'],
  [/1回/g, /\bonce\b/gi, 'イッカイ'],
];

function canonical(s, isJa) {
  let t = s;
  // 範囲を示すダッシュは3種類が混在している（- – —）
  t = t.replace(/[–—－-]/g, '~');
  // 桁区切りのカンマ: 1,200 -> 1200
  t = t.replace(/(?<=\d),(?=\d)/g, '');
  // 英語の時刻表記 20:00 / 04:00 は日本語の「20分」「4分」
  if (!isJa) t = t.replace(/(\d+):00/g, (_, m) => `${Number(m)}分`);
  for (const [jaRe, enRe, token] of PAIRS) t = t.replace(isJa ? jaRe : enRe, token);
  return t;
}

const numsOf = (s, isJa) =>
  (canonical(s, isJa).match(/\d+(?:\.\d+)?/g) || []).map((x) => x.replace(/\.$/, '')).sort();

const FIELDS = [
  ['stats', 'stats_en', 'ステータス'],
  ['passive', 'passive_en', 'パッシブ'],
  ['active', 'active_en', 'アクティブ'],
];

const empties = [];
const diffs = [];

for (const it of items) {
  for (const [jk, ek, label] of FIELDS) {
    const ja = it[jk];
    const en = it[ek];
    if (!ja || !en) {
      // 両方空なら、その装備にその欄が無いだけ（鉄剣など下位装備）
      if (Boolean(ja) !== Boolean(en)) {
        empties.push({ it, label, side: ja ? '英語が空' : '日本語が空', text: (ja || en).slice(0, 70) });
      }
      continue;
    }
    const a = numsOf(ja, true);
    const b = numsOf(en, false);
    if (a.join() === b.join()) continue;

    // どちらにしか無い値。ここが読みどころで、「JAだけ」に並ぶ数は
    // 英語側が落としている（かその逆）候補になる
    const rest = [...b];
    const onlyJa = a.filter((x) => {
      const i = rest.indexOf(x);
      if (i >= 0) { rest.splice(i, 1); return false; }
      return true;
    });
    diffs.push({ it, label, onlyJa: [...new Set(onlyJa)], onlyEn: [...new Set(rest)], ja, en });
  }
}

console.log(`装備 ${items.length} 件の日英チェック`);
console.log('数値だけを見ている。単語の誤り（ダメージ種別など）は原理的に出ない。\n');

if (empties.length) {
  console.log(`■ 片方だけ空: ${empties.length} 件`);
  for (const e of empties) {
    console.log(`  [${e.label}] ${e.it.name} (id ${e.it.id}) — ${e.side}`);
    console.log(`      ${e.text}…`);
  }
  console.log('');
}

console.log(`■ 数値の食い違い: ${diffs.length} 件`);
for (const d of diffs) {
  console.log(`\n  [${d.label}] ${d.it.name} (id ${d.it.id})`);
  console.log(`      JAだけ: ${d.onlyJa.join(', ') || 'なし'}   ENだけ: ${d.onlyEn.join(', ') || 'なし'}`);
  if (showAll) {
    console.log(`      JA: ${d.ja}`);
    console.log(`      EN: ${d.en}`);
  }
}

if (!diffs.length && !empties.length) {
  console.log('  なし');
}
console.log('\n数値の一致は正しさの証明ではない。実機の装備ショップで日本語表示と突き合わせること。');
console.log('本文も見るなら --all。');
