const fs = require('fs');
const logPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
let count = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('media__') && (line.includes('スクリーンショット') || line.includes('copy') || line.includes('cp'))) {
    count++;
    console.log(`Line ${i}: ${line.substring(0, 500)}`);
  }
}
console.log(`Found ${count} lines.`);
