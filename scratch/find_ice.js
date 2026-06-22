const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/81901/.gemini/antigravity/brain/b480f433-46b1-471d-8680-a277fd5851f3';
const wikiMatches = JSON.parse(fs.readFileSync(path.join(brainDir, 'wiki_matches.json'), 'utf8'));

const runes = Array.from(new Set(wikiMatches.map(x => x.rune)));
console.log(runes);
