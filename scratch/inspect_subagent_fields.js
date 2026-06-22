const fs = require('fs');
const path = require('path');

const scratchDir = 'c:/Users/81901/Desktop/ワイリフサイト/scratch';

for (let i = 1; i <= 4; i++) {
  const filePath = path.join(scratchDir, `transcribed_group_${i}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`\n=== Group ${i} ===`);
    Object.entries(data).forEach(([key, val]) => {
      console.log(`  [${key}] nameJa: "${val.nameJa}"`);
      console.log(`    desc: "${val.descriptionJa}"`);
    });
  }
}
