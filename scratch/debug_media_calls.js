const fs = require('fs');
const logPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
let count = 0;
for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'view_file') {
          const absPath = call.args.AbsolutePath;
          if (absPath && (absPath.includes('media') || absPath.includes('tempmediaStorage'))) {
            count++;
            if (count <= 20) {
              console.log(`Step ${obj.step_index}: view_file path: ${absPath}`);
            }
          }
        }
      }
    }
  } catch (e) {}
}
console.log(`Total media view_file calls: ${count}`);
