const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\.system_generated\\logs\\transcript.jsonl';

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

  let count = 0;
  for await (const line of rl) {
    try {
      const step = JSON.parse(line);
      if (step.step_index >= 8000) {
        console.log(`Step ${step.step_index} (${step.source}, ${step.type}):`);
        if (step.thinking) console.log(`  Thinking: ${step.thinking.substring(0, 200)}...`);
        if (step.tool_calls) console.log(`  Tool Calls:`, JSON.stringify(step.tool_calls, null, 2));
        if (step.content && step.source === 'USER_EXPLICIT') console.log(`  Content: ${step.content.substring(0, 200)}...`);
        count++;
      }
    } catch (e) {
      // ignore
    }
  }
  console.log(`Printed ${count} steps.`);
}

main();
