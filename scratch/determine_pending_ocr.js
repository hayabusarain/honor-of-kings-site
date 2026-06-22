const fs = require('fs');
const path = require('path');

const imgDir = path.resolve(__dirname, '../public/images/items/raw');
const jsonDir = path.resolve(__dirname, '../scratch/extracted_items');

const images = fs.readdirSync(imgDir).filter(f => f.toLowerCase().endsWith('.png'));

// Sort files numerically
images.sort((a, b) => {
  const matchA = a.match(/\((\d+)\)/);
  const matchB = b.match(/\((\d+)\)/);
  if (matchA && matchB) {
    return parseInt(matchA[1]) - parseInt(matchB[1]);
  }
  return a.localeCompare(b);
});

const pending = [];

images.forEach(img => {
  const base = path.parse(img).name;
  const jsonPath1 = path.join(jsonDir, `${base}.json`);
  const jsonPath2 = path.join(jsonDir, `${img}.json`);
  
  let hasJson = false;
  let hasGold = false;
  let existingData = null;
  
  if (fs.existsSync(jsonPath1)) {
    hasJson = true;
    try {
      existingData = JSON.parse(fs.readFileSync(jsonPath1, 'utf8'));
      if (existingData.gold !== undefined) {
        hasGold = true;
      }
    } catch(e){}
  } else if (fs.existsSync(jsonPath2)) {
    hasJson = true;
    try {
      existingData = JSON.parse(fs.readFileSync(jsonPath2, 'utf8'));
      if (existingData.gold !== undefined) {
        hasGold = true;
      }
    } catch(e){}
  }
  
  if (!hasJson || !hasGold) {
    pending.push({
      image: img,
      hasJson,
      hasGold,
      existingName: existingData ? existingData.item_name : null
    });
  }
});

console.log(`Total images: ${images.length}`);
console.log(`Pending images: ${pending.length}`);
console.log('List of pending images (first 20):');
console.log(pending.slice(0, 20));

// Write all pending to a JSON file so subagents or scripts can read it
fs.writeFileSync(path.join(__dirname, 'pending_ocr.json'), JSON.stringify(pending, null, 2), 'utf8');
console.log('Saved pending list to scratch/pending_ocr.json');
