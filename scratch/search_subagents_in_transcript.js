const fs = require('fs');
const readline = require('readline');
const path = require('path');

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

  console.log('Searching invoke_subagent calls in parent transcript...');

  for await (const line of rl) {
    try {
      const step = JSON.parse(line);
      if (step.tool_calls) {
        step.tool_calls.forEach(call => {
          if (call.name === 'invoke_subagent') {
            console.log(`Step ${step.step_index} (${step.created_at}):`);
            const args = typeof call.args === 'string' ? JSON.parse(call.args) : call.args;
            if (args.Subagents) {
              args.Subagents.forEach((sa, idx) => {
                console.log(`  - Subagent ${idx + 1}: Name=${sa.TypeName}, Role=${sa.Role}`);
                console.log(`    Prompt Summary: ${sa.Prompt.substring(0, 150)}...`);
              });
            }
          }
        });
      }
      
      // Also look for response messages from subagents
      if (step.type === 'SYSTEM_MESSAGE' && step.content) {
        const match = step.content.match(/sender=([a-f0-9\-]+).*finished with result/i);
        if (match) {
          console.log(`Subagent Finished: ID=${match[1]}`);
        }
      }
    } catch (e) {
      // ignore parse errors for corrupt lines
    }
  }
}

main();
