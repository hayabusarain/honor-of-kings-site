const fs = require('fs');

const ocrPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\ocr_results.json';
let ocrContent = fs.readFileSync(ocrPath, 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) {
  ocrContent = ocrContent.slice(1);
}
const ocrResults = JSON.parse(ocrContent);

const missingTargets = [
  { id: 'empowerment', search: 'エンパワーメント' },
  { id: 'ingenious_hunter', search: '巧妙な賞金' },
  { id: 'brutal', search: 'ブルータル' },
  { id: 'legend_tenacity', search: '強靭' },
  { id: 'hextech_flashtraption', search: 'ヘクスフラッシュ' },
  { id: 'futures_market', search: '先行投資' }
];

missingTargets.forEach(target => {
  console.log(`=== Searching for ${target.id} (${target.search}) ===`);
  const found = ocrResults.filter(item => {
    const cleanOcr = item.text.replace(/\s+/g, '');
    return cleanOcr.includes(target.search);
  });

  if (found.length === 0) {
    console.log("  Not found in OCR results");
  } else {
    found.forEach(item => {
      console.log(`  File: ${item.filename}`);
      // Find the line containing the keyword and print lines around it
      const lineIdx = item.lines.findIndex(l => l.replace(/\s+/g, '').includes(target.search));
      if (lineIdx !== -1) {
        console.log("  Lines:");
        item.lines.slice(lineIdx, lineIdx + 12).forEach((l, i) => {
          console.log(`    [+${i}] ${l}`);
        });
      } else {
        console.log("  Text snippet:", item.text.substring(0, 300));
      }
      console.log('  ---');
    });
  }
});
