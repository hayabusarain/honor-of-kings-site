const fs = require('fs');
const logPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (obj.step_index === 7623) {
      console.log(`Step 7623 Keys:`, Object.keys(obj));
      console.log(JSON.stringify(obj, null, 2).substring(0, 5000));
      break;
    }
  } catch(e) {}
}
