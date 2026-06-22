const fs = require('fs');

const logPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e3616c4c-cd9e-45b9-9e7a-2b61650ce957\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);

for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (obj.step_index >= 126 && obj.step_index <= 150) {
      console.log(`=== Step ${obj.step_index} (${obj.type} by ${obj.source}) ===`);
      console.log(`Thinking: ${obj.thinking ? obj.thinking.substring(0, 500) : 'None'}`);
      console.log(`Content: ${obj.content ? obj.content.substring(0, 500) : 'None'}`);
      console.log(`Tool Calls: ${obj.tool_calls ? JSON.stringify(obj.tool_calls, null, 2) : 'None'}`);
      console.log('--------------------------------------------------');
    }
  } catch (e) {}
}
