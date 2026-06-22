const fs = require('fs');
const path = require('path');

const jaPath = 'C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/ja.json';
const jaData = JSON.parse(fs.readFileSync(jaPath, 'utf8'));

for (let i = 1; i <= 6; i++) {
    const resPath = `C:/Users/81901/Desktop/オナーオブキングスサイト/scratch/cutoff_results_${i}.json`;
    if (!fs.existsSync(resPath)) {
        console.log(`File not found: ${resPath}`);
        continue;
    }
    
    const resData = JSON.parse(fs.readFileSync(resPath, 'utf8'));
    for (const key of Object.keys(resData)) {
        const item = resData[key];
        const heroId = item.hero_id;
        let skillKey = item.skill_key;
        
        // Some agents output e.g. "バイロン_skill2" but the heroId is set to "hero_084".
        // Ensure skillKey is just the skill part (e.g., "skill2")
        if (skillKey.includes('_')) {
            // e.g. if skillKey is "hero_084_skill2" or "バイロン_skill2"
            const parts = skillKey.split('_');
            skillKey = parts[parts.length - 1]; // "skill2"
        }
        
        if (!jaData[heroId]) {
            console.log(`Hero ${heroId} not found in ja.json`);
            continue;
        }
        
        if (!jaData[heroId][skillKey]) {
            console.log(`Skill ${skillKey} not found for ${heroId}`);
            continue;
        }
        
        const skill = jaData[heroId][skillKey];
        
        if (item.appended_text) {
            skill.description = (skill.description || "") + "\n" + item.appended_text.trim();
        }
        
        if (item.appended_table && item.appended_table.rows && item.appended_table.rows.length > 0) {
            if (!skill.table) {
                skill.table = item.appended_table;
            } else {
                // Check if rows are already appended to avoid duplication
                // Just compare the first appended row with the last existing row roughly
                const existingRowsStr = JSON.stringify(skill.table.rows);
                const newFirstRowStr = JSON.stringify(item.appended_table.rows[0]);
                
                if (!existingRowsStr.includes(newFirstRowStr)) {
                    skill.table.rows.push(...item.appended_table.rows);
                } else {
                    console.log(`Rows might already be appended for ${heroId} ${skillKey}`);
                }
            }
        }
        console.log(`Merged ${key} -> ${heroId} ${skillKey}`);
    }
}

fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2), 'utf8');
console.log("Successfully merged all cut-off results into ja.json!");
