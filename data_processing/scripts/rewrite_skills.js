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
  if (!hero) {
    console.error(`Hero not found: ${heroName}`);
    continue;
  }
  
  const heroId = hero.id;

  if (jaSkills[heroId]) {
    const skillsArr = data.skills;
    if (skillsArr && skillsArr.length > 0) {
      // Completely overwrite the skill objects
      if (skillsArr[0]) {
        jaSkills[heroId].passive = {
          name: skillsArr[0].name,
          description: skillsArr[0].description
        };
      }
      if (skillsArr[1]) {
        jaSkills[heroId].skill_1 = {
          name: skillsArr[1].name,
          description: skillsArr[1].description
        };
      }
      if (skillsArr[2]) {
        jaSkills[heroId].skill_2 = {
          name: skillsArr[2].name,
          description: skillsArr[2].description
        };
      }
      if (skillsArr[3]) {
        jaSkills[heroId].skill_3 = {
          name: skillsArr[3].name,
          description: skillsArr[3].description
        };
      }
      if (skillsArr[4]) {
        jaSkills[heroId].skill_4 = {
          name: skillsArr[4].name,
          description: skillsArr[4].description
        };
      } else {
        // If skill 4 doesn't exist in new data, delete it if it existed
        delete jaSkills[heroId].skill_4;
      }
    }
  }
}

fs.writeFileSync(jaSkillsFile, JSON.stringify(jaSkills, null, 2));
console.log('Successfully wiped and replaced skill data for patched heroes.');
