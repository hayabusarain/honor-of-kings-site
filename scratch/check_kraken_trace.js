const fs = require('fs');
const path = require('path');

const tracedPath = path.join(__dirname, '../scratch/traced_items.json');
if (!fs.existsSync(tracedPath)) {
    console.error('traced_items.json does not exist');
    process.exit(1);
}

const traced = JSON.parse(fs.readFileSync(tracedPath, 'utf8'));

const kraken = traced.find(t => t.nameJa.includes('クラーケン') || t.nameJa.includes('ナヴォリ') || t.nameJa.includes('コレクター'));
console.log('Kraken/Navori/Collector trace:', kraken);

const allUnmappedOrFaux = traced.filter(t => t.sourceFile === null);
console.log('All unmapped items in final database:', allUnmappedOrFaux);
