const fs = require('fs');
const path = require('path');

const jaSkillsFile = path.resolve('public/data/skills/ja.json');
const ja = JSON.parse(fs.readFileSync(jaSkillsFile, 'utf8'));

const patchedHeroes = ['hero_067', 'hero_083', 'hero_015', 'hero_087', 'hero_004', 'hero_037', 'hero_092', 'hero_082', 'hero_113'];

patchedHeroes.forEach(id => {
  if (!ja[id]) return;
  ['passive', 'skill1', 'skill2', 'skill3', 'skill4'].forEach(sk => {
    const skill = ja[id][sk];
    if (!skill || !skill.description) return;
    
    // Look for patterns like [Lv.1 - Lv.6] or [Lv.1 - Lv.15]
    // Followed by rows of data
    const match = skill.description.match(/\n*\[(Lv\.[^\]]+)\]\n([\s\S]+)$/);
    if (match) {
      const headerText = match[1];
      const rowsText = match[2];
      
      // Build headers
      // example: Lv.1 - Lv.6 -> ['Lv.1', 'Lv.2', 'Lv.3', 'Lv.4', 'Lv.5', 'Lv.6']
      // Some are just specific levels, but if the table had N values, the original usually just listed them.
      // Wait, we can just infer the headers from the number of values in the first row.
      
      const rows = [];
      const lines = rowsText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let numColumns = 0;
      
      for (const line of lines) {
        // e.g. "基本ダメージ: 115 / 138 / 161 / 184 / 207 / 230" or "基本ダメージ：115/138/..."
        const sepIndex = line.indexOf(':') !== -1 ? line.indexOf(':') : line.indexOf('：');
        if (sepIndex !== -1) {
          const label = line.substring(0, sepIndex).trim();
          const valuesStr = line.substring(sepIndex + 1).trim();
          // split by / or →
          let values = valuesStr.split(/\s*[\/→]\s*/).map(v => v.trim());
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
        // Create headers
        // Just generic Lv.1, Lv.2 ... based on number of columns
        // unless it's just 2 columns (e.g. Lv.1 -> Lv.15)
        const headers = [];
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
});

fs.writeFileSync(jaSkillsFile, JSON.stringify(ja, null, 2));
console.log('Tables parsed and extracted.');
