const fs = require('fs');
const runes = JSON.parse(fs.readFileSync('src/data/runes.json', 'utf8'));

runes.forEach(rune => {
  if (!rune.descriptionJa || !rune.descriptionEn) {
    console.log(`Rune ID: ${rune.id} (${rune.nameJa} / ${rune.nameEn}) has empty description:`);
    console.log(`  JA: "${rune.descriptionJa}"`);
    console.log(`  EN: "${rune.descriptionEn}"`);
  }
});
