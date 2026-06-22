const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../scratch/extracted_items');
if (!fs.existsSync(dir)) {
  console.error('Directory not found');
  process.exit(1);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.endsWith('.metadata.json'));
let goldCount = 0;
let totalCount = 0;

files.forEach(file => {
  totalCount++;
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (data.gold !== undefined) {
      goldCount++;
      console.log(`File: ${file} | Name: ${data.item_name} | Gold: ${data.gold}`);
    }
  } catch(e){}
});

console.log(`Total JSONs: ${totalCount}`);
console.log(`JSONs with gold: ${goldCount}`);
