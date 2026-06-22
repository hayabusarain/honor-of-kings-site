const fs = require('fs');
const path = require('path');

const jaSkillsFile = path.resolve('public/data/skills/ja.json');
const ja = JSON.parse(fs.readFileSync(jaSkillsFile, 'utf8'));

Object.values(ja).forEach(hero => {
  if (hero.hero_id) {
    ['passive', 'skill1', 'skill2', 'skill3', 'skill4'].forEach(sk => {
      const skill = hero[sk];
      if (skill && skill.table && skill.table.rows) {
        let wasModified = false;
        skill.table.rows.forEach(r => {
          if (r.values.length === 1) {
            let val = r.values[0];
            if (val.includes('->')) {
              r.values = val.split(/\s*->\s*/);
              wasModified = true;
            } else if (val.includes('→')) {
              r.values = val.split(/\s*→\s*/);
              wasModified = true;
            } else if (val.includes('~')) {
              r.values = val.split(/\s*~\s*/);
              wasModified = true;
            }
          }
        });
        
        if (wasModified && skill.table.headers && skill.table.headers.length === 1) {
          skill.table.headers = ['Lv.1', 'Lv.15'];
        }
      }
    });
  }
});

fs.writeFileSync(jaSkillsFile, JSON.stringify(ja, null, 2));
console.log('Fixed arrow parsing using file script.');
