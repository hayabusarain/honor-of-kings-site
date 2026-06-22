const fs = require('fs');

const jaPath = 'C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/ja.json';
const jaData = JSON.parse(fs.readFileSync(jaPath, 'utf8'));

for (let i = 1; i <= 2; i++) {
    const resPath = `C:/Users/81901/Desktop/オナーオブキングスサイト/scratch/switchable_results_${i}.json`;
    if (!fs.existsSync(resPath)) {
        console.log(`File not found: ${resPath}`);
        continue;
    }
    
    const resData = JSON.parse(fs.readFileSync(resPath, 'utf8'));
    for (const key of Object.keys(resData)) {
        const extracted = resData[key];
        const heroId = extracted.hero_id;
        
        if (!jaData[heroId]) {
            console.log(`Hero ${heroId} not found in ja.json`);
            continue;
        }
        
        // Remove old skills
        delete jaData[heroId].passive;
        delete jaData[heroId].skill1;
        delete jaData[heroId].skill2;
        delete jaData[heroId].skill3;
        delete jaData[heroId].skill4;
        delete jaData[heroId].skills;
        
        // Set new skills
        if (extracted.passive) jaData[heroId].passive = extracted.passive;
        if (extracted.skill1) jaData[heroId].skill1 = extracted.skill1;
        if (extracted.skill2) jaData[heroId].skill2 = extracted.skill2;
        if (extracted.skill3) jaData[heroId].skill3 = extracted.skill3;
        if (extracted.skill4) jaData[heroId].skill4 = extracted.skill4;
        
        console.log(`Fully replaced switchable skills for ${key} -> ${heroId}`);
    }
}

fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2), 'utf8');
console.log("Successfully overwrote forms skills for all 9 heroes!");
