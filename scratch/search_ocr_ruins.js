const fs = require('fs');

const ocrPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\ocr_results.json';
let ocrContent = fs.readFileSync(ocrPath, 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) {
  ocrContent = ocrContent.slice(1);
}
const ocrResults = JSON.parse(ocrContent);

const keywords = ['心撃', '溢れる力', '溢れる'];

ocrResults.forEach(item => {
  const clean = item.text.replace(/\s+/g, '');
  keywords.forEach(kw => {
    if (clean.includes(kw)) {
      console.log(`Matched "${kw}" in ${item.filename}`);
      console.log(`  Snippet: ${item.text.substring(0, 200)}`);
      console.log('---');
    }
  });
});
