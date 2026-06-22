const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e8b7ecd2-02e7-415a-9624-b012415fa3d1';

const files = fs.readdirSync(brainDir)
  .filter(f => f.startsWith('media__') && f.endsWith('.png'))
  .map(f => {
    const p = path.join(brainDir, f);
    return { name: f, path: p, mtime: fs.statSync(p).mtimeMs };
  })
  .sort((a, b) => a.mtime - b.mtime);

console.log(`Found ${files.length} media__*.png files directly in e8b7ecd2-02e7-415a-9624-b012415fa3d1:`);
files.forEach((f, index) => {
  console.log(`${index + 1}: ${f.name} (mtime: ${new Date(f.mtime).toISOString()})`);
});
