const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain';

const dirs = fs.readdirSync(brainDir);
const writes = [];

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
          if (call.name === 'write_to_file' || call.name === 'replace_file_content' || call.name === 'multi_replace_file_content') {
            const target = call.args.TargetFile;
            if (target && target.includes('extracted_items')) {
              writes.push({
                convId: dir,
                step: step.step_index,
                time: step.created_at,
                target: path.basename(target.replace(/["]/g, ''))
              });
            }
          }
        }
      }
    } catch (e) {}
  }
}

console.log(`Found ${writes.length} write calls to extracted_items:`);
// Sort by time
writes.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

console.log('--- First 10 ---');
writes.slice(0, 10).forEach(w => {
  console.log(`${w.time} - Conv: ${w.convId} Step ${w.step} - File: ${w.target}`);
});

console.log('--- Last 10 ---');
writes.slice(-10).forEach(w => {
  console.log(`${w.time} - Conv: ${w.convId} Step ${w.step} - File: ${w.target}`);
});
