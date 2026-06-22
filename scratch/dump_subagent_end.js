const fs = require('fs');
const subTranscriptPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e3616c4c-cd9e-45b9-9e7a-2b61650ce957\\\\.system_generated\\\\logs\\\\transcript.jsonl';

if (fs.existsSync(subTranscriptPath)) {
  const content = fs.readFileSync(subTranscriptPath, 'utf8');
  const lines = content.split('\n').filter(Boolean);
  console.log(`Lines count: ${lines.length}`);
  lines.slice(-10).forEach((line, idx) => {
    try {
      const obj = JSON.parse(line);
      console.log(`IDX ${idx} (Step ${obj.step_index}): ${obj.type} - ${obj.status}`);
      if (obj.thinking) {
        console.log(`  Thinking: ${obj.thinking.substring(0, 150)}`);
      }
      if (obj.tool_calls) {
        console.log(`  Tool Calls: ${JSON.stringify(obj.tool_calls)}`);
      }
      if (obj.content) {
        console.log(`  Content: ${obj.content.substring(0, 150)}`);
      }
    } catch(e) {
      console.log(`IDX ${idx}: Error parsing JSON`);
    }
  });
}
