const fs = require('fs');

const jaPath = 'C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/ja.json';
const jaData = JSON.parse(fs.readFileSync(jaPath, 'utf8'));

const defaultForm1Names = {
  "hero_047": "軽剣装備時",
  "hero_083": "人形態",
  "hero_069": "通常",
  "hero_102": "通常",
  "hero_059": "守護モード",
  "hero_103": "通常",
  "hero_110": "通常",
  "hero_058": "通常",
  "hero_095": "通常"
};

for (let i = 1; i <= 2; i++) {
    const resPath = `C:/Users/81901/Desktop/オナーオブキングスサイト/scratch/switchable_results_${i}.json`;
    if (!fs.existsSync(resPath)) continue;
    
    const resData = JSON.parse(fs.readFileSync(resPath, 'utf8'));
    for (const key of Object.keys(resData)) {
        const extracted = resData[key];
        const heroId = extracted.hero_id;
        
        if (!jaData[heroId]) continue;
        
        for (const skillKey of ['passive', 'skill1', 'skill2', 'skill3', 'skill4']) {
            if (!extracted[skillKey]) continue;
            
            const originalSkill = jaData[heroId][skillKey];
            if (!originalSkill) continue;
            
            const newForms = [];
            
            // 1. Keep the original skill as Form 1
            const form1Name = defaultForm1Names[heroId] || "通常";
            newForms.push({
                form_name: form1Name,
                description: originalSkill.description || "",
                table: originalSkill.table || null
            });
            
            // 2. Append the extracted skill(s)
            const extSkill = extracted[skillKey];
            if (extSkill.forms && Array.isArray(extSkill.forms)) {
                for (const f of extSkill.forms) {
                    newForms.push(f);
                }
            } else {
                let form2Name = extSkill.name && extSkill.name !== originalSkill.name ? extSkill.name : "切り替え後";
                if (heroId === 'hero_047') form2Name = "重剣装備時";
                if (heroId === 'hero_083') form2Name = "虎形態";
                if (heroId === 'hero_058') form2Name = "変身後";
                
                newForms.push({
                    form_name: form2Name,
                    description: extSkill.description || "",
                    table: extSkill.table || null
                });
            }
            
            // 3. Update jaData
            jaData[heroId][skillKey].forms = newForms;
            
            // Optional: update name if it changed to a combo name (like "九泉戈 / 裂天弓")
            if (extSkill.name && extSkill.name.includes('/')) {
                jaData[heroId][skillKey].name = extSkill.name;
            }
            
            console.log(`Merged forms for ${heroId} ${skillKey}`);
        }
    }
}

fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2), 'utf8');
console.log("Successfully smart-merged extracted forms without deleting original data.");
