const fs = require('fs');

const ocrPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\ocr_results.json';
let ocrContent = fs.readFileSync(ocrPath, 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) {
  ocrContent = ocrContent.slice(1);
}
const ocrResults = JSON.parse(ocrContent);

const files = [
  'スクリーンショット (354).png',
  'スクリーンショット (355).png',
  'スクリーンショット (356).png',
  'スクリーンショット (371).png',
  'スクリーンショット (373).png'
];

files.forEach(filename => {
  const result = ocrResults.find(r => r.filename === filename);
  if (result) {
    console.log(`=== File: ${filename} ===`);
    // Print first 10 lines
    result.lines.slice(0, 25).forEach((line, idx) => {
      console.log(`  [${idx}] ${line}`);
    });
  } else {
    console.log(`=== File not found: ${filename} ===`);
  }
});
