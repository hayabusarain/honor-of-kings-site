const fs = require('fs');
const path = require('path');

const itemsPath = path.join(__dirname, '../src/data/physical_items_final.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

const cropDir = path.join(__dirname, '../public/images/items/cropped');
const croppedFiles = new Set(fs.readdirSync(cropDir));

let okCount = 0;
let failCount = 0;

items.forEach(item => {
  if (item.image && item.image.startsWith('/images/items/cropped/')) {
    const filename = item.image.replace('/images/items/cropped/', '');
    if (croppedFiles.has(filename)) {
      okCount++;
    } else {
      console.log(`Mismatch: Item ${item.nameJa} has image path ${item.image} but file ${filename} does not exist in cropped directory.`);
      failCount++;
    }
  } else {
    console.log(`Item ${item.nameJa} uses external/other image: ${item.image}`);
  }
});

console.log(`Total verified: OK = ${okCount}, Failed = ${failCount}`);
