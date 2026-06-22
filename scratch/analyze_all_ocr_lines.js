const fs = require('fs');

const ocrPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\scratch\\ocr_results.json';
let ocrContent = fs.readFileSync(ocrPath, 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) {
  ocrContent = ocrContent.slice(1);
}
const ocrResults = JSON.parse(ocrContent);

console.log(`Loaded ${ocrResults.length} screenshot OCR results.`);

for (let i = 351; i <= 363; i++) {
  const filename = `スクリーンショット (${i}).png`;
  const item = ocrResults.find(r => r.filename === filename);
  if (item) {
    console.log(`\n--- ${filename} ---`);
    item.lines.forEach((line, idx) => {
      console.log(`  [${idx}] ${line}`);
    });
  } else {
    console.log(`\n--- ${filename} NOT FOUND ---`);
  }
}
