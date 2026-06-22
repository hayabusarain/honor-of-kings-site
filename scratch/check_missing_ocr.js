const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '../public/images/items/raw');
const extDir = path.join(__dirname, '../scratch/extracted_items');

const pngFiles = fs.readdirSync(rawDir).filter(f => f.endsWith('.png'));

const missing = [];
pngFiles.forEach(png => {
    const base = png.replace('.png', '');
    const jsonName1 = `${base}.json`;
    const jsonName2 = `${png}.json`; // .png.json
    
    const exists1 = fs.existsSync(path.join(extDir, jsonName1));
    const exists2 = fs.existsSync(path.join(extDir, jsonName2));
    
    if (!exists1 && !exists2) {
        missing.push(png);
    }
});

console.log(`Total PNG: ${pngFiles.length}`);
console.log(`Missing JSONs count: ${missing.length}`);
if (missing.length > 0) {
    console.log('Missing PNG list:', missing);
} else {
    console.log('🎉 All OCR JSONs are present!');
}
