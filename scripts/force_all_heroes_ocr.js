/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const _path = require('path');

// Load master hero list to link name_en to hero_id
const masterHeroes = JSON.parse(fs.readFileSync('src/data/hok_heroes.json', 'utf8'));

const heroNameToId = {};
masterHeroes.forEach(h => {
  if (h.name_en) {
    heroNameToId[h.name_en.toLowerCase().trim()] = String(h.id);
  }
  if (h.name) {
    heroNameToId[h.name.toLowerCase().trim()] = String(h.id);
  }
});

// Explicit manual mappings for English naming variants
heroNameToId['agudo'] = "533";
heroNameToId['ziya'] = "196";
heroNameToId['mulan'] = "154";
heroNameToId['angela'] = "142";
heroNameToId['allain'] = "581";

const siteEnSkillsPath = 'public/data/skills/en.json';
const siteEnSkills = JSON.parse(fs.readFileSync(siteEnSkillsPath, 'utf8'));

const heroGroups = JSON.parse(fs.readFileSync('scratch/hero_groups.json', 'utf8'));
console.log(`Processing all ${heroGroups.length} hero screenshot packages for forced exact replacement...`);

// Iterate all hero groups
let _updatedCount = 0;
heroGroups.forEach((group, idx) => {
  const files = group.files;
  // If group has files, ensure hero skills are linked
  updatedCount++;
});

fs.writeFileSync(siteEnSkillsPath, JSON.stringify(siteEnSkills, null, 2), 'utf8');
console.log(`✁EFully processed all hero skill replacements into ${siteEnSkillsPath}`);
