const fs = require('fs');

const jaSkillsFile = './public/data/skills/ja.json';
const jaSkills = JSON.parse(fs.readFileSync(jaSkillsFile, 'utf8'));
const devId = 'hero_113';

// Extracted text
const data = JSON.parse(fs.readFileSync('data_processing/extracted_skills/デーヴァラ.json', 'utf8'));

data.skills.forEach((s, idx) => {
  const sk = idx === 0 ? 'passive' : 'skill' + idx;
  if (!jaSkills[devId][sk]) jaSkills[devId][sk] = {};
  
  const desc = s.description;
  let cleanDesc = desc;
  let table = null;
  
  // Look for [レベルアップによる数値]
  const match = desc.match(/\n*\[レベルアップによる数値\]\n([\s\S]+)$/);
  if (match) {
    cleanDesc = desc.substring(0, match.index).trim();
    const rowsText = match[1];
    
    const lines = rowsText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const rows = [];
    let numCols = 0;
    
    lines.forEach(line => {
      const sep = line.indexOf(':');
      if (sep !== -1) {
        const label = line.substring(0, sep).trim();
        const valuesStr = line.substring(sep + 1).trim();
        const values = valuesStr.split(/\s*(?:\/|→|->|~|-)\s*/).map(v => v.trim());
        if (values.length > numCols) numCols = values.length;
        rows.push({ label, values });
      }
    });
    
    if (rows.length > 0) {
      const headers = [];
      for (let i = 1; i <= numCols; i++) headers.push(`Lv.${i}`);
      table = { headers, rows };
    }
  }
  
  jaSkills[devId][sk].name = s.name;
  jaSkills[devId][sk].description = cleanDesc;
  if (table) jaSkills[devId][sk].table = table;
});

fs.writeFileSync(jaSkillsFile, JSON.stringify(jaSkills, null, 2));
console.log('Devara forms successfully rebuilt!');
