const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain';

const viewCalls = [];

const dirs = fs.readdirSync(brainDir);
for (const dir of dirs) {
  const transcriptPath = path.join(brainDir, dir, '.system_generated', 'logs', 'transcript.jsonl');
  if (!fs.existsSync(transcriptPath)) continue;

  const content = fs.readFileSync(transcriptPath, 'utf8');
  const lines = content.split('\n').filter(Boolean);
  for (const line of lines) {
    try {
      const step = JSON.parse(line);
      if (step.tool_calls) {
        for (const call of step.tool_calls) {
          if (call.name === 'view_file') {
            const absPath = call.args.AbsolutePath;
            if (absPath) {
              const cleanedPath = absPath.replace(/["]/g, '').replace(/\\\\/g, '/').replace(/\\/g, '/');
              // We only care about item screenshots
              if (cleanedPath.includes('スクリーンショット')) {
                viewCalls.push({
                  path: cleanedPath,
                  filename: path.basename(cleanedPath),
                  timestamp: new Date(step.created_at || Date.now()).getTime(),
                  convId: dir,
                  step: step.step_index
                });
              }
            }
          }
        }
      }
    } catch (e) {}
  }
}

console.log(`Total item screenshot view calls: ${viewCalls.length}`);
viewCalls.sort((a, b) => a.timestamp - b.timestamp);

// Print the first 10 and last 10
console.log('--- First 10 ---');
viewCalls.slice(0, 10).forEach(c => {
  console.log(`${new Date(c.timestamp).toISOString()} (${c.timestamp} ms) - Conv: ${c.convId} Step: ${c.step} - File: ${c.filename}`);
});

console.log('--- Last 10 ---');
viewCalls.slice(-10).forEach(c => {
  console.log(`${new Date(c.timestamp).toISOString()} (${c.timestamp} ms) - Conv: ${c.convId} Step: ${c.step} - File: ${c.filename}`);
});
