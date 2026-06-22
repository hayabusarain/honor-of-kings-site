const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/81901/Desktop/ワイリフサイト/src/data/parsed_skills';
if (!fs.existsSync(dir)) {
  console.log("Directory does not exist");
  process.exit(0);
}

const files = fs.readdirSync(dir);
const charMap = new Map();

files.forEach(file => {
  if (file.endsWith('.json')) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const regex = /[^\u0000-\u007F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\u3000-\u303F]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const char = match[0];
      // If it's a surrogate pair, we might capture only part of it, so let's be careful.
    }
    // Let's use Array.from(content) to handle surrogate pairs correctly:
    const chars = Array.from(content);
    chars.forEach(char => {
      const code = char.codePointAt(0);
      if (code > 0x7F && (code < 0x3000 || code > 0x9FFF) && (code < 0xFF00 || code > 0xFFEF)) {
        charMap.set(char, (charMap.get(char) || 0) + 1);
      }
    });
  }
});

console.log(Array.from(charMap.entries()).sort((a,b) => b[1] - a[1]));
