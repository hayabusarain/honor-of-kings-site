const fs = require('fs');

const ocrPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\ocr_results.json';
let ocrContent = fs.readFileSync(ocrPath, 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) {
  ocrContent = ocrContent.slice(1);
}
const ocrResults = JSON.parse(ocrContent);

const targets = ['投', 'プル', 'ブル'];

ocrResults.forEach(item => {
  const clean = item.text.replace(/\s+/g, '');
  targets.forEach(t => {
    if (clean.includes(t)) {
      console.log(`Matched "${t}" in ${item.filename}`);
      console.log(`  Snippet: ${item.text.substring(0, 200)}`);
      console.log('  ---');
    }
  });
});
