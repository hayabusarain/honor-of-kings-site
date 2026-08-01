const fs = require('fs');
const path = require('path');

const itemsPath = 'C:\\Users\\81901\\Desktop\\オナーオブキングスサイト\\src\\data\\hok_items.json';
const arcanasPath = 'C:\\Users\\81901\\Desktop\\オナーオブキングスサイト\\src\\data\\hok_arcanas.json';
const reportPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\41e892fa-408a-44a6-a2a6-e24e1b233d3d\\scratch\\item_arcana_audit_report.json';

const scratchDir = path.dirname(reportPath);
if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
}

let items = [];
let arcanas = [];

try {
    items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
} catch (e) {
    console.log("Could not read items.json or it doesn't exist yet.");
}

try {
    arcanas = JSON.parse(fs.readFileSync(arcanasPath, 'utf8'));
} catch (e) {
    console.log("Could not read arcanas.json or it doesn't exist yet.");
}

const report = {
    itemsAudit: {
        total: items.length,
        duplicateIds: [],
        missingNameEn: 0,
        missingNameJa: 0,
        missingStats: 0,
        missingPrice: 0,
        fixed: 0
    },
    arcanasAudit: {
        total: arcanas.length,
        missingNameEn: 0,
        missingStatsEn: 0,
        fixed: 0
    }
};

const itemIds = new Set();
let itemsModified = false;

items.forEach(item => {
    if (itemIds.has(item.id)) {
        report.itemsAudit.duplicateIds.push(item.id);
    }
    itemIds.add(item.id);

    let needsFix = false;
    if (!item.nameEn) { report.itemsAudit.missingNameEn++; item.nameEn = item.name || `Item_${item.id}`; needsFix = true; }
    if (!item.nameJa) { report.itemsAudit.missingNameJa++; item.nameJa = item.name || `アイテム_${item.id}`; needsFix = true; }
    if (!item.stats) { report.itemsAudit.missingStats++; item.stats = []; needsFix = true; }
    if (item.price === undefined) { report.itemsAudit.missingPrice++; item.price = 0; needsFix = true; }

    if (needsFix) {
        report.itemsAudit.fixed++;
        itemsModified = true;
    }
});

if (itemsModified) {
    fs.writeFileSync(itemsPath, JSON.stringify(items, null, 2), 'utf8');
}

let arcanasModified = false;

arcanas.forEach(arcana => {
    let needsFix = false;
    if (!arcana.name_en) { report.arcanasAudit.missingNameEn++; arcana.name_en = arcana.name || `Arcana_${arcana.id}`; needsFix = true; }
    if (!arcana.stats_en) { report.arcanasAudit.missingStatsEn++; arcana.stats_en = arcana.stats || {}; needsFix = true; }

    if (needsFix) {
        report.arcanasAudit.fixed++;
        arcanasModified = true;
    }
});

if (arcanasModified) {
    fs.writeFileSync(arcanasPath, JSON.stringify(arcanas, null, 2), 'utf8');
}

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
console.log("Audit and fix complete.");
