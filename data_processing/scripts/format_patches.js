const fs = require('fs');
const path = require('path');

const patchesFile = path.resolve('src/data/patches.json');
const heroesFile = path.resolve('src/data/hok_heroes.json');

const heroes = JSON.parse(fs.readFileSync(heroesFile, 'utf8'));
let patches = JSON.parse(fs.readFileSync(patchesFile, 'utf8'));

// 1. Remove duplicates (keep the first occurrence of each id)
const seenIds = new Set();
patches = patches.filter(p => {
  if (seenIds.has(p.id)) return false;
  seenIds.add(p.id);
  return true;
});

// 2. Fix names and hero_ids
patches.forEach(p => {
  if (p.hero_name === '哪吒') p.hero_name = 'ナタク';
  if (p.hero_name === '裴擒虎') p.hero_name = 'タイガー';
  if (p.hero_name === '荘周') p.hero_name = '荘子';
  
  if (!p.hero_id && p.hero_name) {
    const h = heroes.find(x => x.name === p.hero_name || x.name_en === p.hero_name_en);
    if (h) p.hero_id = h.id;
  }
});

// 3. Ensure Devara is present (since we restored from old python script that didn't have him)
if (!patches.find(p => p.hero_id === 'hero_113')) {
  patches.unshift({
    version: '6.17',
    change_type: 'new',
    hero_name: 'デーヴァラ',
    hero_name_en: 'Devara',
    description: '新ヒーロー実装。雷を操るファイター/メイジ。',
    description_en: 'New Hero Released.',
    is_hero: true,
    id: 'patch_6_17_hero_113',
    hero_id: 'hero_113'
  });
}

// 4. Format line breaks
const jaRegex = /(パッシブ：|スキル1：|スキル2：|スキル3：|スキル4：|ウルト：|通常形態：|復讐形態（闇）：|支配形態（光）：|新規：)/g;
const enRegex = /(Passive:|Skill 1:|Skill 2:|Skill 3:|Ultimate:|Standard Form:|Revenge Form \(Dark\):|Domination Form \(Light\):|New:)/g;

patches.forEach(p => {
  if (p.description) {
    p.description = p.description.replace(jaRegex, '\n$1').replace(/\n\n/g, '\n').trim();
  }
  if (p.description_en) {
    p.description_en = p.description_en.replace(enRegex, '\n$1').replace(/\n\n/g, '\n').trim();
  }
});

fs.writeFileSync(patchesFile, JSON.stringify(patches, null, 2), 'utf8');
console.log('Patches formatted properly.');
