const fs = require('fs');

const enPath = 'public/data/skills/en.json';
const hokHeroes = JSON.parse(fs.readFileSync('src/data/hok_heroes.json', 'utf8'));

// Build lookup map by id, name, and name_en
const heroIdMap = {};
hokHeroes.forEach(h => {
  heroIdMap[String(h.id)] = h.name_en || h.name;
});

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

let count = 0;
for (const [id, hero] of Object.entries(en)) {
  if (!hero.meta) continue;

  const fixHeroNames = (list) => {
    if (!Array.isArray(list)) return;
    list.forEach(item => {
      const hid = String(item.hero_id || item.id || '');
      if (hid && heroIdMap[hid]) {
        if (item.hero_name !== heroIdMap[hid]) {
          item.hero_name = heroIdMap[hid];
          count++;
        }
      }
      if (item.name && heroIdMap[hid]) {
        item.name = heroIdMap[hid];
      }
    });
  };

  if (Array.isArray(hero.meta.synergy)) fixHeroNames(hero.meta.synergy);
  if (Array.isArray(hero.meta.counters)) fixHeroNames(hero.meta.counters);
  if (hero.meta.counters && Array.isArray(hero.meta.counters.best_synergy)) fixHeroNames(hero.meta.counters.best_synergy);
  if (hero.meta.counters && Array.isArray(hero.meta.counters.weak_against)) fixHeroNames(hero.meta.counters.weak_against);
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
console.log(`Successfully updated ${count} hero names to English in en.json counters/synergy!`);

// Double check remaining Japanese characters in en.json
const str = JSON.stringify(en, null, 2);
const jaRegex = /[\u3040-\u30ff\u4e00-\u9faf]/g;
const matches = str.match(jaRegex);
console.log('FINAL Japanese character count in en.json:', matches ? matches.length : 0);
