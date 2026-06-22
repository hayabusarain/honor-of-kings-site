const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain';
console.log(`Scanning brain directory: ${brainDir}`);

if (!fs.existsSync(brainDir)) {
  console.error(`Brain directory does not exist: ${brainDir}`);
  process.exit(1);
}

const subdirs = fs.readdirSync(brainDir);
console.log(`Found ${subdirs.length} subdirectories in brain:`, subdirs);

subdirs.forEach(subdir => {
  const p = path.join(brainDir, subdir, 'scratch', 'extracted_items');
  if (fs.existsSync(p)) {
    const files = fs.readdirSync(p);
    console.log(`Subdir ${subdir} has extracted_items directory with ${files.length} files:`, files.filter(f => f.endsWith('.json')));
  } else {
    // Check if scratch exists
    const scratchPath = path.join(brainDir, subdir, 'scratch');
    if (fs.existsSync(scratchPath)) {
      console.log(`Subdir ${subdir} has scratch directory but NO extracted_items`);
      const contents = fs.readdirSync(scratchPath);
      console.log(`  Scratch contents:`, contents);
    } else {
      console.log(`Subdir ${subdir} has NO scratch directory`);
    }
  }
});
