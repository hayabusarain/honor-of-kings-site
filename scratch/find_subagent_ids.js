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

  const subagents = new Set();
  
  for await (const line of rl) {
    try {
      const step = JSON.parse(line);
      if (step.step_index >= 8040) {
        // Find invoke_subagent tool call output or system messages
        if (step.tool_calls) {
          step.tool_calls.forEach(call => {
            if (call.name === 'invoke_subagent') {
              console.log(`Invoke Subagent in step ${step.step_index}`);
            }
          });
        }
        
        if (step.type === 'SYSTEM_MESSAGE' && step.content) {
          const match = step.content.match(/sender=([a-f0-9\-]+).*finished with result/i);
          if (match) {
            console.log(`Subagent Finished: ID=${match[1]}`);
            subagents.add(match[1]);
          }
          
          // Also look for direct tool response of invoke_subagent which returns conversation IDs
          if (step.content.includes('conversationID') || step.content.includes('Conversation ID')) {
            console.log(`System Tool Response Content: ${step.content.substring(0, 1000)}`);
          }
        }
        
        // If it's a tool response for step 8047
        if (step.step_index === 8048) {
          console.log(`Step 8048 Content: ${step.content}`);
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

main();
