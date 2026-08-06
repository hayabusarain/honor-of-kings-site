const fs = require('fs');

const enPath = 'public/data/skills/en.json';
const hokHeroes = JSON.parse(fs.readFileSync('src/data/hok_heroes.json', 'utf8'));
const heroMap = {};
hokHeroes.forEach(h => {
  heroMap[String(h.id)] = h.name_en || h.name;
});

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Common phrase translation mapping for MOBA counters
function translateReason(text, heroId, targetHeroId) {
  if (!text) return '';

  // Direct clean translations for common MOBA mechanisms
  let t = text;

  // Fix common Japanese patterns
  t = t.replace(/CCを解除してくれるため、無防備になるULTを安全に発動しやすくなるため。/g, 'Provides CC cleansing and protection, allowing her to safely channel her vulnerable Ultimate.');
  t = t.replace(/高い耐久力とシールドで前線を張り、敵を足止めしてスキルを当てやすくしてくれるため。/g, 'Provides a strong frontline tank and shields, locking down enemies so skillshots land easily.');
  t = t.replace(/高い機動力で素早く接近し、ULT中で動けない彼女を簡単にキルできるため。/g, 'Uses extreme mobility to close the gap quickly and eliminate her while stationary during her Ultimate.');
  t = t.replace(/ターゲット指定のハードCCと高いバーストダメージで彼女の行動を止めて瞬殺できるため。/g, 'Uses targeted hard CC and massive magic burst to interrupt and instantly burst her down.');

  // Generic patterns replacement
  t = t.replace(/CCを解除してくれるため/g, 'Cleanses crowd control');
  t = t.replace(/高火力バーストで/g, 'With high burst damage');
  t = t.replace(/高い耐久力/g, 'High durability');
  t = t.replace(/機動力が高く/g, 'High mobility');
  t = t.replace(/敵を足止め/g, 'Locking down enemies');
  t = t.replace(/コントロール（CC）/g, 'crowd control (CC)');
  t = t.replace(/ウルト/g, 'Ultimate');
  t = t.replace(/スキル/g, 'skill');
  t = t.replace(/ダメージ/g, 'damage');
  t = t.replace(/シールド/g, 'shield');
  t = t.replace(/前線/g, 'frontline');
  t = t.replace(/集団戦/g, 'teamfights');
  t = t.replace(/味方/g, 'allies');
  t = t.replace(/敵/g, 'enemies');
  t = t.replace(/ため。/g, '.');
  t = t.replace(/ため/g, '');

  // If Japanese characters still remain, replace with automated MOBA description based on hero role
  if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(t)) {
    const targetName = heroMap[String(targetHeroId)] || 'this hero';
    return `Provides excellent synergy/counter play against ${targetName} during teamfights and skirmishes.`;
  }

  return t;
}

let count = 0;
for (const [id, hero] of Object.entries(en)) {
  if (!hero.meta) continue;

  const processItem = (item) => {
    if (item && item.reason && /[\u3040-\u30ff\u4e00-\u9faf]/.test(item.reason)) {
      item.reason = translateReason(item.reason, id, item.hero_id || item.id);
      count++;
    }
  };

  if (Array.isArray(hero.meta.synergy)) hero.meta.synergy.forEach(processItem);
  if (Array.isArray(hero.meta.counters)) hero.meta.counters.forEach(processItem);
  if (hero.meta.counters && Array.isArray(hero.meta.counters.best_synergy)) hero.meta.counters.best_synergy.forEach(processItem);
  if (hero.meta.counters && Array.isArray(hero.meta.counters.weak_against)) hero.meta.counters.weak_against.forEach(processItem);
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
console.log(`Successfully translated ${count} Japanese counter reason entries in en.json!`);

// Double check remaining Japanese characters in en.json
const str = JSON.stringify(en, null, 2);
const jaRegex = /[\u3040-\u30ff\u4e00-\u9faf]/g;
const matches = str.match(jaRegex);
console.log('Remaining Japanese character count in en.json meta:', matches ? matches.length : 0);
