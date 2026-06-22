const fs = require('fs');
const logPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
let count = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('USER_INPUT') && (line.includes('uri') || line.includes('displayname') || line.includes('name') || line.includes('mime_type'))) {
    try {
      const obj = JSON.parse(line);
      count++;
      console.log(`Line ${i} (Step ${obj.step_index}): ${line.substring(0, 1000)}`);
    } catch (e) {}
  }
}
console.log(`Found ${count} lines.`);
