const fs = require('fs');
const path = require('path');

const contentPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\.system_generated\\steps\\12556\\content.md';
if (!fs.existsSync(contentPath)) {
  console.error("File not found:", contentPath);
  process.exit(1);
}

const content = fs.readFileSync(contentPath, 'utf8');

// We want to find the image urls for:
// Future's Market, Unshakeable, Hubris, Tyrant, Chain Assault
const runesToFind = [
  'Future',
  'Unshakeable',
  'Unflinching',
  'Hubris',
  'Tyrant',
  'Chain'
];

console.log("Searching in content.md:");
const lines = content.split('\n');
lines.forEach((line, idx) => {
  runesToFind.forEach(rune => {
    if (line.toLowerCase().includes(rune.toLowerCase())) {
      console.log(`[Line ${idx}] (${rune}):`);
      console.log(`  ${line.substring(0, 300)}`);
    }
  });
});
