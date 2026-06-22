const fs = require('fs');

const heroes = JSON.parse(fs.readFileSync('./src/data/hok_heroes.json', 'utf8'));

// 1. hero_stats.json
// Needs: hero_name, hero_name_en, role, win_rate, tier
const heroStats = heroes.map(h => ({
  hero_name: h.nameJa,
  hero_name_en: h.nameEn,
  role: h.role,
  win_rate: h.winRate,
  tier: h.tier
}));
fs.writeFileSync('./src/data/hero_stats.json', JSON.stringify(heroStats, null, 2));

// 2. top_tier.json
// Needs: hero_name, hero_name_en, role, winRate, tier
// We just pick top 10 heroes
const topTier = heroes.slice(0, 10).map(h => ({
  hero_name: h.nameJa,
  hero_name_en: h.nameEn,
  role: h.role,
  winRate: h.winRate,
  tier: h.tier
}));
fs.writeFileSync('./src/data/top_tier.json', JSON.stringify(topTier, null, 2));

// 3. patch_meta.json
// Needs: version, change_type, hero_name, hero_name_en, summary, details
const patchMeta = [
  {
    version: "1.0",
    change_type: "buff",
    hero_name: heroes[0].nameJa,
    hero_name_en: heroes[0].nameEn,
    summary: "Buffed",
    details: ["Increased damage"]
  },
  {
    version: "1.0",
    change_type: "nerf",
    hero_name: heroes[1].nameJa,
    hero_name_en: heroes[1].nameEn,
    summary: "Nerfed",
    details: ["Decreased health"]
  }
];
fs.writeFileSync('./src/data/patch_meta.json', JSON.stringify(patchMeta, null, 2));

console.log('Home page mock data replaced with Honor of Kings heroes!');
