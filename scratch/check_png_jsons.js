const fs = require('fs');
const path = require('path');

const targetNumbers = [
  181, 182, 183, 184, 185, 186,
  19, 20, 21, 22, 23,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45
];

const extDir = 'C:/Users/81901/Desktop/ワイリフサイト/scratch/extracted_items';

targetNumbers.forEach(n => {
  const jsonPath = path.join(extDir, `スクリーンショット (${n}).json`);
  const pngJsonPath = path.join(extDir, `スクリーンショット (${n}).png.json`);
  
  const hasJson = fs.existsSync(jsonPath);
  const hasPngJson = fs.existsSync(pngJsonPath);
  
  let jsonContent = null;
  let pngJsonContent = null;
  
  if (hasJson) {
    try {
      jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch(e) {}
  }
  if (hasPngJson) {
    try {
      pngJsonContent = JSON.parse(fs.readFileSync(pngJsonPath, 'utf8'));
    } catch(e) {}
  }
  
  console.log(`- (${n}):`);
  console.log(`  .json: ${hasJson ? 'YES' : 'NO'} (Name: ${jsonContent?.item_name}, Gold: ${jsonContent?.gold})`);
  console.log(`  .png.json: ${hasPngJson ? 'YES' : 'NO'} (Name: ${pngJsonContent?.item_name}, Gold: ${pngJsonContent?.gold})`);
});
