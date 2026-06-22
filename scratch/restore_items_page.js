import fs from 'fs';
import path from 'path';

const logPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/logs/transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.error('Log file not found:', logPath);
  process.exit(1);
}

const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

let lastContent = null;
let lastStep = -1;

for (let i = 0; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  try {
    const obj = JSON.parse(lines[i]);
    
    // Look for tool calls that wrote or modified src/app/[locale]/items/page.tsx
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'write_to_file' || call.name === 'replace_file_content' || call.name === 'multi_replace_file_content') {
          const args = typeof call.args === 'string' ? JSON.parse(call.args) : call.args;
          if (args && args.TargetFile && args.TargetFile.includes('items/page.tsx')) {
            console.log(`Step ${obj.step_index}: Found tool call ${call.name} targeting items/page.tsx`);
            if (args.CodeContent) {
              lastContent = args.CodeContent;
              lastStep = obj.step_index;
            }
          }
        }
      }
    }
  } catch (e) {
    // Ignore JSON parse errors for truncated lines
  }
}

if (lastContent) {
  const restorePath = 'c:/Users/81901/Desktop/ワイリフサイト/src/app/[locale]/items/page.tsx';
  fs.writeFileSync(restorePath, lastContent, 'utf8');
  console.log(`Successfully restored items/page.tsx from step ${lastStep} in transcript.jsonl.`);
} else {
  console.log('Could not find full CodeContent write in transcript.jsonl. Let us search for subagent or other writes.');
}
