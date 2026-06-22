const fs = require('fs');
const path = require('path');

const resultsDir = 'scratch/stats_results';
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Read all JSON files in the results directory
const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('.json'));
const merged = {};

for (const file of files) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
    Object.assign(merged, data);
  } catch (e) {
    console.error('Error reading file:', file, e);
  }
}

// Read hok_heroes.json to try mapping Japanese names to English IDs
// Since hok_heroes.json only has English names, we might need ja.json for mapping
const jaSkillsFile = 'public/data/skills/ja.json';
let jaSkills = {};
if (fs.existsSync(jaSkillsFile)) {
  jaSkills = JSON.parse(fs.readFileSync(jaSkillsFile, 'utf8'));
}

const finalStats = {};

// Create mapping from hero_name (Japanese) to hero_id (e.g. hero_001)
const nameToId = {};
for (const [id, hero] of Object.entries(jaSkills)) {
  if (hero && hero.hero_name) {
    // Sometimes names have subtitles like "元流の子（タンク）"
    const baseName = hero.hero_name.split('（')[0].split(' ')[0].trim();
    nameToId[baseName] = id;
    nameToId[hero.hero_name.trim()] = id;
  }
}

// Special overrides for names that OCR might slightly misread or use different spellings
const aliases = {
  'アーサー': 'hero_166',
  'アンジェラ': 'hero_142',
  'ラプール': nameToId['ラブール'] || 'ラブール',
  '鐘馗': nameToId['鍾馗'] || '鍾馗',
  'バイロン': nameToId['狂鉄'] || '狂鉄',
  '弈星': nameToId['棋星'] || '棋星',
  '海月': nameToId['溟月'] || '溟月',
  'タイガー': nameToId['裴擒虎'] || '裴擒虎',
  '元流の子（タンク）': 'hero_001',
  '元流の子（メイジ）': 'hero_002',
  '元流の子（マークスマン）': 'hero_006',
};

let unmapped = 0;
for (const [jpName, stats] of Object.entries(merged)) {
  let heroId = nameToId[jpName] || nameToId[jpName.replace(/\s+/g, '')] || aliases[jpName];
  
  // Fuzzy match
  if (!heroId) {
    for (const [name, id] of Object.entries(nameToId)) {
      if (name.includes(jpName) || jpName.includes(name)) {
        heroId = id;
        break;
      }
    }
  }

  if (heroId) {
    finalStats[heroId] = {
      jpName,
      ...stats
    };
  } else {
    console.warn(`Could not map Japanese name: ${jpName}`);
    unmapped++;
    finalStats[jpName] = stats; // keep it anyway for manual mapping later
  }
}

fs.writeFileSync('public/data/hero_stats_camp.json', JSON.stringify(finalStats, null, 2));
console.log(`Merged ${Object.keys(merged).length} heroes. Unmapped: ${unmapped}. Saved to public/data/hero_stats_camp.json`);
