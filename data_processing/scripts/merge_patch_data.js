const fs = require('fs');
const path = require('path');

const heroesFile = path.resolve('src/data/hok_heroes.json');
const patchesFile = path.resolve('src/data/patches.json');
const jaSkillsFile = path.resolve('public/data/skills/ja.json');
const extractedDir = path.resolve('data_processing/extracted_skills');

const heroes = JSON.parse(fs.readFileSync(heroesFile, 'utf8'));
const patches = JSON.parse(fs.readFileSync(patchesFile, 'utf8'));
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

  // 1. Update ja.json
  if (jaSkills[heroId]) {
    const skillsArr = data.skills;
    if (skillsArr && skillsArr.length > 0) {
      if (skillsArr[0]) {
        jaSkills[heroId].passive.name = skillsArr[0].name;
        jaSkills[heroId].passive.description = skillsArr[0].description;
      }
      if (skillsArr[1] && jaSkills[heroId].skill_1) {
        jaSkills[heroId].skill_1.name = skillsArr[1].name;
        jaSkills[heroId].skill_1.description = skillsArr[1].description;
      }
      if (skillsArr[2] && jaSkills[heroId].skill_2) {
        jaSkills[heroId].skill_2.name = skillsArr[2].name;
        jaSkills[heroId].skill_2.description = skillsArr[2].description;
      }
      if (skillsArr[3] && jaSkills[heroId].skill_3) {
        jaSkills[heroId].skill_3.name = skillsArr[3].name;
        jaSkills[heroId].skill_3.description = skillsArr[3].description;
      }
      if (skillsArr[4] && jaSkills[heroId].skill_4) {
        jaSkills[heroId].skill_4.name = skillsArr[4].name;
        jaSkills[heroId].skill_4.description = skillsArr[4].description;
      }
    }
  }

  // 2. Update patches.json
  // Check if 6.17 patch already exists for this hero
  const existingPatchIndex = patches.findIndex(p => p.version === '6.17' && p.hero_id === heroId);
  
  const patchEntry = {
    version: '6.17',
    change_type: data.change_type || 'adjust',
    hero_name: heroName,
    hero_name_en: hero.name_en || hero.id,
    description: `${data.patch_summary}。${data.skills.map(s => s.name + ': ' + s.description.substring(0, 50) + '...').join(' ')}`,
    description_en: `Stats ${data.change_type}.`,
    is_hero: true,
    id: `patch_6_17_${heroId}`,
    hero_id: heroId
  };

  if (existingPatchIndex !== -1) {
    patches[existingPatchIndex] = patchEntry;
  } else {
    patches.push(patchEntry);
  }
}

fs.writeFileSync(jaSkillsFile, JSON.stringify(jaSkills, null, 2));
fs.writeFileSync(patchesFile, JSON.stringify(patches, null, 2));

console.log('Successfully merged all patch data.');
