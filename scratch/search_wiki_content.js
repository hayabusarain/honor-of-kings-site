const fs = require('fs');

const wikiPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\b480f433-46b1-471d-8680-a277fd5851f3\\\\.system_generated\\\\steps\\\\202\\\\content.md';
if (fs.existsSync(wikiPath)) {
  const content = fs.readFileSync(wikiPath, 'utf8');
  console.log(`Wiki content length: ${content.length}`);
  
  // Find all runes in the text of the wiki. Usually, they have links like /wiki/Rune_Name_(Wild_Rift) or data-rune="Rune Name"
  const regex = /data-rune="([^"]+)"/g;
  let match;
  const runes = new Set();
  while ((match = regex.exec(content)) !== null) {
    runes.add(match[1]);
  }
  
  console.log(`Found ${runes.size} unique runes in wiki content via data-rune:`);
  console.log(Array.from(runes).sort());
} else {
  console.log("Wiki content.md not found");
}
