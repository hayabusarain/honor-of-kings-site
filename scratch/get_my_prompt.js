const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/logs/transcript.jsonl';
if (!fs.existsSync(transcriptPath)) {
  console.log('Transcript file not found.');
  process.exit(1);
}

const fileContent = fs.readFileSync(transcriptPath, 'utf8');
const lines = fileContent.split('\n');

for (const line of lines) {
  if (line.includes('e3616c4c-cd9e-45b9-9e7a-2b61650ce957') || line.includes('invoke_subagent')) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const call of parsed.tool_calls) {
          if (call.name === 'invoke_subagent') {
            console.log('Invoke Subagent Call Args:');
            console.log(JSON.stringify(call.args, null, 2));
          }
        }
      }
      if (parsed.content && parsed.content.includes('e3616c4c-cd9e-45b9-9e7a-2b61650ce957')) {
        console.log('Found conversation ID in step:', parsed.step_index);
        console.log('Content:', parsed.content);
      }
    } catch (e) {
      console.log('Error parsing:', e.message);
    }
  }
}
