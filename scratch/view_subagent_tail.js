const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\b480f433-46b1-471d-8680-a277fd5851f3\\\\.system_generated\\\\logs\\\\transcript.jsonl';

async function main() {
  if (!fs.existsSync(transcriptPath)) {
    console.error(`Transcript not found: ${transcriptPath}`);
    return;
  }
  
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const steps = [];
  for await (const line of rl) {
    try {
      const step = JSON.parse(line);
      steps.push(step);
    } catch (e) {}
  }
  
  console.log(`Total steps: ${steps.length}`);
  const lastSteps = steps.slice(-15);
  for (const step of lastSteps) {
    console.log(`Step ${step.step_index} (${step.source}, ${step.type}):`);
    if (step.thinking) console.log(`  Thinking: ${step.thinking.substring(0, 150)}...`);
    if (step.tool_calls) console.log(`  Tool Calls:`, JSON.stringify(step.tool_calls, null, 2));
    if (step.content) console.log(`  Content: ${step.content.substring(0, 300)}...`);
  }
}

main();
