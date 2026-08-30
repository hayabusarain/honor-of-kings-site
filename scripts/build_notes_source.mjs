#!/usr/bin/env node
/**
 * ビルド解説（src/content/buildNotes.ts）を書くための材料を、ヒーローごとに書き出す。
 *
 * 使い方: node scripts/build_notes_source.mjs [出力先ディレクトリ]
 *         既定は scratch/build-notes-source/（gitignore 済み）
 *
 * ビルドを撮り直したら、まずこれを走らせて材料を作り直す。
 * 手順の全体は docs/BUILD_NOTES.md に書いてある。
 *
 * ## なぜ材料ファイルを挟むのか
 *
 * 解説を書く相手（人でもAIでも）に、装備マスタ100KBとビルド一覧50KBを
 * 毎回読ませるのは無駄が多い。それ以上に、**スキルの情報を渡さないため**にこの形にした。
 *
 * 2026-08-31 の最初の版では、スキル説明も一緒に渡して「スキルと装備の噛み合いを書け」と
 * 指示した。結果、27本中15本がスキルの解説になり、検証で78件の指摘が出た。
 * その大半がスキル仕様の読み違い。装備データだけを渡せば、その種の誤りは起きない。
 *
 * ## 出力に入れているもの
 *
 *   買う順に並べた装備6品（価格・ここまでの累計G・stats・パッシブ・アクティブ）
 *   アルカナ3種（1枠ぶんの効果と装着枠数）
 *   装備＋アルカナの総合計（stats を実際に足したもの）
 *   2本の違い（顔ぶれ・アルカナ・サモナースペル・買う順が違う品目）
 *   そのヒーローで何を書くべきかの指示（差の大きさから決まる）
 *
 * ## 並び順が買う順であることの確認（2026-08-31）
 *
 *   靴の位置        1品目 120本 / 2品目 106本 / 3品目 1本 / 4〜6品目 0本
 *   品目別の平均価格 1,370G → 1,431G → 2,096G → 2,118G → 2,147G → 2,173G
 *
 * 表示順なら靴が6品目に来るビルドがあるはずだが、227本中0本だった。
 * 安い立ち上がり装備が前、高い完成装備が後ろに単調に並ぶ。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const outDir = process.argv[2] || path.join(root, 'scratch', 'build-notes-source');

const builds = readJson('src/data/hero_item_builds.json');
const itemsData = readJson('src/data/hok_items.json');
const arcanaData = readJson('src/data/hok_arcanas.json');
const spellsData = readJson('src/data/hok_spells.json');
const heroesData = readJson('src/data/hok_heroes.json');
const campStats = readJson('src/data/hero_stats_camp.json');

const item = Object.fromEntries(itemsData.map((i) => [i.id, i]));
const arcana = Object.fromEntries(arcanaData.map((a) => [a.id, a]));
const spell = Object.fromEntries(spellsData.map((s) => [s.id, s]));
const hero = Object.fromEntries(heroesData.map((h) => [h.id, h]));

const strip = (html) => (html || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
const priceOf = (id) => item[id].totalPrice ?? item[id].price;

/**
 * stats を足し合わせる。書式が2通りあるので両方拾う。
 *   装備   '+90 物理攻撃, +7.5% クールダウン短縮'
 *   アルカナ '物理攻撃 +5.3, 物理防御貫通 +3.6'
 */
const addStats = (acc, text) => {
  for (const part of String(text).split(',')) {
    const s = part.trim();
    let m = s.match(/^\+([\d.]+)(%?)\s*(.+)$/);
    if (m) {
      const key = m[3] + (m[2] || '');
      acc[key] = (acc[key] || 0) + parseFloat(m[1]);
      continue;
    }
    m = s.match(/^(.+?)\s*\+([\d.]+)(%?)$/);
    if (m) {
      const key = m[1] + (m[3] || '');
      acc[key] = (acc[key] || 0) + parseFloat(m[2]);
    }
  }
};

const formatStats = (acc) =>
  Object.entries(acc)
    .map(([k, v]) => `${k.replace(/%$/, '')} +${Math.round(v * 10) / 10}${k.endsWith('%') ? '%' : ''}`)
    .join(' ／ ') || 'なし';

fs.mkdirSync(outDir, { recursive: true });

let written = 0;
for (const [heroId, sets] of Object.entries(builds)) {
  if (!sets.length) continue;
  const h = hero[heroId];
  const lines = [];

  lines.push(`# ${h ? h.name : heroId}（ID ${heroId}）`);
  lines.push(`ロール: ${(h?.role ?? []).join('・') || '不明'} ／ レーン: ${campStats[heroId]?.lane ?? '不明'}`);
  lines.push('');
  lines.push('**装備は買う順に並んでいる。1品目が最初に買うもの。**');
  lines.push('**スキルの情報は意図的に載せていない。装備とアルカナだけで書く。**');

  sets.forEach((set, si) => {
    const total = set.items.reduce((s, id) => s + priceOf(id), 0);
    const spellName = spell[set.spell]?.japanese_name ?? set.spell;
    lines.push('');
    lines.push(`## ビルド${si + 1}（装備合計 ${total.toLocaleString()}G ／ サモナースペル: ${spellName}）`);

    let cumulative = 0;
    set.items.forEach((id, i) => {
      const it = item[id];
      cumulative += priceOf(id);
      lines.push(`${i + 1}. **${it.name}** ${priceOf(id)}G（ここまで ${cumulative.toLocaleString()}G） ／ ${strip(it.stats)}`);
      if (strip(it.passive)) lines.push(`    - パッシブ: ${strip(it.passive)}`);
      if (strip(it.active)) lines.push(`    - アクティブ: ${strip(it.active)}`);
    });
    for (const a of set.arcana) {
      lines.push(`- アルカナ **${arcana[a.id].name}** ×${a.count}枠（1枠 ${arcana[a.id].stats}）`);
    }

    const all = {};
    for (const id of set.items) addStats(all, strip(item[id].stats));
    for (const a of set.arcana) for (let i = 0; i < a.count; i++) addStats(all, arcana[a.id].stats);
    lines.push('');
    lines.push(`**装備＋アルカナの総合計: ${formatStats(all)}**`);
  });

  // 2本あるヒーローは、差の大きさで書き方が変わる。ここで何を書くべきかまで示す
  if (sets.length === 2) {
    const [a, b] = sets;
    const setA = new Set(a.items);
    const setB = new Set(b.items);
    const onlyA = [...setA].filter((x) => !setB.has(x)).map((x) => item[x].name);
    const onlyB = [...setB].filter((x) => !setA.has(x)).map((x) => item[x].name);
    const shared = [...setA].filter((x) => setB.has(x)).map((x) => item[x].name);
    const arcA = a.arcana.map((x) => `${arcana[x.id].name}x${x.count}`).join('・');
    const arcB = b.arcana.map((x) => `${arcana[x.id].name}x${x.count}`).join('・');
    const swapped = [];
    a.items.forEach((x, i) => { if (x !== b.items[i]) swapped.push(i + 1); });

    lines.push('');
    lines.push('## 2本の違い（ここを読んでから書く）');
    lines.push(`- 共通の装備: ${shared.join('・') || 'なし'}`);
    lines.push(`- ビルド1だけ: ${onlyA.join('・') || '**なし。装備の顔ぶれは完全に同じ**'}`);
    lines.push(`- ビルド2だけ: ${onlyB.join('・') || '**なし。装備の顔ぶれは完全に同じ**'}`);
    lines.push(`- アルカナ: ${arcA === arcB ? '**2本とも同じ**' : `ビルド1=${arcA} ／ ビルド2=${arcB}`}`);
    lines.push(`- サモナースペル: ${a.spell === b.spell ? '2本とも同じ' : '違う'}`);
    if (swapped.length) {
      lines.push(`- 買う順が違う品目: ${swapped.join('・')}品目`);
      for (const p of swapped) {
        const x = a.items[p - 1];
        const y = b.items[p - 1];
        lines.push(`    ${p}品目 … ビルド1=${item[x].name}(${priceOf(x)}G) ／ ビルド2=${item[y].name}(${priceOf(y)}G)`);
      }
    } else {
      lines.push('- 買う順: **完全に同じ**');
    }

    lines.push('');
    if (onlyA.length === 0 && arcA === arcB) {
      lines.push('**顔ぶれは同じで、違うのは買う順だけ。その入れ替えが何を早めるのかを書く。**');
    } else if (onlyA.length === 0) {
      lines.push('**装備は同じ。違いはアルカナと買う順だけ。そこを書く。**');
    } else if (onlyA.length <= 2) {
      lines.push(`**差が装備${onlyA.length}品と小さい。構成全体の対立軸ではなく、その差分と買う順を説明する。**`);
    } else {
      lines.push(`**装備${onlyA.length}品が違う。構成の性格そのものが違うので、何を狙っているかの対比で書く。**`);
    }
  }

  fs.writeFileSync(path.join(outDir, `${heroId}.md`), lines.join('\n'), 'utf8');
  written++;
}

console.log(`材料ファイル ${written}件を書き出した: ${outDir}`);
