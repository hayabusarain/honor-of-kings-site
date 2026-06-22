const fs = require('fs');

const jaPath = 'C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/ja.json';
const enPath = 'C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/en.json';

const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const missing = {
  'hero_069': ['passive'],
  'hero_083': ['passive'],
  'hero_059': ['passive'],
  'hero_103': ['skill1', 'skill2'],
  'hero_110': ['passive', 'skill3'],
  'hero_058': ['passive'],
  'hero_095': ['passive']
};

for (const [heroId, skills] of Object.entries(missing)) {
  if (ja[heroId]) {
    skills.forEach(skill => {
      if (en[heroId] && en[heroId][skill]) {
        ja[heroId][skill] = en[heroId][skill];
        console.log(`Restored ${skill} for ${heroId}`);
      }
    });
  }
}

fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2));
console.log("Successfully restored missing skills.");
