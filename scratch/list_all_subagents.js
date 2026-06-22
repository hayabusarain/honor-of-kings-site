const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/81901/.gemini/antigravity/brain';

if (!fs.existsSync(brainDir)) {
  console.error('Brain dir not found!');
  process.exit(1);
}

const folders = fs.readdirSync(brainDir);
console.log(`Found folders in brain:`, folders);

folders.forEach(folder => {
  const extPath = path.join(brainDir, folder, 'scratch/extracted_items');
  if (fs.existsSync(extPath)) {
    const files = fs.readdirSync(extPath).filter(f => f.endsWith('.json'));
    console.log(`- Folder: ${folder}`);
    console.log(`  Path: ${extPath}`);
    console.log(`  JSON files count: ${files.length}`);
    if (files.length > 0) {
      console.log(`  Sample files:`, files.slice(0, 5));
    }
  }
});
