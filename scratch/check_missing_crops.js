const fs = require('fs');
const path = require('path');

const itemsPath = path.join(__dirname, '../src/data/physical_items_final.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

const cropDir = path.join(__dirname, '../public/images/items/cropped');
let missingCount = 0;
let emptyCount = 0;

items.forEach(item => {
  if (item.image && item.image.startsWith('/images/items/cropped/')) {
    const fileName = item.image.replace('/images/items/cropped/', '');
    const fullPath = path.join(cropDir, fileName);
    if (!fs.existsSync(fullPath)) {
      console.log(`Missing file for ${item.nameJa}: ${fileName}`);
      missingCount++;
    } else {
      const stats = fs.statSync(fullPath);
      if (stats.size === 0) {
        console.log(`Empty file for ${item.nameJa}: ${fileName}`);
        emptyCount++;
      }
    }
  } else {
    console.log(`Not using cropped image for ${item.nameJa}: ${item.image}`);
  }
});

console.log(`Verification completed. Missing: ${missingCount}, Empty: ${emptyCount}`);
