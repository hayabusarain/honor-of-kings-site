const fs = require('fs');

const logPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e3616c4c-cd9e-45b9-9e7a-2b61650ce957\\.system_generated\\logs\\transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
const steps = [];

for (const line of lines) {
  try {
    steps.push(JSON.parse(line));
  } catch (e) {}
}

for (let i = 110; i < Math.min(150, steps.length); i++) {
  const step = steps[i];
  console.log(`Step ${i} (Index ${step.step_index}, Source ${step.source}, Type ${step.type}):`);
  if (step.thinking) console.log(`  Thinking: ${step.thinking}`);
  if (step.content) console.log(`  Content: ${step.content.substring(0, 500)}`);
  if (step.tool_calls) console.log(`  Tool calls:`, JSON.stringify(step.tool_calls, null, 2));
  console.log('--------------------------------------------------');
}
