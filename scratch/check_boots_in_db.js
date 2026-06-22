const fs = require('fs');
const path = require('path');

const itemsPath = path.join(__dirname, '../src/data/physical_items_final.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

console.log("Boot items in final database:");
items.forEach(item => {
  const isBoot = item.nameJa.includes('ブーツ') || 
                 item.nameJa.includes('スチールキャップ') || 
                 item.nameJa.includes('マーキュリー') || 
                 item.nameJa === 'プロトベルト' || 
                 item.nameJa === 'ステイシス';
                 
  // Let's also check if it has "マーキュリー" in name
  if (isBoot || item.nameJa.includes('マーキュリー')) {
    console.log(`  - ${item.nameJa} (ID: ${item.id}, Gold: ${item.gold}G, image: ${item.image})`);
  }
});
