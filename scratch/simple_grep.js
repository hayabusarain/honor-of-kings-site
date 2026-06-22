const fs = require('fs');
const logPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');
console.log(`Total lines: ${lines.length}`);
let found = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].toLowerCase().includes('media')) {
    found++;
    if (found <= 10) {
      console.log(`Line ${i}: ${lines[i].substring(0, 300)}`);
    }
  }
}
console.log(`Found ${found} lines containing "media"`);
