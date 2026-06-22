const fs = require('fs');

const ocrPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\b480f433-46b1-471d-8680-a277fd5851f3\\\\ocr_results.json';
if (fs.existsSync(ocrPath)) {
  let content = fs.readFileSync(ocrPath, 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  const data = JSON.parse(content);
  console.log(`Loaded ${data.length} entries.`);
  
  const keywords = ['巨人の勇気', 'ボタニスト', 'シードジャー', '不屈', 'タイラント', 'アサルト', 'オーバーロード', 'アイスオーバーロード', 'チェーンアサルト', '集団狩り', 'アブラプトディケィ'];
  
  data.forEach(item => {
    const rawText = item.text || (item.lines ? item.lines.join('\n') : '');
    const cleanText = rawText.replace(/\s+/g, '');
    const matched = [];
    keywords.forEach(kw => {
      if (cleanText.includes(kw)) {
        matched.push(kw);
      }
    });
    if (matched.length > 0) {
      console.log(`Matched ${item.filename} for [${matched.join(', ')}]. Clean text snippet:`);
      console.log(`  ${cleanText.substring(0, 300)}`);
    }
  });
  
} else {
  console.log("ocr_results.json not found");
}
