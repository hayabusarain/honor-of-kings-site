const fs = require('fs');

const parentLogPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\.system_generated\\logs\\transcript.jsonl';

const lines = fs.readFileSync(parentLogPath, 'utf8').split('\n').filter(Boolean);

// We want to find steps near 1779553450815 (May 23, 2026 13:44:10.815 UTC)
// Let's check all steps between 1779553400000 and 1779553500000
const targetMs = 1779553450815;

for (let i = 0; i < lines.length; i++) {
  try {
    const step = JSON.parse(lines[i]);
    if (step.step_index >= 8035 && step.step_index <= 8045) {
      console.log(`Step ${step.step_index}:`, JSON.stringify(step, null, 2));
      console.log('==================================================');
    }
  } catch (e) {}
}
