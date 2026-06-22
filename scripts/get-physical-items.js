// Using native fetch in Node 18+
const fs = require('fs');

async function main() {
  const resJa = await fetch('https://ddragon.leagueoflegends.com/cdn/14.8.1/data/ja_JP/item.json');
  const dataJa = await resJa.json();
  const resEn = await fetch('https://ddragon.leagueoflegends.com/cdn/14.8.1/data/en_US/item.json');
  const dataEn = await resEn.json();

  const items = [];
  const adItems = Object.keys(dataJa.data).filter(key => {
    const item = dataJa.data[key];
    // Filter for completed items (gold > 1500) and have AD, Crit, AS, or Armor Pen
    const stats = item.stats || {};
    const hasPhysicalStats = stats.FlatPhysicalDamageMod > 0 || 
                             stats.FlatCritChanceMod > 0 || 
                             stats.PercentAttackSpeedMod > 0 ||
                             (item.description && (item.description.includes('攻撃力') || item.description.includes('クリティカル') || item.description.includes('攻撃速度')));
    
    return hasPhysicalStats && item.gold && item.gold.total > 1500 && item.maps && item.maps['11']; // SR items
  });

  for (const key of adItems) {
    const itemJa = dataJa.data[key];
    const itemEn = dataEn.data[key];
    items.push({
      id: key,
      nameJa: itemJa.name,
      nameEn: itemEn.name,
      gold: itemJa.gold.total,
      description: itemJa.description,
      image: itemJa.image.full
    });
  }

  // Write to a local data file
  fs.writeFileSync('src/data/physical_items_dd.json', JSON.stringify(items, null, 2));
  console.log(`Found ${items.length} physical items. Written to src/data/physical_items_dd.json`);
}

main();
