const fs = require('fs');
const path = require('path');

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

console.log(`Loaded ${steps.length} steps.`);

// Print all steps where model writes to media_name_mappings.json or lists mappings
console.log('--- Searching for write_to_file calls ---');
for (const step of steps) {
  if (step.tool_calls) {
    for (const call of step.tool_calls) {
      if (call.name === 'write_to_file' && call.args && call.args.TargetFile && call.args.TargetFile.includes('media_name_mappings')) {
        console.log(`Step ${step.step_index}: write_to_file to media_name_mappings.json`);
        console.log('CodeContent snippet:', call.args.CodeContent.substring(0, 1000));
        console.log('---');
      }
    }
  }
}

console.log('--- Listing last 5 MODEL steps ---');
let modelSteps = steps.filter(s => s.source === 'MODEL');
for (const step of modelSteps.slice(-5)) {
  console.log(`Step ${step.step_index} (${step.type}):`);
  if (step.thinking) console.log(`  Thinking snippet: ${step.thinking.substring(0, 500)}`);
  if (step.content) console.log(`  Content snippet: ${step.content.substring(0, 500)}`);
  if (step.tool_calls) console.log(`  Tool calls:`, JSON.stringify(step.tool_calls, null, 2));
  console.log('--------------------------------------------------');
}

