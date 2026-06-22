const fs = require('fs');
const path = require('path');

const targetNumbers = [
  181, 182, 183, 184, 185, 186,
  19, 20, 21, 22, 23,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45
];

const extDir = 'C:/Users/81901/Desktop/ワイリフサイト/scratch/extracted_items';
const missing = [];
const found = [];

targetNumbers.forEach(n => {
  const file1 = path.join(extDir, `スクリーンショット (${n}).json`);
  const file2 = path.join(extDir, `スクリーンショット (${n}).png.json`);
  if (fs.existsSync(file1)) {
    found.push({ number: n, path: file1 });
  } else if (fs.existsSync(file2)) {
    found.push({ number: n, path: file2 });
  } else {
    missing.push(n);
  }
});

console.log('--- PROGRESS REPORT ---');
console.log('Total targets:', targetNumbers.length);
console.log('Found targets count:', found.length);
console.log('Missing targets count:', missing.length);
console.log('Missing targets:', missing);
console.log('Found files list:');
found.forEach(f => {
  try {
    const data = JSON.parse(fs.readFileSync(f.path, 'utf8'));
    console.log(`- (${f.number}) Name: ${data.item_name}, Gold: ${data.gold}, Stats: ${data.stats.join(', ')}`);
  } catch (e) {
    console.log(`- (${f.number}) Error reading ${f.path}`);
  }
});
