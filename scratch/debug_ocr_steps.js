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

console.log(`Total steps: ${steps.length}`);

// Find a step where view_file is called on a media__ file, and print it and the next 3 steps
let found = 0;
for (let i = 0; i < steps.length; i++) {
  const step = steps[i];
  if (step.tool_calls && step.tool_calls.some(c => c.name === 'view_file' && c.args.AbsolutePath && c.args.AbsolutePath.includes('media__'))) {
    console.log(`=== Match ${found + 1} (Subagent Step ${step.step_index}) ===`);
    console.log(`Step ${i} (index): ${step.type} - Tool Calls:`, JSON.stringify(step.tool_calls, null, 2));
    
    // Print next steps
    for (let j = i + 1; j <= Math.min(i + 3, steps.length - 1); j++) {
      const next = steps[j];
      console.log(`Step ${j} (${next.source} - ${next.type}):`);
      if (next.thinking) console.log(`  Thinking: ${next.thinking}`);
      if (next.content) console.log(`  Content: ${next.content}`);
      if (next.tool_calls) console.log(`  Tool Calls:`, JSON.stringify(next.tool_calls, null, 2));
    }
    console.log('===========================================\n');
    found++;
    if (found >= 3) break;
  }
}
