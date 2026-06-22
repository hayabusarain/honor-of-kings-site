const fs = require('fs');

const jaSkillsFile = './public/data/skills/ja.json';
const jaSkills = JSON.parse(fs.readFileSync(jaSkillsFile, 'utf8'));
const lixinId = 'hero_092';

// 1. Load the extracted data for Li Xin
const data = JSON.parse(fs.readFileSync('./data_processing/extracted_skills/李信.json', 'utf8'));

// The 10 skills map to:
// 0: Passive (Initial)
// 1: Skill1 (Initial)
// 2: Skill2 (Initial)
// 3: Skill3 (Initial)
// 4: Skill4 (Initial)
// 5: Passive (Dark)
// 6: Skill1 (Dark)
// 7: Skill2 (Dark)
// 8: Skill3 (Dark)
// 9: Skill4 (Dark)

function parseTable(desc) {
  const match = desc.match(/\n\n([\s\S]+)$/);
  if (!match) return { desc: desc, table: null };
  
  const lines = match[1].split('\n');
  const rows = [];
  let numColumns = 0;
  
  // Check if there's a (Lv.1 / Lv.15) header in the text
  let hasLv15 = desc.includes('(Lv.1 / Lv.15)');
  
  for (const line of lines) {
    const sep = line.indexOf(':');
    if (sep !== -1) {
      const label = line.substring(0, sep).trim();
      let valuesStr = line.substring(sep + 1).trim();
      // Remove the (Lv.1 / Lv.15) part from the value string if it exists
      valuesStr = valuesStr.replace(/\(Lv\.1 \/ Lv\.15\)/g, '').trim();
      
      const values = valuesStr.split(/\s*(?:\/|→|->|~|-)\s*/).map(v => v.trim());
      if (values.length > numColumns) numColumns = values.length;
      rows.push({ label, values });
    }
  }
  
  if (rows.length === 0) return { desc: desc, table: null };
  
  const headers = [];
  if (hasLv15 || numColumns === 2) {
    headers.push('Lv.1', 'Lv.15');
  } else {
    for (let i = 1; i <= numColumns; i++) headers.push(`Lv.${i}`);
  }
  
  return {
    desc: desc.substring(0, match.index).trim(),
    table: { headers, rows }
  };
}

const skills = data.skills.map(s => {
  const parsed = parseTable(s.description);
  return {
    name: s.name,
    description: parsed.desc,
    table: parsed.table
  };
});

jaSkills[lixinId].passive = {
  forms: [
    { form_name: "初期形態", name: skills[0].name, description: skills[0].description, table: skills[0].table },
    { form_name: "復讐形態（闇）", name: skills[5].name, description: skills[5].description, table: skills[5].table }
  ]
};

jaSkills[lixinId].skill1 = {
  forms: [
    { form_name: "初期形態", name: skills[1].name, description: skills[1].description, table: skills[1].table },
    { form_name: "復讐形態（闇）", name: skills[6].name, description: skills[6].description, table: skills[6].table }
  ]
};

jaSkills[lixinId].skill2 = {
  forms: [
    { form_name: "初期形態", name: skills[2].name, description: skills[2].description, table: skills[2].table },
    { form_name: "復讐形態（闇）", name: skills[7].name, description: skills[7].description, table: skills[7].table }
  ]
};

jaSkills[lixinId].skill3 = {
  forms: [
    { form_name: "初期形態", name: skills[3].name, description: skills[3].description, table: skills[3].table },
    { form_name: "復讐形態（闇）", name: skills[8].name, description: skills[8].description, table: skills[8].table }
  ]
};

jaSkills[lixinId].skill4 = {
  forms: [
    { form_name: "初期形態", name: skills[4].name, description: skills[4].description, table: skills[4].table },
    { form_name: "復讐形態（闇）", name: skills[9].name, description: skills[9].description, table: skills[9].table }
  ]
};

fs.writeFileSync(jaSkillsFile, JSON.stringify(jaSkills, null, 2));
console.log('Li Xin forms successfully rebuilt!');
