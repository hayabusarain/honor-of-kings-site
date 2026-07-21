const fs = require('fs');
const path = require('path');

const tierDataPath = 'c:/Users/81901/Desktop/ティアリスト.json';
const heroesPath = path.join(__dirname, '../src/data/hok_heroes.json');
const statsPath = path.join(__dirname, '../src/data/hero_stats_camp.json');

const tierData = require(tierDataPath);
const heroes = require(heroesPath);
let stats = {};
if (fs.existsSync(statsPath)) {
  stats = require(statsPath);
}

const rankMap = {
  0: 'S',
  1: 'A',
  2: 'B',
  3: 'C'
};

let updatedCount = 0;

tierData.data.list.forEach(h => {
  // Find hero
  const heroName = h.heroInfo.heroName;
  const match = heroes.find(hh => hh.name === heroName || hh.name.includes(heroName) || heroName.includes(hh.name));
  
  if (match) {
    const heroId = match.id;
    // Update stats
    if (!stats[heroId]) {
      stats[heroId] = {
        jpName: match.name,
        lane: match.lane || "ALL"
      };
    }
    stats[heroId].tier = rankMap[h.tRank] || 'C';
    stats[heroId].win_rate = parseFloat((h.winRate * 100).toFixed(2));
    stats[heroId].pick_rate = parseFloat((h.showRate * 100).toFixed(2));
    stats[heroId].ban_rate = parseFloat((h.banRate * 100).toFixed(2));
    updatedCount++;
  } else {
    console.log('Unmatched hero:', heroName);
  }
});

fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
console.log(`Updated ${updatedCount} heroes in hero_stats_camp.json`);
