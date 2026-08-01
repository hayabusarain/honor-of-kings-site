const fs = require('fs');
const path = require('path');

const files = [
  'messages/en.json',
  'public/data/skills/en.json',
  'src/data/hok_items.json',
  'src/data/hok_arcanas.json'
];

const basePath = 'C:\\Users\\81901\\Desktop\\オナーオブキングスサイト';

const replacements = [
  { regex: /\bHeros\b/g, replacement: 'Heroes' },
  { regex: /\bheros\b/g, replacement: 'heroes' },
  { regex: /\bnormal attack\b/gi, replacement: 'Basic Attack' },
  { regex: /\bmagic attack power\b/gi, replacement: 'Magical Attack' },
  { regex: /\bmagic attack\b/gi, replacement: 'Magical Attack' },
  { regex: /\bphysical attack power\b/gi, replacement: 'Physical Attack' },
  { regex: /\badditional physical attack\b/gi, replacement: 'Extra Physical Attack' },
  { regex: /\badditional physical\b/gi, replacement: 'Extra Physical Attack' },
  { regex: /\badditional HP\b/gi, replacement: 'Extra HP' },
  { regex: /\bphysical defense penetration\b/gi, replacement: 'Physical Penetration' },
  { regex: /\bmagic defense penetration\b/gi, replacement: 'Magic Penetration' },
  { regex: /\bphysical defense\b/gi, replacement: 'Armor' },
  { regex: /\bmagic defense\b/gi, replacement: 'Magic Resist' },
  { regex: /\blife steal\b/gi, replacement: 'Lifesteal' },
  { regex: /\bcool down\b/gi, replacement: 'Cooldown' },
  { regex: /\bMP consumption\b/gi, replacement: 'Mana Cost' },
  { regex: /\bknock up\b/gi, replacement: 'Knockup' },
  { regex: /\bgroup battles\b/gi, replacement: 'teamfights' },
  { regex: /\bCD\s*:/g, replacement: 'Cooldown:' },
  { regex: /\bCD\b/g, replacement: 'Cooldown' },
  { regex: /\bMP\b/g, replacement: 'Mana' }
];

function replaceStrings(obj, report) {
  if (typeof obj === 'string') {
    let newStr = obj;
    replacements.forEach(({ regex, replacement }) => {
      if (regex.test(newStr)) {
        const matches = newStr.match(regex);
        report.changes += matches.length;
        newStr = newStr.replace(regex, replacement);
      }
    });
    return newStr;
  } else if (Array.isArray(obj)) {
    return obj.map(item => replaceStrings(item, report));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = replaceStrings(obj[key], report);
    }
    return newObj;
  }
  return obj;
}

const summary = {};
let totalChanges = 0;

for (const relPath of files) {
  const fullPath = path.join(basePath, relPath);
  if (!fs.existsSync(fullPath)) continue;
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const data = JSON.parse(content);
  
  const report = { changes: 0 };
  const newData = replaceStrings(data, report);
  
  fs.writeFileSync(fullPath, JSON.stringify(newData, null, 2), 'utf8');
  summary[relPath] = report.changes;
  totalChanges += report.changes;
}

const reportPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\68035aa4-479f-40f1-81b3-ea8d7417cb9e\\scratch\\english_quality_report.json';
const dir = path.dirname(reportPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(reportPath, JSON.stringify({ summary, totalChanges }, null, 2), 'utf8');
console.log('Update complete.');
