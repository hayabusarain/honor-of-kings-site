const fs = require('fs');
const path = require('path');

const contentPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/steps/13022/content.md';

if (!fs.existsSync(contentPath)) {
  console.error("Content file does not exist at path:", contentPath);
  process.exit(1);
}

const content = fs.readFileSync(contentPath, 'utf8');

// We want to find images, typically formatted as:
// [something](URL) or ![]() or containing wikia/nocookie/images/
// Let's print out lines containing the names we are interested in.

const targetNames = [
  'Botanist',
  'Chain Assault',
  'Tyrant',
  'Battle Zeal',
  'Courage of the Colossus',
  'Ixtali Seedjar',
  'Eyeball Collector',
  'Nullifying Orb'
];

console.log("Searching in content.md...");
const lines = content.split('\n');
lines.forEach((line, idx) => {
  targetNames.forEach(name => {
    if (line.toLowerCase().includes(name.toLowerCase())) {
      console.log(`Line ${idx + 1} (${name}): ${line.substring(0, 300)}`);
    }
  });
});
