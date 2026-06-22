const fs = require('fs');
const path = require('path');

const finalPath = path.join(__dirname, '../src/data/physical_items_final.json');
const extDir = path.join(__dirname, '../scratch/extracted_items');

if (!fs.existsSync(finalPath)) {
    console.error('physical_items_final.json does not exist');
    process.exit(1);
}

const finalItems = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
console.log(`Total items in final JSON: ${finalItems.length}`);

// We want to trace each item back to the original OCR source JSON.
const validBases = JSON.parse(fs.readFileSync(path.join(__dirname, 'valid_screenshot_bases.json'), 'utf8'));

const traced = finalItems.map(item => {
    // Search for a JSON in extDir that has the same item_name and is in validBases
    const files = fs.readdirSync(extDir).filter(f => f.endsWith('.json') && !f.includes('.metadata.json'));
    let matchedFile = null;
    let fileContent = null;
    
    for (const file of files) {
        let base = file;
        if (base.endsWith('.png.json')) {
            base = base.substring(0, base.length - 9);
        } else if (base.endsWith('.json')) {
            base = base.substring(0, base.length - 5);
        }
        if (!validBases.includes(base)) continue;

        try {
            const data = JSON.parse(fs.readFileSync(path.join(extDir, file), 'utf8'));
            if (data.item_name === item.nameJa) {
                matchedFile = file;
                fileContent = data;
                break;
            }
        } catch (e) {}
    }
    
    return {
        id: item.id,
        nameJa: item.nameJa,
        gold: item.gold,
        sourceFile: matchedFile,
        stats: item.stats,
        hasGold: fileContent ? (fileContent.gold !== undefined) : false
    };
});

console.log('Items without mapped source file:');
const unmatched = traced.filter(t => !t.sourceFile);
console.log(unmatched.map(t => t.nameJa));

console.log('\nSample traced items (first 30):');
console.log(traced.slice(0, 30).map(t => ({
    nameJa: t.nameJa,
    sourceFile: t.sourceFile,
    gold: t.gold,
    hasGold: t.hasGold
})));

fs.writeFileSync(path.join(__dirname, 'traced_items.json'), JSON.stringify(traced, null, 2));
