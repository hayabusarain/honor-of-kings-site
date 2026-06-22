const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain';
const destDir = path.resolve(__dirname, '../scratch/extracted_items');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function scanDir(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        return; // skip files we can't access
      }
      
      if (stat && stat.isDirectory()) {
        // Recurse, but skip .git and node_modules to be fast
        if (file !== '.git' && file !== 'node_modules' && file !== '.next') {
          results = results.concat(scanDir(fullPath));
        }
      } else if (file.endsWith('.json') && !file.endsWith('.metadata.json')) {
        results.push(fullPath);
      }
    });
  } catch (e) {
    // skip directories we can't read
  }
  return results;
}

console.log(`Scanning brain directory recursively: ${brainDir}...`);
const jsonFiles = scanDir(brainDir);
console.log(`Found ${jsonFiles.length} total JSON files in brain.`);

let copiedCount = 0;

jsonFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    if (data.item_name) {
      // It is an item JSON!
      const filename = path.basename(filePath);
      const destPath = path.join(destDir, filename);
      
      let shouldCopy = true;
      if (fs.existsSync(destPath)) {
        const srcStat = fs.statSync(filePath);
        const destStat = fs.statSync(destPath);
        if (srcStat.mtimeMs <= destStat.mtimeMs) {
          shouldCopy = false;
        }
      }
      
      if (shouldCopy) {
        fs.copyFileSync(filePath, destPath);
        console.log(`Copied ${filename} from ${filePath}`);
        copiedCount++;
      }
    }
  } catch (e) {
    // ignore parse errors
  }
});

console.log(`Successfully scanned brain and copied ${copiedCount} item JSONs.`);
