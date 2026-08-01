const fs = require('fs');

const reportPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\0d454db0-a090-4b63-ba9c-0cfb1c1f7927\\scratch\\hero_skills_audit_report.json';
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

report.fixesApplied = {
  "108": "Translated strategy.lateGame to English",
  "109": "Translated hero_name to 'Daji'",
  "117": "Translated meta.synergy.[0].hero_name to 'Daji'",
  "134": "Translated meta.synergy.[1].hero_name to 'Daji'",
  "135": "Translated meta.counters.[0].hero_name to 'Lan'",
  "140": "Translated meta.counters.[1].hero_name to 'Daji'",
  "172": "Translated meta.counters.[1].hero_name to 'Lan'",
  "174": "Filled missing passive, skill1, skill2, skill3 with complete accurate English descriptions (Consort Yu)",
  "175": "Filled missing passive, skill1, skill2, skill3 with complete accurate English descriptions (Zhong Kui)",
  "198": "Added missing header 'Lv.1'",
  "199": "Translated meta.counters.[1].hero_name to 'Daji'",
  "501": "Translated meta.counters.[1].hero_name to 'Daji'",
  "514": "Translated meta.synergy.[0].hero_name to 'Lan'",
  "528": "Translated hero_name to 'Lan'",
  "538": "Translated skill2.forms.[1].form_name to 'Resonance - 2 stacks: Eagerness - Castle Destruction'",
  "558": "Translated meta.counters.[1].hero_name to 'Daji'"
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
