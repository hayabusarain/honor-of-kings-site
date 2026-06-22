const fs = require('fs');
const path = require('path');

const stepsDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\.system_generated\\steps';
const missingRunes = [
  'Hubris',
  'Tyrant',
  'Chain Assault',
  'Unflinching',
  'Unshakeable',
  'Future'
];

if (!fs.existsSync(stepsDir)) {
  console.log("Steps directory not found");
  process.exit(1);
}

const steps = fs.readdirSync(stepsDir);
console.log(`Searching through ${steps.length} steps...`);

steps.forEach(step => {
  const stepPath = path.join(stepsDir, step);
  if (!fs.statSync(stepPath).isDirectory()) return;
  const contentPath = path.join(stepPath, 'content.md');
  if (!fs.existsSync(contentPath)) return;

  const content = fs.readFileSync(contentPath, 'utf8');
  missingRunes.forEach(rune => {
    if (content.toLowerCase().includes(rune.toLowerCase())) {
      console.log(`Found mention of "${rune}" in step ${step}`);
      // Find lines with data-src or images
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes(rune.toLowerCase())) {
          console.log(`  Line ${idx}: ${line.substring(0, 150)}...`);
        }
      });
    }
  });
});
