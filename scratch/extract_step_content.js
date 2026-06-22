import fs from 'fs';

const logPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const step = JSON.parse(line);
    // Find the view_file tool output
    // A tool output is inside step.tool_calls or step.results or it might be step.content if type is 'TOOL_RESPONSE' / 'MODEL' etc.
    if (step.tool_calls) {
      for (const call of step.tool_calls) {
        if (call.name === 'view_file' && call.args && (call.args.includes('items/page.tsx') || JSON.stringify(call.args).includes('items/page.tsx'))) {
          console.log(`Step ${step.step_index}: view_file targeting items/page.tsx`);
          // Let's print the result if present
        }
      }
    }
    
    // Check if this step is a tool result
    if (step.content && step.content.includes('Wild Rift Item Database')) {
      console.log(`Step ${step.step_index} content contains 'Wild Rift Item Database', length: ${step.content.length}`);
      // Let's write this content to a separate file to inspect
      fs.writeFileSync(`scratch/step_${step.step_index}_content.txt`, step.content, 'utf8');
    }
  } catch (e) {}
}
