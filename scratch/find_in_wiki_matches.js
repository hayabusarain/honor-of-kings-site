const fs = require('fs');
const wikiMatches = JSON.parse(fs.readFileSync('C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\wiki_matches.json', 'utf8'));

const targets = ['hubris', 'tyrant', 'chain', 'unflinching', 'unshakeable', 'future'];
wikiMatches.forEach(item => {
  const lineLower = item.line.toLowerCase();
  const matched = targets.filter(t => lineLower.includes(t));
  if (matched.length > 0) {
    console.log(`Matched Targets: ${matched.join(', ')}`);
    console.log(`Rune: ${item.rune}`);
    console.log(`Line: ${item.line}`);
    console.log('---');
  }
});
