import fs from 'fs';

const logPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

let step12088 = null;
let stepAfter = null;

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const step = JSON.parse(line);
    // Find step 12088 and the step immediately after it or steps containing view_file results
    const str = JSON.stringify(step);
    if (str.includes('Wild Rift Item Database') && str.includes('1: \'use client\';')) {
      console.log(`Found step containing chunk 1: Step ${step.step_index}`);
      step12088 = step;
    }
    if (str.includes('Showing lines 801 to 1176') || (str.includes('801:') && str.includes('1176:'))) {
      console.log(`Found step containing chunk 2: Step ${step.step_index}`);
      stepAfter = step;
    }
  } catch (e) {}
}

function extractText(step) {
  if (!step) return '';
  // Let's traverse the object to find any string containing "1: 'use client';" or "801:"
  let found = '';
  function traverse(obj) {
    if (typeof obj === 'string') {
      if (obj.includes('use client') || obj.includes('801:')) {
        found = obj;
        return;
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const k in obj) {
        traverse(obj[k]);
        if (found) return;
      }
    }
  }
  traverse(step);
  return found;
}

const txt1 = extractText(step12088);
const txt2 = extractText(stepAfter);

console.log(`txt1 length: ${txt1.length}, txt2 length: ${txt2.length}`);

// Let's parse the lines from the extracted texts
function parseLines(txt, fileLines) {
  const linePattern = /(?:^|\n)(\d+): (.*?)(?=\n|$)/g;
  const matches = txt.matchAll(linePattern);
  let count = 0;
  for (const m of matches) {
    const num = parseInt(m[1], 10);
    const content = m[2];
    fileLines[num] = content;
    count++;
  }
  console.log(`Parsed ${count} lines from text.`);
}

const fileLines = new Array(1200).fill(null);
parseLines(txt1, fileLines);
parseLines(txt2, fileLines);

let reconstructedCount = 0;
for (let i = 1; i < fileLines.length; i++) {
  if (fileLines[i] !== null) reconstructedCount++;
}
console.log(`Total reconstructed lines: ${reconstructedCount}`);

if (reconstructedCount > 1000) {
  // Find the max line number
  let maxLine = 0;
  for (let i = fileLines.length - 1; i >= 1; i--) {
    if (fileLines[i] !== null) {
      maxLine = i;
      break;
    }
  }
  console.log(`Max line number: ${maxLine}`);
  
  let finalCode = '';
  for (let i = 1; i <= maxLine; i++) {
    if (fileLines[i] !== null) {
      finalCode += fileLines[i] + '\n';
    } else {
      console.log(`Missing line ${i}`);
      finalCode += '\n'; // Keep placeholder to not shift line numbers
    }
  }
  
  const restorePath = 'c:/Users/81901/Desktop/ワイリフサイト/src/app/[locale]/items/page.tsx';
  fs.writeFileSync(restorePath, finalCode, 'utf8');
  console.log(`Successfully restored full items/page.tsx with ${maxLine} lines.`);
} else {
  console.error('Failed to reconstruct lines.');
}
