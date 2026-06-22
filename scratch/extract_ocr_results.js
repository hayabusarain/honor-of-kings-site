const fs = require('fs');
const path = require('path');

const logPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e3616c4c-cd9e-45b9-9e7a-2b61650ce957\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);

const viewsAndResponses = [];
let currentMedia = null;

for (let i = 0; i < lines.length; i++) {
  try {
    const obj = JSON.parse(lines[i]);
    
    // Check if it's a tool call to view_file
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'view_file') {
          const absPath = call.args.AbsolutePath;
          if (absPath && absPath.includes('media__')) {
            currentMedia = path.basename(absPath.replace(/["]/g, ''));
          }
        }
      }
    }
    
    // If we have a currentMedia, and this is a PLANNER_RESPONSE from the MODEL, and it doesn't have tool_calls (meaning it's the step where the model reports its findings after seeing the file)
    if (obj.type === 'PLANNER_RESPONSE' && obj.source === 'MODEL' && currentMedia) {
      // Check if it's the step *after* the tool output is received. The tool output step comes from SYSTEM.
      // So if the previous line in transcript was the tool output, this line is the model's observation!
      // Let's capture it if it has thinking or content.
      const hasToolCalls = obj.tool_calls && obj.tool_calls.length > 0;
      if (!hasToolCalls) {
        viewsAndResponses.push({
          mediaName: currentMedia,
          thinking: obj.thinking || '',
          content: obj.content || '',
          step: obj.step_index
        });
        currentMedia = null; // reset
      }
    }
  } catch (e) {}
}

console.log(`Extracted responses for ${viewsAndResponses.length} media files:`);

// Print them
viewsAndResponses.forEach((item, idx) => {
  console.log(`--- ${idx + 1}: ${item.mediaName} (Step ${item.step}) ---`);
  if (item.thinking) {
    console.log(`Thinking: ${item.thinking.substring(0, 300)}...`);
  }
  if (item.content) {
    console.log(`Content: ${item.content.substring(0, 300)}...`);
  }
  console.log('\n');
});

