const fs = require('fs');
const path = require('path');

const ddPath = path.join(__dirname, '../src/data/physical_items_dd.json');
const finalPath = path.join(__dirname, '../src/data/physical_items_final.json');

const ddItems = JSON.parse(fs.readFileSync(ddPath, 'utf8'));
const finalItems = JSON.parse(fs.readFileSync(finalPath, 'utf8'));

const ddMap = new Set();
ddItems.forEach(item => {
  ddMap.add(item.nameJa.toLowerCase().replace(/\s+/g, ''));
});

const missing = [];
finalItems.forEach(item => {
  const norm = item.nameJa.toLowerCase().replace(/\s+/g, '');
  if (!ddMap.has(norm)) {
    missing.push(item.nameJa);
  }
});

console.log(`Items in final database that are NOT in physical_items_dd.json (count: ${missing.length}):`);
console.log(missing);
