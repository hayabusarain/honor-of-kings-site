const fs = require('fs');
const path = require('path');

const extDir = path.join(__dirname, '../scratch/extracted_items');
const rawDir = path.join(__dirname, '../public/images/items/raw');

const jsonFiles = fs.readdirSync(extDir).filter(f => f.endsWith('.json') && !f.includes('.metadata.json'));
const pngFiles = fs.readdirSync(rawDir).filter(f => f.endsWith('.png'));

console.log(`Total JSON files found: ${jsonFiles.length}`);
console.log(`Total PNG files found: ${pngFiles.length}`);

let noGoldCount = 0;
let hasGoldCount = 0;
const missingGold = [];

jsonFiles.forEach(file => {
    try {
        const filePath = path.join(extDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.gold === undefined || data.gold === null) {
            noGoldCount++;
            missingGold.push(file);
        } else {
            hasGoldCount++;
        }
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});

console.log(`JSONs with gold: ${hasGoldCount}`);
console.log(`JSONs without gold: ${noGoldCount}`);
if (missingGold.length > 0) {
    console.log('List of JSONs without gold (first 20):');
    console.log(missingGold.slice(0, 20));
}
