const fs = require('fs');
const path = require('path');

const finalPath = path.join(__dirname, '../src/data/physical_items_final.json');
const items = JSON.parse(fs.readFileSync(finalPath, 'utf8'));

console.log(`Total items: ${items.length}`);
console.log('List of all items:');
const names = items.map(item => `${item.nameJa} (ID: ${item.id}, Gold: ${item.gold})`);
console.log(JSON.stringify(names, null, 2));
