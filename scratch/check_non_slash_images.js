const fs = require('fs');
const path = require('path');

const itemsPath = path.join(__dirname, '../src/data/physical_items_final.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

let count = 0;
items.forEach(item => {
  if (!item.image.startsWith('/')) {
    console.log(`Item ${item.nameJa} has non-slash image path: ${item.image}`);
    count++;
  }
});

console.log(`Total non-slash images: ${count}`);
