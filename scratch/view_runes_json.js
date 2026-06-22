const fs = require('fs');

const path = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/worktrees/subagent-Rune-Screenshot-OCR-Parser-and-Asset-Downloader-rune-parser-6c420e43/src/data/runes.json';
const runes = JSON.parse(fs.readFileSync(path, 'utf8'));

console.log(`Total runes in compiled runes.json: ${runes.length}`);
runes.forEach((r, idx) => {
  console.log(`${idx + 1}. key: "${r.key}", nameJa: "${r.nameJa}", name: "${r.name}", category: "${r.category}", id: ${r.id}, descLen: ${r.description ? r.description.length : 0}`);
});
