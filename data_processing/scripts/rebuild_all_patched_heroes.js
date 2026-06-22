const fs = require('fs');
const path = require('path');

const heroesFile = path.resolve('src/data/hok_heroes.json');
const jaSkillsFile = path.resolve('public/data/skills/ja.json');
const extractedDir = path.resolve('data_processing/extracted_skills');

const heroes = JSON.parse(fs.readFileSync(heroesFile, 'utf8'));
const jaSkills = JSON.parse(fs.readFileSync(jaSkillsFile, 'utf8'));

const files = fs.readdirSync(extractedDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(extractedDir, file), 'utf8'));
  const heroName = data.hero_name;
  
  const hero = heroes.find(h => h.name === heroName);
  if (!hero) continue;
  
  const heroId = hero.id;

  if (jaSkills[heroId]) {
    // 1. Wipe existing keys to ensure a clean slate
    ['passive', 'skill1', 'skill2', 'skill3', 'skill4', 'skill_1', 'skill_2', 'skill_3', 'skill_4'].forEach(k => {
      delete jaSkills[heroId][k];
    });

    const skillsArr = data.skills;
    if (skillsArr && skillsArr.length > 0) {
      if (skillsArr[0]) jaSkills[heroId].passive = { name: skillsArr[0].name, description: skillsArr[0].description };
      if (skillsArr[1]) jaSkills[heroId].skill1 = { name: skillsArr[1].name, description: skillsArr[1].description };
      if (skillsArr[2]) jaSkills[heroId].skill2 = { name: skillsArr[2].name, description: skillsArr[2].description };
      if (skillsArr[3]) jaSkills[heroId].skill3 = { name: skillsArr[3].name, description: skillsArr[3].description };
      if (skillsArr[4]) jaSkills[heroId].skill4 = { name: skillsArr[4].name, description: skillsArr[4].description };

      // 2. Parse tables
      ['passive', 'skill1', 'skill2', 'skill3', 'skill4'].forEach(sk => {
        const skill = jaSkills[heroId][sk];
        if (!skill || !skill.description) return;
        
        // Look for [Lv.X - Lv.Y] or [Lv.X]
        const match = skill.description.match(/\n*\[(Lv\.[^\]]+)\]\n([\s\S]+)$/);
        if (match) {
          const headerText = match[1];
          const rowsText = match[2];
          
          const rows = [];
          const lines = rowsText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          let numColumns = 0;
          
          for (const line of lines) {
            const sepIndex = line.indexOf(':') !== -1 ? line.indexOf(':') : line.indexOf('：');
            if (sepIndex !== -1) {
              const label = line.substring(0, sepIndex).trim();
              const valuesStr = line.substring(sepIndex + 1).trim();
              
              // Split by slash, arrows, tilde, or hyphen
              let values = valuesStr.split(/\s*(?:\/|→|->|~|-)\s*/).map(v => v.trim());
              
              if (values.length > numColumns) {
                numColumns = values.length;
              }
              rows.push({
                label: label,
                values: values
              });
            }
          }
          
          if (rows.length > 0) {
            const headers = [];
            // Infer headers
            if (numColumns === 2 && headerText.includes('Lv.15')) {
               headers.push('Lv.1', 'Lv.15');
            } else {
               for (let i = 1; i <= numColumns; i++) {
                 headers.push(`Lv.${i}`);
               }
            }
            
            skill.table = {
              headers: headers,
              rows: rows
            };
            
            // Remove the table text from description
            skill.description = skill.description.substring(0, match.index).trim();
          }
        }
      });
    }
  }
}

fs.writeFileSync(jaSkillsFile, JSON.stringify(jaSkills, null, 2));
console.log('Successfully wiped, rewritten, and parsed tables for all patched heroes.');
