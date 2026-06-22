const fs = require('fs');
const path = require('path');

const imgDir = path.resolve(__dirname, '../public/images/items/raw');
const jsonDir = path.resolve(__dirname, '../scratch/extracted_items');

if (!fs.existsSync(imgDir)) {
  console.error(`Image directory does not exist: ${imgDir}`);
  process.exit(1);
}

const images = fs.readdirSync(imgDir).filter(f => f.toLowerCase().endsWith('.png'));
console.log(`Total screenshots: ${images.length}`);

let missingCount = 0;
const missing = [];

images.forEach(img => {
  const base = path.parse(img).name; // e.g. "スクリーンショット (81)"
  
  // Possible json names
  const json1 = `${base}.json`;
  const json2 = `${img}.json`;
  
  const path1 = path.join(jsonDir, json1);
  const path2 = path.join(jsonDir, json2);
  
  if (!fs.existsSync(path1) && !fs.existsSync(path2)) {
    missingCount++;
    missing.push(img);
  }
});

console.log(`Missing JSONs: ${missingCount}`);
if (missingCount > 0) {
  console.log('Missing files:', missing);
} else {
  console.log('ALL images have corresponding JSON outputs!');
}
