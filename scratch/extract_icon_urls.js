const fs = require('fs');

const wikiPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\b480f433-46b1-471d-8680-a277fd5851f3\\\\.system_generated\\\\steps\\\\202\\\\content.md';
if (!fs.existsSync(wikiPath)) {
  console.log("content.md not found");
  process.exit(1);
}

const content = fs.readFileSync(wikiPath, 'utf8');

// Find all data-rune occurrences, and try to find the data-src attribute in the same element or nearby
// In the wiki, we have structure like:
// <span class="inline-image label-after rune-icon" ... data-rune="Rune Name" ...>... data-src="URL" ...
// Let's find matches using a regex for data-rune and then look for data-src or data-image-name in the surrounding block
const blocks = content.split('<span class="inline-image');
console.log(`Found ${blocks.length} blocks starting with inline-image`);

const runeIcons = {};

blocks.forEach(block => {
  const runeMatch = block.match(/data-rune="([^"]+)"/);
  if (runeMatch) {
    const runeName = runeMatch[1];
    // Find data-src in this block
    const srcMatch = block.match(/data-src="([^"]+)"/) || block.match(/src="([^"]+)"/);
    if (srcMatch) {
      let url = srcMatch[1];
      if (url.includes('/revision/latest/scale-to-width-down/')) {
        url = url.split('/revision/latest/scale-to-width-down/')[0] + '/revision/latest';
      }
      if (!runeIcons[runeName] || !runeIcons[runeName].includes('nocookie')) {
        runeIcons[runeName] = url;
      }
    }
  }
});

console.log(`Extracted icons for ${Object.keys(runeIcons).length} runes:`);
console.log(JSON.stringify(runeIcons, null, 2));

fs.writeFileSync('scratch/rune_icons_map.json', JSON.stringify(runeIcons, null, 2), 'utf8');
