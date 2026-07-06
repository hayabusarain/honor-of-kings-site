const fs = require('fs');
const path = require('path');

const jaPath = path.join(__dirname, '../public/data/skills/ja.json');
const jaData = JSON.parse(fs.readFileSync(jaPath, 'utf8'));

const heroesToUpdate = ['hero_631', 'hero_635', 'hero_640'];

const placeholderSkill = {
  name: "Coming Soon",
  tags: [],
  cooldown: "-",
  description: "こちらのスキルの詳細データは現在準備中です。後日のアップデートで追加されます。",
  icon: "/images/heroes/default.png"
};

heroesToUpdate.forEach(heroId => {
  jaData[heroId] = {
    passive: { ...placeholderSkill },
    skill1: { ...placeholderSkill },
    skill2: { ...placeholderSkill },
    skill3: { ...placeholderSkill },
    strategy: {
      earlyGame: "データ準備中...",
      midGame: "データ準備中...",
      lateGame: "データ準備中...",
      teamfight: "データ準備中...",
      commonMistakes: "データ準備中..."
    },
    meta: {
      summoner_spells: [],
      synergy: [],
      counters: []
    },
    strengths: ["データ準備中..."],
    weaknesses: ["データ準備中..."]
  };
});

fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2), 'utf8');
console.log("Added Coming Soon placeholders to ja.json for the new heroes.");
