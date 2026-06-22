const fs = require('fs');
const path = require('path');

const targetNumbers = [
  19, 20, 21, 22, 23,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45
];

const srcDir = 'C:/Users/81901/Pictures/Screenshots';
const destDir = path.join(__dirname, '../public/images/items/raw');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log('Searching for screenshots in:', srcDir);

let count = 0;
targetNumbers.forEach(n => {
  const filename = `スクリーンショット (${n}).png`;
  const srcPath = path.join(srcDir, filename);
  if (fs.existsSync(srcPath)) {
    const destPath = path.join(destDir, filename);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${filename}`);
    count++;
  } else {
    console.log(`Not found in Screenshots: ${filename}`);
  }
});

console.log(`Copy complete. Copied ${count} files.`);
