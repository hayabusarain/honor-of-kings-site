const fs = require('fs');
const path = require('path');

const itemsPath = path.join(__dirname, '../src/data/physical_items_final.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

console.log("Checking all potential boot enchantments in database:");
const enchantments = [
  'ステイシス', 'クイックシルバー', 'ヴェール', 'グローリー', 'ゲイルフォース', 
  'ゴアドリンカー', 'ストーンプレート', 'ストライドブレイカー', 'ドリームメーカー', 
  'プロトベルト', 'ロケット'
];

items.forEach(item => {
  const matchesName = enchantments.some(enc => item.nameJa.includes(enc));
  if (matchesName || item.gold === 1400 || item.gold === 1700 || item.gold === 1900 || item.nameJa.includes('マーキュリー')) {
    console.log(`- ${item.nameJa} (ID: ${item.id}, Gold: ${item.gold}G, image: ${item.image})`);
  }
});
