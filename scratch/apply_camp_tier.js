const fs = require('fs');
const path = require('path');

const tierListPath = path.join(__dirname, '../tier_list.json');
const statsPath = path.join(__dirname, '../src/data/hero_stats_camp.json');

try {
  const tierData = JSON.parse(fs.readFileSync(tierListPath, 'utf8'));
  const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8'));

  // Create a mapping from jpName to hero_id
  const nameToId = {};
  for (const [heroId, data] of Object.entries(statsData)) {
    if (data.jpName) {
      nameToId[data.jpName] = heroId;
    }
  }

  // Alias for mismatches
  const aliases = {
    // "タイガー": "裴擒虎",
  };

  const list = tierData.data.list;
  let updatedCount = 0;
  let missing = [];

  for (const item of list) {
    let heroName = item.heroInfo.heroName;
    if (aliases[heroName]) heroName = aliases[heroName];

    let matchedId = nameToId[heroName];

    if (!matchedId) {
      // try partial matches
      for (const [jpName, id] of Object.entries(nameToId)) {
        if (jpName.includes(heroName) || heroName.includes(jpName)) {
          matchedId = id;
          break;
        }
      }
    }

    if (matchedId) {
      const tRank = item.tRank;
      let newTier = "C";
      if (tRank === 0) newTier = "S";
      else if (tRank === 1) newTier = "A";
      else if (tRank === 2) newTier = "B";
      else if (tRank >= 3) newTier = "C";

      const winRate = parseFloat((item.winRate * 100).toFixed(2));
      const pickRate = parseFloat((item.showRate * 100).toFixed(2));
      const banRate = parseFloat((item.banRate * 100).toFixed(2));

      statsData[matchedId].tier = newTier;
      statsData[matchedId].win_rate = winRate;
      statsData[matchedId].pick_rate = pickRate;
      statsData[matchedId].ban_rate = banRate;
      updatedCount++;
    } else {
      missing.push(heroName);
    }
  }

  fs.writeFileSync(statsPath, JSON.stringify(statsData, null, 2), 'utf8');
  console.log(`Updated ${updatedCount} heroes.`);
  if (missing.length > 0) {
    console.log(`Could not find these heroes:`, missing);
  }

} catch (err) {
  console.error(err);
}
