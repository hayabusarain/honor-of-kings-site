const fs = require('fs');

function run() {
  const hokHeroes = require('../../src/data/hok_heroes.json');
  const campDataRaw = fs.readFileSync('camp_data.json', 'utf8');

  let campData;
  try {
    campData = JSON.parse(campDataRaw);
  } catch (e) {
    console.error('Parse error. Attempting to fix truncated JSON...', e.message);
    // If the user somehow pasted a truncated JSON, we can try to fix it
    try {
      const lastBraceIndex = campDataRaw.lastIndexOf('}');
      const fixedStr = campDataRaw.substring(0, lastBraceIndex + 1) + ']}}';
      campData = JSON.parse(fixedStr);
      console.log('Successfully parsed fixed JSON!');
    } catch(err) {
      console.error('Could not fix JSON:', err.message);
      process.exit(1);
    }
  }

  const unmapped = [];
  const mapped = [];
  
  const newStats = {};

  const getTierFromTRank = (tRank) => {
    if (tRank === 0) return 'S';
    if (tRank === 1) return 'A';
    if (tRank === 2) return 'B';
    return 'C';
  };

  campData.data.list.forEach(campH => {
    const name = campH.heroInfo.heroName;
    // Handle naming differences like '元流の子（タンク）'
    let match = hokHeroes.find(h => h.name === name);
    if (!match) {
      // Try replacing characters or finding partial matches
      match = hokHeroes.find(h => h.name.includes(name) || name.includes(h.name));
    }
    
    // Special cases
    if (name === '元流の子（タンク）') match = hokHeroes.find(h => h.name === '元流の子（タンク）');
    if (name === '元流の子（メイジ）') match = hokHeroes.find(h => h.name === '元流の子（メイジ）');
    if (name === '元流の子（マークスマン）') match = hokHeroes.find(h => h.name === '元流の子（マークスマン）');
    if (name === '元流の子(タンク)') match = hokHeroes.find(h => h.name === '元流の子（タンク）');
    if (name === '元流の子(メイジ)') match = hokHeroes.find(h => h.name === '元流の子（メイジ）');
    if (name === '元流の子(マークスマン)') match = hokHeroes.find(h => h.name === '元流の子（マークスマン）');
    
    if (match) {
      mapped.push(name);
      const tier = getTierFromTRank(campH.tRank);
      
      let lane = 'CLASH';
      switch (campH.position) {
        case 0: lane = 'CLASH'; break;
        case 1: lane = 'MID'; break;
        case 2: lane = 'FARM'; break;
        case 3: lane = 'JUNGLE'; break;
        case 4: lane = 'ROAM'; break;
      }
      
      newStats[match.id] = {
        jpName: match.name,
        tier: tier,
        lane: lane,
        win_rate: parseFloat((campH.winRate * 100).toFixed(2)),
        pick_rate: parseFloat((campH.showRate * 100).toFixed(2)),
        ban_rate: parseFloat((campH.banRate * 100).toFixed(2))
      };
    } else {
      unmapped.push(name);
    }
  });

  console.log('Mapped:', mapped.length);
  if (unmapped.length > 0) {
    console.log('Unmapped:', unmapped);
  }

  // Preserve any heroes that weren't in the new data but were in the old data?
  // Usually it's better to just overwrite with the new data completely.
  // Wait, if a hero is unmapped, we should keep the old data for it.
  const oldStats = require('../../src/data/hero_stats_camp.json');
  const finalStats = { ...oldStats, ...newStats };

  fs.writeFileSync('src/data/hero_stats_camp.json', JSON.stringify(finalStats, null, 2), 'utf8');
  console.log('Successfully updated src/data/hero_stats_camp.json');
}

run();
