const fs = require('fs');

const ocrPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\b480f433-46b1-471d-8680-a277fd5851f3\\\\ocr_results.json';
if (!fs.existsSync(ocrPath)) {
  console.log("ocr_results.json not found");
  process.exit(1);
}

let content = fs.readFileSync(ocrPath, 'utf8');
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}
const data = JSON.parse(content);

console.log(`Analyzing ${data.length} screenshots:`);

data.forEach((item, index) => {
  const lines = item.lines || [];
  // Let's filter lines that are empty or garbage
  const cleanedLines = lines.map(line => line.replace(/\s+/g, '')).filter(line => line.length > 0);
  
  console.log(`[${index}] ${item.filename}:`);
  // Print the first 10 cleaned lines to inspect where the name is
  console.log("  Cleaned lines:", cleanedLines.slice(0, 12));
});
