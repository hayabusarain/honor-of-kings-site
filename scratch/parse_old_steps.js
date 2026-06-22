const fs = require('fs');

const logPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e3616c4c-cd9e-45b9-9e7a-2b61650ce957\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.error('Subagent transcript not found');
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
const steps = [];

for (const line of lines) {
  try {
    steps.push(JSON.parse(line));
  } catch (e) {}
}

const oldModelSteps = steps.filter(s => s.step_index < 133 && s.source === 'MODEL');

console.log(`Found ${oldModelSteps.length} MODEL steps in previous run.`);
for (const step of oldModelSteps) {
  console.log(`Step ${step.step_index} (${step.type}):`);
  if (step.thinking) console.log(`  Thinking snippet: ${step.thinking.substring(0, 1000)}`);
  if (step.content) console.log(`  Content snippet: ${step.content.substring(0, 1000)}`);
  console.log('--------------------------------------------------');
}
