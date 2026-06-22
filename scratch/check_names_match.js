const fs = require('fs');
const path = require('path');

const ddPath = 'src/data/physical_items_dd.json';
const extractedDir = 'scratch/extracted_items';

const ddItems = JSON.parse(fs.readFileSync(ddPath, 'utf8'));
const ddMap = new Map();
ddItems.forEach(item => {
  ddMap.set(item.nameJa.toLowerCase().replace(/\s+/g, ''), item);
});

const files = fs.readdirSync(extractedDir).filter(f => f.endsWith('.json') && !f.endsWith('.metadata.json'));

let matched = 0;
let unmatched = 0;
const unmatchedList = [];

files.forEach(file => {
  const filePath = path.join(extractedDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.item_name) {
      console.log(`Skipping file with no item_name: ${file}`);
      return;
    }
    const name = data.item_name.toLowerCase().replace(/\s+/g, '');
    if (ddMap.has(name)) {
      matched++;
    } else {
      unmatched++;
      unmatchedList.push({ file, extractedName: data.item_name });
    }
  } catch (e) {
    console.log(`Error parsing ${file}: ${e.message}`);
  }
});

console.log(`Total files: ${files.length}`);
console.log(`Matched: ${matched}`);
console.log(`Unmatched: ${unmatched}`);
if (unmatchedList.length > 0) {
  console.log('Unmatched items list:');
  console.log(JSON.stringify(unmatchedList, null, 2));
}
