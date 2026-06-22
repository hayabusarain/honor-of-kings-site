const fs = require('fs');
const path = require('path');

const listPath = path.join(__dirname, 'png_list.txt');
if (!fs.existsSync(listPath)) {
    console.error('png_list.txt does not exist');
    process.exit(1);
}

const content = fs.readFileSync(listPath, 'utf8');
const lines = content.split(/\r?\n/);

const validBases = new Set();
lines.forEach(line => {
    if (line.includes('public\\images\\items\\raw\\')) {
        // extract file name
        const match = line.match(/raw\\(.+?)\.png/);
        if (match) {
            validBases.add(match[1]);
        }
    }
});

console.log(`Found ${validBases.size} valid screenshot bases in png_list.txt`);
console.log('Sample bases (first 10):', Array.from(validBases).slice(0, 10));
console.log('Sample bases (last 10):', Array.from(validBases).slice(-10));

fs.writeFileSync(path.join(__dirname, 'valid_screenshot_bases.json'), JSON.stringify(Array.from(validBases), null, 2), 'utf8');
