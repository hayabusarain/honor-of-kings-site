const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e3616c4c-cd9e-45b9-9e7a-2b61650ce957\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.error('Subagent transcript not found');
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
const viewCalls = [];

for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'view_file') {
          const absPath = call.args.AbsolutePath;
          if (absPath) {
            const cleaned = absPath.replace(/["]/g, '').replace(/\\\\/g, '/').replace(/\\/g, '/');
            viewCalls.push({
              step: obj.step_index,
              path: cleaned,
              time: obj.created_at
            });
          }
        }
      }
    }
  } catch (e) {}
}

console.log(`Subagent made ${viewCalls.length} view_file calls:`);
viewCalls.forEach((c, idx) => {
  console.log(`${idx + 1}: Step ${c.step} (${c.time}) - File: ${c.path}`);
});
