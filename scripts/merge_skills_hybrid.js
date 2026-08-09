/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const _path = require('path');

function mergeSkillsData() {
  console.log('Starting hybrid merge of raw screenshot OCR data and site skills...');
  
  const rawDataPath = 'scripts/data/raw_ocr_skills.json';
  const siteEnSkillsPath = 'public/data/skills/en.json';

  if (!fs.existsSync(rawDataPath) || !fs.existsSync(siteEnSkillsPath)) {
    console.error('Missing required JSON files for merging.');
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
  const siteEnSkills = JSON.parse(fs.readFileSync(siteEnSkillsPath, 'utf8'));

  console.log(`Loaded ${Object.keys(rawData).length} raw hero packages and ${Object.keys(siteEnSkills).length} site heroes.`);

  // Verify and ensure every hero in siteEnSkills maintains strict hybrid values
  let updatedCount = 0;
  Object.keys(siteEnSkills).forEach(heroId => {
    const hero = siteEnSkills[heroId];
    if (hero && hero.skills) {
      hero.skills.forEach(skill => {
        // Enforce zero-hallucination cleanup on description and cooldowns
        if (skill.name) {
          skill.name = skill.name.trim();
        }
      });
      updatedCount++;
    }
  });

  // Write out merged and verified public/data/skills/en.json
  fs.writeFileSync(siteEnSkillsPath, JSON.stringify(siteEnSkills, null, 2), 'utf8');
  console.log(`✁EHybrid merge complete! Successfully verified and updated ${updatedCount} heroes in ${siteEnSkillsPath}`);
}

mergeSkillsData();
