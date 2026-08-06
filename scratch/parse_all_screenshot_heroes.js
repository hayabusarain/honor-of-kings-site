const fs = require('fs');

const raw = fs.readFileSync('scratch/all_screenshots_ocr.json', 'utf8').replace(/^\uFEFF/, '');
const ocrData = JSON.parse(raw);

const hokHeroes = JSON.parse(fs.readFileSync('src/data/hok_heroes.json', 'utf8'));

// Build dictionary of Japanese names and aliases
const heroList = hokHeroes.map(h => ({
  id: String(h.id),
  name: h.name,
  name_en: h.name_en || h.name,
  alias: h.search_alias || ''
}));

console.log('Total Hok Heroes in database:', heroList.length);

// Analyze screenshots in pairs (3425 -> 3652)
const parsedPairs = [];

for (let i = 0; i < ocrData.length; i++) {
  const item = ocrData[i];
  const numMatch = item.filename.match(/\((\d+)\)/);
  const num = numMatch ? parseInt(numMatch[1]) : 0;
  
  let detectedHero = null;
  
  if (num === 3430) {
    detectedHero = heroList.find(h => h.name === 'アタ' || h.id === '620');
  } else {
    for (const h of heroList) {
      if (item.text.includes(h.name)) {
        detectedHero = h;
        break;
      }
    }
  }

  if (detectedHero) {
    parsedPairs.push({
      num,
      filename: item.filename,
      hero: detectedHero,
      ocrSnippet: item.text.slice(0, 80)
    });
  }
}

console.log('Total matched hero screenshots:', parsedPairs.length);
parsedPairs.slice(0, 30).forEach(p => console.log(`(${p.num}) ${p.hero.name} (ID: ${p.hero.id})`));
