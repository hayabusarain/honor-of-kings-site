const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '../public/images/items/raw');
const extDir = path.join(__dirname, '../scratch/extracted_items');

const pngFiles = fs.readdirSync(rawDir).filter(f => f.endsWith('.png'));
const jsonFiles = fs.readdirSync(extDir).filter(f => f.endsWith('.json') && !f.includes('.metadata.json'));

const pending = [];

pngFiles.forEach(png => {
    const base = path.basename(png, '.png');
    const cand1 = base + '.json';
    const cand2 = png + '.json';
    
    let jsonName = null;
    let hasJson = false;
    let hasGold = false;
    
    if (jsonFiles.includes(cand1)) {
        jsonName = cand1;
        hasJson = true;
    } else if (jsonFiles.includes(cand2)) {
        jsonName = cand2;
        hasJson = true;
    }
    
    if (hasJson) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(extDir, jsonName), 'utf8'));
            if (data.gold !== undefined && data.gold !== null) {
                hasGold = true;
            }
        } catch (e) {}
    }
    
    if (!hasJson || !hasGold) {
        pending.push(png);
    }
});

console.log(JSON.stringify(pending, null, 2));
console.log(`Total pending: ${pending.length}`);
fs.writeFileSync(path.join(__dirname, 'pending_pngs.json'), JSON.stringify(pending, null, 2));
