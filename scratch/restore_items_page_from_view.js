import fs from 'fs';

const logPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

let chunk1 = '';
let chunk2 = '';

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const step = JSON.parse(line);
    // We are looking for PLANNER_RESPONSE or SYSTEM/MODEL steps that contain the view_file tool output.
    // In transcript.jsonl, the tool results are usually stored in steps of type 'TOOL_RESPONSE' or inside the 'tool_calls' / 'results' of a step.
    // Let's print any step that contains view_file results for items/page.tsx.
    if (step.tool_calls) {
      // Some logs store results under tool_calls
    }
    
    // In standard transcript.jsonl format:
    // {"step_index":..., "type":"VIEW_FILE", "status":"DONE", "content":"...", "tool_calls":[...]}
    // Or check if the content contains "Wild Rift Item Database"
    const contentStr = JSON.stringify(step);
    if (contentStr.includes('Wild Rift Item Database') && contentStr.includes('1: \'use client\';')) {
      console.log(`Found step containing chunk 1: Step ${step.step_index}`);
      chunk1 = step.content || '';
      // If content is empty, check other fields or output
      if (!chunk1 && step.tool_calls) {
        // Let's find it
      }
    }
  } catch (e) {}
}

// Let's write a more generic parser that scans for the actual text lines:
// e.g. "1: 'use client';" to "800: " and "801: " to the end.
let fileLines = new Array(1200).fill(null);

for (const line of lines) {
  if (!line.trim()) continue;
  // Use regex to find line patterns like: \"1: 'use client';\\n
  // Let's just find lines containing line numbers in the format `\n<num>: <codeLine>\n`
  const matches = line.matchAll(/(\\n|\n)(\d+): (.*?)(?=\\n|\n)/g);
  for (const m of matches) {
    const num = parseInt(m[2], 10);
    const content = m[3]
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\')
      .replace(/\\t/g, '\t');
    if (num >= 1 && num <= 1176) {
      fileLines[num] = content;
    }
  }
}

// Check how many lines we reconstructed
let count = 0;
for (let i = 1; i < fileLines.length; i++) {
  if (fileLines[i] !== null) count++;
}
console.log(`Reconstructed ${count} lines from transcript.jsonl.`);

if (count >= 1100) {
  // Let's construct the file
  let finalCode = '';
  for (let i = 1; i <= 1176; i++) {
    if (fileLines[i] !== null) {
      finalCode += fileLines[i] + '\n';
    } else {
      console.log(`Missing line ${i}`);
    }
  }
  
  const restorePath = 'c:/Users/81901/Desktop/ワイリフサイト/src/app/[locale]/items/page.tsx';
  fs.writeFileSync(restorePath, finalCode, 'utf8');
  console.log('Successfully restored full items/page.tsx from view_file logs.');
} else {
  console.log('Failed to reconstruct full file lines.');
}
