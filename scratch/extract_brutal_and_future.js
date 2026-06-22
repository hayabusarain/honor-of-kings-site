const fs = require('fs');

const ocrPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\ocr_results.json';
let ocrContent = fs.readFileSync(ocrPath, 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) {
  ocrContent = ocrContent.slice(1);
}
const ocrResults = JSON.parse(ocrContent);

const brutalFile = ocrResults.find(r => r.filename === 'スクリーンショット (361).png');
if (brutalFile) {
  console.log("=== Brutal in screenshot 361 ===");
  brutalFile.lines.forEach((line, idx) => {
    if (line.replace(/\s+/g, '').includes('プルータル') || idx > 10 && idx < 22) {
      console.log(`  [${idx}] ${line}`);
    }
  });
}

// Find matches for "投" (Futures Market)
console.log("\n=== Searching for Futures Market ===");
ocrResults.forEach(item => {
  const clean = item.text.replace(/\s+/g, '');
  if (clean.includes('投')) {
    console.log(`File: ${item.filename}`);
    const lineIdx = item.lines.findIndex(l => l.replace(/\s+/g, '').includes('投'));
    if (lineIdx !== -1) {
      item.lines.slice(lineIdx, lineIdx + 10).forEach((l, i) => {
        console.log(`  [+${i}] ${l}`);
      });
    }
    console.log('---');
  }
});
