const fs = require('fs');
const path = './public/data/skills/ja.json';
const data = JSON.parse(fs.readFileSync(path, 'utf-8'));

let count = 0;

for (const id in data) {
  const hero = data[id];
  if (hero && hero.strategy) {
    const heroName = hero.hero_name || '';
    ['earlyGame', 'midGame', 'lateGame', 'teamfight'].forEach(key => {
      if (typeof hero.strategy[key] === 'string') {
        let str = hero.strategy[key].replace(/^[\s、,]+/g, '').trim();
        if (key === 'earlyGame' && !str.includes('序盤') && !str.startsWith(heroName)) {
          str = `序盤は、` + str;
        } else if (key === 'midGame' && !str.includes('中盤') && !str.startsWith(heroName)) {
          str = `中盤戦では、` + str;
        } else if (key === 'lateGame' && !str.includes('終盤') && !str.startsWith(heroName)) {
          str = `終盤戦では、` + str;
        } else if (key === 'teamfight' && !str.includes('集団戦') && !str.startsWith(heroName)) {
          str = `集団戦では、` + str;
        }
        // Clean double commas or double periods
        str = str.replace(/、、/g, '、').replace(/。。/g, '。');
        hero.strategy[key] = str;
      }
    });
    count++;
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Cleaned leading punctuation for all ${count} heroes!`);
