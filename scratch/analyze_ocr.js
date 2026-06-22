const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/81901/.gemini/antigravity/brain/b480f433-46b1-471d-8680-a277fd5851f3';
let ocrContent = fs.readFileSync(path.join(brainDir, 'ocr_results.json'), 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) {
  ocrContent = ocrContent.slice(1);
}
const ocrResults = JSON.parse(ocrContent);

console.log(`Loaded ${ocrResults.length} OCR results.`);

ocrResults.forEach(res => {
  console.log(`\n========================================`);
  console.log(`File: ${res.filename}`);
  console.log(`----------------------------------------`);
  // Print first 15 lines of the screenshot OCR
  console.log(res.lines.slice(0, 20).join('\n'));
});
