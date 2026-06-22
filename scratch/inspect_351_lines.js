const fs = require('fs');

const ocrPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\ocr_results.json';
let ocrContent = fs.readFileSync(ocrPath, 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) {
  ocrContent = ocrContent.slice(1);
}
const ocrResults = JSON.parse(ocrContent);

const file = ocrResults.find(r => r.filename === 'スクリーンショット (351).png');
if (file) {
  console.log("=== Screenshot 351 lines ===");
  file.lines.forEach((l, idx) => {
    console.log(`  [${idx}] ${l}`);
  });
}
