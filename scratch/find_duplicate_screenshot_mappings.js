const fs = require('fs');
const path = require('path');

const itemsPath = path.join(__dirname, '../src/data/physical_items_final.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

// Find mappings
const mappingsPath = path.join(__dirname, '../scratch/item_to_screenshot_mapping.json'); // We can inspect how they were mapped or compute it.

// Let's read item_override_configs.json first
const overridesPath = path.join(__dirname, '../scratch/item_override_configs.json');
const overrides = fs.existsSync(overridesPath) ? JSON.parse(fs.readFileSync(overridesPath, 'utf8')) : {};

// Let's reconstruct the mapping logic from crop_all_items.py
const extDir = path.join(__dirname, '../scratch/extracted_items');
const jsonFiles = fs.readdirSync(extDir).filter(f => f.endsWith('.json') && !f.endsWith('.metadata.json'));

const normalizeName = (name) => {
  if (!name) return "";
  return name.replace(/\s+/g, '')
             .replace(/[・＝\-\[\]\.]/g, '')
             .replace(/[ー]/g, '')
             .toLowerCase().trim();
};

const itemToScreenshot = {};
jsonFiles.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(extDir, file), 'utf8'));
    const name = data.item_name;
    if (name && name !== 'null' && name !== 'N/A' && name.trim() !== '') {
      const norm = normalizeName(name);
      const base = file.replace('.png.json', '').replace('.json', '');
      
      const numMatch = base.match(/\((\d+)\)/);
      const scrNum = numMatch ? parseInt(numMatch[1], 10) : 99999;
      
      let itemGold = data.gold || 0;
      try {
        itemGold = parseInt(itemGold, 10) || 0;
      } catch (e) {
        itemGold = 0;
      }
      
      if (!itemToScreenshot[norm]) {
        itemToScreenshot[norm] = { base, num: scrNum, gold: itemGold };
      } else {
        const prev = itemToScreenshot[norm];
        let overwrite = false;
        if (itemGold > 0 && prev.gold === 0) {
          overwrite = true;
        } else if (itemGold === 0 && prev.gold > 0) {
          overwrite = false;
        } else {
          overwrite = (scrNum < prev.num);
        }
        if (overwrite) {
          itemToScreenshot[norm] = { base, num: scrNum, gold: itemGold };
        }
      }
    }
  } catch (e) {
    console.error(`Error reading ${file}: ${e}`);
  }
});

// Plain mapping
const itemToScreenshotPlain = {};
for (const norm of Object.keys(itemToScreenshot)) {
  itemToScreenshotPlain[norm] = itemToScreenshot[norm].base;
}

// Overrides
for (const key of Object.keys(overrides)) {
  if (overrides[key].baseName) {
    const normKey = normalizeName(key);
    itemToScreenshotPlain[normKey] = overrides[key].baseName;
  }
}

// Find duplicates
const screenshotToItems = {};
items.forEach(item => {
  const norm = normalizeName(item.nameJa);
  const screenshot = itemToScreenshotPlain[norm];
  if (screenshot) {
    if (!screenshotToItems[screenshot]) screenshotToItems[screenshot] = [];
    screenshotToItems[screenshot].push(item.nameJa);
  } else {
    console.log(`No screenshot for ${item.nameJa}`);
  }
});

console.log("\nScreenshots mapped to MULTIPLE items:");
let duplicateCount = 0;
for (const scr of Object.keys(screenshotToItems)) {
  if (screenshotToItems[scr].length > 1) {
    console.log(`  ${scr} -> [${screenshotToItems[scr].join(', ')}]`);
    duplicateCount++;
  }
}
console.log(`Total duplicate mappings: ${duplicateCount}`);
