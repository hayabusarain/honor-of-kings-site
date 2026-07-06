const fs = require('fs');
const path = require('path');

const heroesPath = path.join(__dirname, '../src/data/hok_heroes.json');
const heroesData = JSON.parse(fs.readFileSync(heroesPath, 'utf8'));

for (let hero of heroesData) {
  if (hero.id === 'hero_631' || hero.id === 'hero_635' || hero.id === 'hero_640') {
    if (!hero.name) {
      hero.name = hero.nameJa;
      hero.name_en = hero.nameEn;
      hero.slug = hero.nameEn ? hero.nameEn.toLowerCase() : "";
      hero.image = `/images/heroes/${hero.id}.jpg`;
      hero.title = hero.nameJa; // placeholder title
      
      // Map roles
      if (hero.id === 'hero_631') hero.role = ["Fighter"];
      if (hero.id === 'hero_635') hero.role = ["Mage"];
      if (hero.id === 'hero_640') hero.role = ["Support"];
      
      delete hero.nameCn;
      delete hero.nameEn;
      delete hero.nameJa;
    }
  }
}

fs.writeFileSync(heroesPath, JSON.stringify(heroesData, null, 2), 'utf8');
console.log("Fixed hok_heroes.json");
