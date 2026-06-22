const fs = require('fs');

const ocrPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\ocr_results.json';
let ocrContent = fs.readFileSync(ocrPath, 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) {
  ocrContent = ocrContent.slice(1);
}
const ocrResults = JSON.parse(ocrContent);

const files = [
  'スクリーンショット (384).png',
  'スクリーンショット (385).png',
  'スクリーンショット (386).png',
  'スクリーンショット (387).png',
  'スクリーンショット (388).png',
  'スクリーンショット (389).png',
  'スクリーンショット (390).png',
  'スクリーンショット (391).png'
];

files.forEach(filename => {
  const result = ocrResults.find(r => r.filename === filename);
  if (result) {
    console.log(`=== ${filename} ===`);
    console.log(result.text.substring(0, 400));
    console.log('---');
  }
});
