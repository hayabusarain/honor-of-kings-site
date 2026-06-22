const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '../public/images/items/raw');
const extDir = path.join(__dirname, '../scratch/extracted_items');

const pngFiles = fs.readdirSync(rawDir).filter(f => f.endsWith('.png'));
const jsonFiles = fs.readdirSync(extDir).filter(f => f.endsWith('.json') && !f.includes('.metadata.json'));

console.log(`PNG Files count: ${pngFiles.length}`);
console.log(`JSON Files count: ${jsonFiles.length}`);

// We want to map each PNG file to its JSON file.
// Usually, if PNG is "スクリーンショット (127).png", the JSON could be:
// - "スクリーンショット (127).json"
// - "スクリーンショット (127).png.json"
// Let's find out for each PNG if it has a JSON and if that JSON has "gold".

const results = [];

pngFiles.forEach(png => {
    const base = path.basename(png, '.png');
    // candidates: base + '.json', base + '.png.json'
    const cand1 = base + '.json';
    const cand2 = png + '.json';
    
    let jsonName = null;
    let hasJson = false;
    let hasGold = false;
    let goldValue = null;
    let itemName = null;
    
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
            itemName = data.item_name;
            if (data.gold !== undefined && data.gold !== null) {
                hasGold = true;
                goldValue = data.gold;
            }
        } catch (e) {
            console.error(`Error parsing ${jsonName}:`, e.message);
        }
    }
    
    results.push({
        png,
        jsonName,
        hasJson,
        hasGold,
        goldValue,
        itemName
    });
});

const missingJson = results.filter(r => !r.hasJson);
const missingGold = results.filter(r => r.hasJson && !r.hasGold);
const complete = results.filter(r => r.hasJson && r.hasGold);

console.log(`Summary of PNG matching:`);
console.log(`- Total PNGs: ${pngFiles.length}`);
console.log(`- PNGs without JSON: ${missingJson.length}`);
console.log(`- PNGs with JSON but missing gold: ${missingGold.length}`);
console.log(`- PNGs complete (JSON with gold): ${complete.length}`);

if (missingJson.length > 0) {
    console.log('\nMissing JSON files (first 10):');
    console.log(missingJson.slice(0, 10).map(r => r.png));
}

if (missingGold.length > 0) {
    console.log('\nMissing Gold in JSON files (first 10):');
    console.log(missingGold.slice(0, 10).map(r => ({ png: r.png, json: r.jsonName, item: r.itemName })));
}
