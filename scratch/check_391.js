const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/81901/.gemini/antigravity/brain/b480f433-46b1-471d-8680-a277fd5851f3';
let ocrContent = fs.readFileSync(path.join(brainDir, 'ocr_results.json'), 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) ocrContent = ocrContent.slice(1);
const ocrResults = JSON.parse(ocrContent);

const filesInOcr = ocrResults.map(x => x.filename);
console.log('Files in OCR results:', filesInOcr.length);

const s391 = ocrResults.find(x => x.filename.includes('391'));
if (s391) {
  console.log('Screen 391 found! Lines:');
  console.log(s391.lines.slice(0, 30).join('\n'));
} else {
  console.log('Screen 391 not in ocr_results.json');
}
