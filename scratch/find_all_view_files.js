const fs = require('fs');
const logPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.error('Parent transcript not found');
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
const calls = [];

for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'view_file') {
          const pathStr = (call.args.AbsolutePath || call.args.path || JSON.stringify(call.args)).replace(/"/g, '');
          if (pathStr.toLowerCase().endsWith('.png')) {
            calls.push({
              step: obj.step_index,
              path: pathStr,
              time: obj.created_at
            });
          }
        }
      }
    }
  } catch (e) {}
}

console.log(`Total PNG view_file calls in parent transcript: ${calls.length}`);
console.log(JSON.stringify(calls, null, 2));

