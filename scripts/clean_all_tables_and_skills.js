/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const _path = require('path');

const siteEnSkillsPath = 'public/data/skills/en.json';
const siteEnSkills = JSON.parse(fs.readFileSync(siteEnSkillsPath, 'utf8'));

console.log('Cleaning table headers and skill IDs for all heroes in public/data/skills/en.json...');

Object.keys(siteEnSkills).forEach(heroId => {
  const hero = siteEnSkills[heroId];
  if (hero && hero.skills) {
    hero.skills.forEach((skill, idx) => {
      // Ensure skill ID is clean
      if (!skill.id) {
        if (idx === 0) skill.id = 'P';
        else if (idx === 1) skill.id = 'Q';
        else if (idx === 2) skill.id = 'W';
        else if (idx === 3) skill.id = 'E';
        else skill.id = `R${idx}`;
      }

      // Ensure skill type is clean
      if (!skill.type) {
        if (idx === 0) skill.type = 'Passive';
        else if (idx === 1) skill.type = 'Skill 1';
        else if (idx === 2) skill.type = 'Skill 2';
        else if (idx === 3) skill.type = 'Ultimate';
        else skill.type = `Form Skill ${idx}`;
      }

      // Clean table header
      if (skill.table && skill.table.headers) {
        skill.table.headers = skill.table.headers.filter(h => String(h).toLowerCase() !== 'details' && String(h) !== '詳細');
      }

      // Clean forms table header
      if (skill.forms) {
        skill.forms.forEach(form => {
          if (form.table && form.table.headers) {
            form.table.headers = form.table.headers.filter(h => String(h).toLowerCase() !== 'details' && String(h) !== '詳細');
          }
        });
      }
    });
  }
});

fs.writeFileSync(siteEnSkillsPath, JSON.stringify(siteEnSkills, null, 2), 'utf8');
console.log('✁ESuccessfully cleaned all skill IDs, badges, and table headers!');
