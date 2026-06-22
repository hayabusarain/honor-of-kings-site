const fs = require('fs');

const ocrPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\ocr_results.json';
let ocrContent = fs.readFileSync(ocrPath, 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) {
  ocrContent = ocrContent.slice(1);
}
const ocrResults = JSON.parse(ocrContent);

const targets = [
  { name: '堅忍不抜', keys: ['堅', '忍', '不', '抜'] },
  { name: '先行投資', keys: ['先', '行', '投', '資'] },
  { name: 'チェーンアサルト', keys: ['チ', 'ェ', 'ー', 'ン', 'ア', 'サ', 'ル', 'ト'] },
  { name: 'タイラント', keys: ['タ', 'イ', 'ラ', 'ン', 'ト'] },
  { name: 'ヒュブリス', keys: ['ヒ', 'ュ', 'ブ', 'リ', 'ス', 'ヒ', 'ュ', 'プ', 'リ'] }
];

ocrResults.forEach(item => {
  const textClean = item.text.replace(/\s+/g, '');
  targets.forEach(target => {
    // Since Windows OCR might output spaces, we clean spaces first
    // Check if target name matches or characters match in order
    const matched = textClean.includes(target.name) || target.keys.every(k => textClean.includes(k));
    if (matched) {
      console.log(`Rune: ${target.name} -> Found in screenshot: ${item.filename}`);
      console.log(`Snippet: ${item.text.substring(0, 150)}...`);
      console.log('---');
    }
  });
});
