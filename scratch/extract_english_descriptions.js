const fs = require('fs');
const path = require('path');

const targetPath = 'C:/Users/81901/.gemini/antigravity/brain/b480f433-46b1-471d-8680-a277fd5851f3/.system_generated/steps/202/content.md';
const content = fs.readFileSync(targetPath, 'utf8');

// Let's find "Botanist" in the HTML and print some lines around it
const query = 'Conqueror';
const idx = content.toLowerCase().indexOf(query.toLowerCase());
if (idx !== -1) {
  console.log('Snippet for Botanist:');
  console.log(content.slice(idx - 100, idx + 1000));
} else {
  console.log('Botanist not found');
}
