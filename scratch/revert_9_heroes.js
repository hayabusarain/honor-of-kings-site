const fs = require('fs');

const jaPath = 'C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/ja.json';
const enPath = 'C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/en.json';

const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const heroesToRevert = [
  'hero_069', 'hero_102', 'hero_083', 'hero_059', 
  'hero_047', 'hero_103', 'hero_110', 'hero_058', 'hero_095'
];

for (const heroId of heroesToRevert) {
  if (ja[heroId] && en[heroId]) {
    // Delete all current skills
    delete ja[heroId].passive;
    delete ja[heroId].skill1;
    delete ja[heroId].skill2;
    delete ja[heroId].skill3;
    delete ja[heroId].skill4;
    delete ja[heroId].skills;
    
    // Restore from en.json (which contains the original Japanese translation)
    if (en[heroId].passive) ja[heroId].passive = en[heroId].passive;
    if (en[heroId].skill1) ja[heroId].skill1 = en[heroId].skill1;
    if (en[heroId].skill2) ja[heroId].skill2 = en[heroId].skill2;
    if (en[heroId].skill3) ja[heroId].skill3 = en[heroId].skill3;
    if (en[heroId].skill4) ja[heroId].skill4 = en[heroId].skill4;
    
    console.log(`Reverted all skills for ${heroId}`);
  }
}

fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2), 'utf8');
console.log('Successfully completely reverted 9 heroes to their original states.');
