const fs = require('fs');

const jaData = JSON.parse(fs.readFileSync('public/data/skills/ja.json', 'utf8'));
const enData = JSON.parse(fs.readFileSync('public/data/skills/en.json', 'utf8'));
const report = JSON.parse(fs.readFileSync('C:\\Users\\81901\\.gemini\\antigravity\\brain\\0d454db0-a090-4b63-ba9c-0cfb1c1f7927\\scratch\\hero_skills_audit_report.json', 'utf8'));

const extract = {};
for (const [id, issues] of Object.entries(report.issuesInEn)) {
  extract[id] = {};
  issues.forEach(issue => {
    // issue is like "strategy.lateGame contains Japanese" or "passive.cooldown is empty"
    const pathStr = issue.split(' ')[0];
    const pathKeys = pathStr.split('.').map(k => k.replace(/\[(\d+)\]/, '$1'));
    
    let jaVal = jaData[id];
    let enVal = enData[id];
    for (const key of pathKeys) {
      if (jaVal) jaVal = jaVal[key];
      if (enVal) enVal = enVal[key];
    }
    extract[id][pathStr] = { ja: jaVal, en: enVal };
  });
}
console.log(JSON.stringify(extract, null, 2));
