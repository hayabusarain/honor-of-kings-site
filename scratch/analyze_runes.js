const fs = require('fs');

const matchesPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\b480f433-46b1-471d-8680-a277fd5851f3\\\\wiki_matches.json';
if (fs.existsSync(matchesPath)) {
  const data = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
  const uniqueRunes = new Set();
  data.forEach(item => {
    uniqueRunes.add(item.rune);
  });
  console.log(`Found ${uniqueRunes.size} unique runes in wiki_matches.json:`);
  console.log(Array.from(uniqueRunes).sort());
} else {
  console.log("wiki_matches.json not found");
}
