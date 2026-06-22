const fs = require('fs');
const path = require('path');

const scratchDir = 'c:/Users/81901/Desktop/ワイリフサイト/scratch';

for (let i = 1; i <= 4; i++) {
  const filePath = path.join(scratchDir, `transcribed_group_${i}.json`);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    try {
      const parsed = JSON.parse(content);
      const keys = Object.keys(parsed);
      console.log(`Group ${i} JSON file exists! Contains ${keys.length} runes:`, keys.join(', '));
    } catch (e) {
      console.log(`Group ${i} JSON file exists but is invalid JSON:`, e.message);
    }
  } else {
    console.log(`Group ${i} JSON file does NOT exist yet.`);
  }
}
