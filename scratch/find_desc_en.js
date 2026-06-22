const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/81901/.gemini/antigravity/brain/b480f433-46b1-471d-8680-a277fd5851f3';

function searchInDir(dir, query) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== '.system_generated' && file !== 'scratch') {
        searchInDir(fullPath, query);
      }
    } else if (file.endsWith('.json') || file.endsWith('.txt') || file.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes(query.toLowerCase())) {
        console.log(`Found "${query}" in ${fullPath}`);
        // print a small snippet around the match
        const idx = content.toLowerCase().indexOf(query.toLowerCase());
        console.log(content.slice(Math.max(0, idx - 100), Math.min(content.length, idx + 300)));
        console.log('--------------------------------------------------');
      }
    }
  }
}

console.log('Searching for "Botanist"...');
searchInDir(brainDir, 'Botanist');
console.log('Searching for "Axiom Arcanist"...');
searchInDir(brainDir, 'Axiom Arcanist');
