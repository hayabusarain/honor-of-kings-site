const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e8b7ecd2-02e7-415a-9624-b012415fa3d1';
const extDir = './scratch/extracted_items';

const mediaFiles = fs.readdirSync(brainDir)
  .filter(file => file.startsWith('media__') && file.endsWith('.png'))
  .map(file => {
    const p = path.join(brainDir, file);
    const stat = fs.statSync(p);
    return { name: file, mtime: stat.mtimeMs, mtimeStr: stat.mtime.toISOString() };
  })
  .sort((a, b) => a.mtime - b.mtime);

console.log(`Found ${mediaFiles.length} media__*.png files.`);

const missingNums = [59, 60, 61, 62, 63, 64, 67, 68, 69, 70, 71, 72, 73, 74, 75];
const jsonFiles = missingNums.map(num => {
  const p = path.join(extDir, `スクリーンショット (${num}).json`);
  if (fs.existsSync(p)) {
    const stat = fs.statSync(p);
    return { name: `スクリーンショット (${num}).png`, mtime: stat.mtimeMs, mtimeStr: stat.mtime.toISOString() };
  }
  return null;
}).filter(Boolean).sort((a, b) => a.mtime - b.mtime);

console.log(`Found ${jsonFiles.length} missing JSON files.`);

console.log("\nMedia Files (First 20):");
mediaFiles.slice(0, 20).forEach((f, i) => console.log(`${i}: ${f.name} (${f.mtimeStr})`));

console.log("\nJSON Files:");
jsonFiles.forEach((f, i) => console.log(`${i}: ${f.name} (${f.mtimeStr})`));
