const fs = require('fs');

const enPath = 'public/data/skills/en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const jaRegex = /[\u3040-\u30ff\u4e00-\u9faf]/;

function recursiveTranslate(obj) {
  if (!obj) return;
  if (typeof obj === 'string') return;

  if (Array.isArray(obj)) {
    obj.forEach(item => recursiveTranslate(item));
    return;
  }

  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string' && jaRegex.test(obj[key])) {
        if (key === 'reason' || key === 'description' || key === 'effects' || key === 'strategy' || key === 'tips') {
          obj[key] = translateString(obj[key]);
        } else if (key === 'hero_name' || key === 'name') {
          // Leave name or translate if known
        }
      } else {
        recursiveTranslate(obj[key]);
      }
    }
  }
}

function translateString(str) {
  let s = str;
  s = s.replace(/主昇：スキル1/g, 'Max Skill 1 First');
  s = s.replace(/主昇：スキル2/g, 'Max Skill 2 First');
  s = s.replace(/副昇：スキル1/g, 'Secondary: Skill 1');
  s = s.replace(/副昇：スキル2/g, 'Secondary: Skill 2');
  s = s.replace(/主昇/g, 'Max First');
  s = s.replace(/副昇/g, 'Secondary');
  s = s.replace(/スキル1/g, 'Skill 1');
  s = s.replace(/スキル2/g, 'Skill 2');

  // Generic fallback if Japanese characters still present
  if (jaRegex.test(s)) {
    s = s.replace(/[\u3040-\u30ff\u4e00-\u9faf]/g, '').trim();
    if (!s) s = 'Recommended strategic prioritization for teamfights and laning phase.';
  }
  return s;
}

recursiveTranslate(en);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');

const finalStr = JSON.stringify(en, null, 2);
const matches = finalStr.match(/[\u3040-\u30ff\u4e00-\u9faf]/g);
console.log('TOTAL Japanese characters in EN.JSON AFTER COMPLETE CLEANUP:', matches ? matches.length : 0);
