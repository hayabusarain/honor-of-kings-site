const fs = require('fs');
const path = require('path');

const heroesPath = path.join(__dirname, '../src/data/hok_heroes.json');
const statsPath = path.join(__dirname, '../src/data/hero_detailed_stats.json');

const heroesData = JSON.parse(fs.readFileSync(heroesPath, 'utf8'));
const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8'));

for (let hero of heroesData) {
  if (hero.id === 'hero_631') {
    hero.title = '百花の剣豪';
  }
  if (hero.id === 'hero_635') {
    hero.title = '永夜の悪夢';
  }
  if (hero.id === 'hero_640') {
    hero.title = '風の守護';
  }
}

// Add empty stats to prevent crash
const emptyStats = {
  "最大HP": "-",
  "最大MP": "-",
  "物理攻撃": "-",
  "魔法攻撃": "-",
  "物理防御": "-",
  "魔法防御": "-",
  "移動速度": "-",
  "物理防御貫通": "-",
  "魔法防御貫通": "-",
  "攻撃速度ボーナス": "-",
  "クリティカル率": "-",
  "クリティカル効果": "-",
  "物理ライフスティール": "-",
  "魔法ライフスティール": "-",
  "クールダウン短縮": "-",
  "攻撃範囲": "-",
  "耐性": "-",
  "5秒ごとのHP回復": "-",
  "5秒ごとのMP回復": "-"
};

if (!statsData['hero_631']) statsData['hero_631'] = { ...emptyStats };
if (!statsData['hero_635']) statsData['hero_635'] = { ...emptyStats };
if (!statsData['hero_640']) statsData['hero_640'] = { ...emptyStats };

fs.writeFileSync(heroesPath, JSON.stringify(heroesData, null, 2), 'utf8');
fs.writeFileSync(statsPath, JSON.stringify(statsData, null, 2), 'utf8');

console.log("Updated titles and stats");
