const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, '../scratch/extracted_items');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const brainDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain';
console.log(`Scanning brain directory: ${brainDir}`);

if (!fs.existsSync(brainDir)) {
  console.error(`Brain directory does not exist: ${brainDir}`);
  process.exit(1);
}

const subdirs = fs.readdirSync(brainDir);
let totalCopied = 0;

subdirs.forEach(subdir => {
  const srcDir = path.join(brainDir, subdir, 'scratch', 'extracted_items');
  if (fs.existsSync(srcDir)) {
    const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json') && !f.endsWith('.metadata.json'));
    if (files.length > 0) {
      console.log(`Found subagent ${subdir} with ${files.length} JSON files.`);
      files.forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);
        
        // Copy if dest doesn't exist, or if src is newer/larger
        let shouldCopy = true;
        if (fs.existsSync(destPath)) {
          const srcStat = fs.statSync(srcPath);
          const destStat = fs.statSync(destPath);
          if (srcStat.mtimeMs <= destStat.mtimeMs) {
            shouldCopy = false;
          }
        }
        
        if (shouldCopy) {
          fs.copyFileSync(srcPath, destPath);
          totalCopied++;
        }
      });
    }
  }
});

console.log(`Successfully collected ${totalCopied} files into ${destDir}`);
