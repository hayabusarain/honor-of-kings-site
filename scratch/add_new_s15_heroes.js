const fs = require('fs');
const path = require('path');

const tierListPath = path.join(__dirname, '../tier_list.json');
const statsPath = path.join(__dirname, '../src/data/hero_stats_camp.json');
const heroesPath = path.join(__dirname, '../src/data/hok_heroes.json');

const tierData = JSON.parse(fs.readFileSync(tierListPath, 'utf8'));
const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
const heroesData = JSON.parse(fs.readFileSync(heroesPath, 'utf8'));

const list = tierData.data.list;

const missingNames = ['フロレンティーノ', 'ロリアン', 'アネット'];
const classMap = {
  "ファイター": "CLASH",
  "タンク": "CLASH",
  "アサシン": "JUNGLE",
  "メイジ": "MID",
  "マークスマン": "FARM",
  "サポート": "ROAM"
};

for (const jpName of missingNames) {
  const item = list.find(i => i.heroInfo.heroName === jpName);
  if (item) {
    const heroId = `hero_${item.heroInfo.heroId}`;
    
    // Add to hok_heroes.json if not present
    if (!heroesData.find(h => h.id === heroId || h.nameJa === jpName)) {
      let nameEn = "";
      if (jpName === 'フロレンティーノ') nameEn = "Florentino";
      if (jpName === 'ロリアン') nameEn = "Lorion";
      if (jpName === 'アネット') nameEn = "Annette";

      heroesData.push({
        id: heroId,
        nameEn: nameEn,
        nameCn: nameEn, // Placeholder
        nameJa: jpName
      });
      console.log(`Added ${jpName} to hok_heroes.json`);
    }

    // Add to hero_stats_camp.json
    if (!statsData[heroId]) {
      const tRank = item.tRank;
      let newTier = "C";
      if (tRank === 0) newTier = "S";
      else if (tRank === 1) newTier = "A";
      else if (tRank === 2) newTier = "B";
      else if (tRank >= 3) newTier = "C";

      const winRate = parseFloat((item.winRate * 100).toFixed(2));
      const pickRate = parseFloat((item.showRate * 100).toFixed(2));
      const banRate = parseFloat((item.banRate * 100).toFixed(2));
      
      const career = item.heroInfo.heroCareer.split('/')[0];
      const lane = classMap[career] || "CLASH";

      statsData[heroId] = {
        jpName: jpName,
        tier: newTier,
        lane: lane,
        win_rate: winRate,
        pick_rate: pickRate,
        ban_rate: banRate
      };
      console.log(`Added ${jpName} to hero_stats_camp.json`);
    }
  }
}

fs.writeFileSync(heroesPath, JSON.stringify(heroesData, null, 2), 'utf8');
fs.writeFileSync(statsPath, JSON.stringify(statsData, null, 2), 'utf8');

console.log("Done adding new heroes.");
