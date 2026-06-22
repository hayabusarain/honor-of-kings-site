const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, '../public/images/items/raw');
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const homeDir = process.env.USERPROFILE || 'C:\\Users\\81901';
const picturesDir = path.join(homeDir, 'Pictures');
const screenshotsDir = path.join(picturesDir, 'Screenshots');

console.log('Searching screenshots in:', screenshotsDir);

if (!fs.existsSync(screenshotsDir)) {
    console.error('Screenshots directory not found:', screenshotsDir);
    process.exit(1);
}

const files = fs.readdirSync(screenshotsDir);
console.log(`Found ${files.length} files total in Screenshots.`);

// JST 2026-05-30 20:00:00
const timeLimit = new Date('2026-05-30T20:00:00+09:00').getTime();

let copyCount = 0;
files.forEach(file => {
    if (file.toLowerCase().endsWith('.png')) {
        const filePath = path.join(screenshotsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.mtimeMs > timeLimit) {
            const destPath = path.join(destDir, file);
            fs.copyFileSync(filePath, destPath);
            console.log(`Copied: ${file} (mtime: ${stats.mtime})`);
            copyCount++;
        }
    }
});

console.log(`Successfully copied ${copyCount} screenshots to ${destDir}`);
