const fs = require('fs');
const path = require('path');

const itemsPath = path.join(__dirname, '../src/data/physical_items_final.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

// We also want to map names to extracted JSONs to see what screenshot was chosen.
const extDir = path.join(__dirname, '../scratch/extracted_items');
const jsonFiles = fs.readdirSync(extDir).filter(f => f.endsWith('.json') && !f.endsWith('.metadata.json'));

const normalizeName = (name) => {
  if (!name) return "";
  return name.replace(/\s+/g, '')
             .replace(/[・＝\-\[\]\.]/g, '')
             .replace(/[ー]/g, '')
             .toLowerCase().trim();
};

const fileToItem = {};
jsonFiles.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(extDir, file), 'utf8'));
  const base = file.replace('.png.json', '').replace('.json', '');
  if (data.item_name && data.item_name !== 'null' && data.item_name !== 'N/A' && data.item_name.trim() !== '') {
    const norm = normalizeName(data.item_name);
    if (!fileToItem[norm]) fileToItem[norm] = [];
    fileToItem[norm].push({
      base,
      gold: data.gold || 0,
      hasPassives: data.passives && data.passives.length > 0
    });
  }
});

console.log("Item mappings and count of screenshots:");
items.forEach(item => {
  const norm = normalizeName(item.nameJa);
  const sources = fileToItem[norm] || [];
  const image = item.image;
  console.log(`Item: ${item.nameJa} (${item.gold}G) -> Image: ${image}`);
  console.log(`  Sources: ${sources.map(s => `${s.base} (gold:${s.gold}, passives:${s.hasPassives})`).join(', ')}`);
});
