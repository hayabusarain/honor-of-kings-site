/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * 各ヒーローの奥義スキルに `is_ultimate: true` を立てる。
 *
 * 背景:
 *   UI のスキルバッジは枠の位置だけで奥義を決めていた（4枠目があれば無条件に奥義）。
 *   これだと 153 蘭陵王と 176 楊貴妃で誤表示になる。どちらもスキル3が奥義で、
 *   スキル4は追加スキル（隠匿）／旋律の切替であって奥義ではない。
 *
 *   公式 HoK Camp の isUlt フラグは使えない。176 楊貴妃で実態と食い違い、
 *   635 ロリアンではスキル名と位置の対応まで崩れている（screenshots/README.md 参照）。
 *
 * 判定基準（ゲーム内表示の書き起こしから機械的に決まる）:
 *   1. レベル表が3段（Lv.1／Lv.2／Lv.3）のアクティブスキルが1つだけあれば、それが奥義。
 *      通常スキルは Lv.1〜6、パッシブは Lv.1／Lv.15 なので一意に分かれる。
 *   2. 決まらない場合は枠の位置で代用する（スキル4があればスキル4、無ければスキル3）。
 *      該当するのは形態切替型など10体で、いずれもこの代用で正しい値になることを
 *      CD と消費MP で確認済み。
 *
 * 使い方: node scripts/mark_ultimate_skills.js [--dry]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry');
const ACTIVE = ['skill1', 'skill2', 'skill3', 'skill4'];

const levelSteps = (s) => {
  const h = s && s.table && s.table.headers;
  return Array.isArray(h) ? h.length - 1 : null;
};

const ja = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/skills/ja.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/skills/en.json'), 'utf8'));

const decided = {};
const byFallback = [];
for (const [hid, v] of Object.entries(ja)) {
  const active = ACTIVE.filter((k) => v[k]);
  const threeStep = active.filter((k) => levelSteps(v[k]) === 2);
  let ult;
  if (threeStep.length === 1) {
    ult = threeStep[0];
  } else {
    ult = v.skill4 ? 'skill4' : 'skill3';
    byFallback.push(`${hid} ${v.hero_name} → ${ult}`);
  }
  decided[hid] = ult;
}

let marked = 0, cleared = 0;
for (const data of [ja, en]) {
  for (const [hid, v] of Object.entries(data)) {
    const ult = decided[hid];
    for (const k of ACTIVE) {
      if (!v[k]) continue;
      if (k === ult) {
        if (!v[k].is_ultimate) marked++;
        v[k].is_ultimate = true;
      } else if (v[k].is_ultimate !== undefined) {
        delete v[k].is_ultimate;
        cleared++;
      }
    }
  }
}

if (!DRY) {
  fs.writeFileSync(path.join(ROOT, 'public/data/skills/ja.json'), JSON.stringify(ja, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(ROOT, 'public/data/skills/en.json'), JSON.stringify(en, null, 2) + '\n', 'utf8');
}

const dist = {};
Object.values(decided).forEach((k) => { dist[k] = (dist[k] || 0) + 1; });
console.log(DRY ? '--- dry run（書き込みなし）---' : '--- 完了 ---');
console.log(`奥義に印を付けた: ${marked} 箇所 / 取り消した: ${cleared} 箇所（日英あわせて）`);
console.log('内訳:', dist);
console.log(`\nレベル表で決まらず、枠の位置で代用したヒーロー ${byFallback.length} 体:`);
byFallback.forEach((x) => console.log('  ' + x));
