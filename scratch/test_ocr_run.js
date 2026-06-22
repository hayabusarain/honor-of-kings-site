const cp = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  const ocrPath = path.join(__dirname, 'ocr.exe');
  const imagePath = 'C:\\Users\\81901\\Pictures\\ルーン\\スクリーンショット (337).png';
  const buf = cp.execSync(`"${ocrPath}" "${imagePath}"`);
  const text = buf.toString('utf8');
  console.log("OCR output successfully captured:");
  console.log(text);
  fs.writeFileSync(path.join(__dirname, 'ocr_test.txt'), text, 'utf8');
} catch (e) {
  console.error("Error executing OCR:", e);
}
