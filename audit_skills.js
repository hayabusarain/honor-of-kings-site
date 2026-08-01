const fs = require('fs');
const path = require('path');

const jaPath = path.join(__dirname, 'public/data/skills/ja.json');
const enPath = path.join(__dirname, 'public/data/skills/en.json');
const reportPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\0d454db0-a090-4b63-ba9c-0cfb1c1f7927\\scratch\\hero_skills_audit_report.json';

let jaData = {};
let enData = {};

try {
  jaData = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
  enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
} catch (e) {
  console.error("Failed to read JSON", e);
}

const jaKeys = Object.keys(jaData);
const enKeys = Object.keys(enData);

const missingInEn = jaKeys.filter(id => !enKeys.includes(id));

const issuesInEn = {};
const hasJapanese = (str) => /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(str);

function checkValues(obj, heroId, path = []) {
  if (typeof obj === 'string') {
    if (obj.trim() === '') {
      return [`${path.join('.')} is empty`];
    }
    if (obj.toLowerCase() === 'coming soon') {
      return [`${path.join('.')} is 'Coming Soon'`];
    }
    if (hasJapanese(obj)) {
      return [`${path.join('.')} contains Japanese`];
    }
    return [];
  } else if (Array.isArray(obj)) {
    let issues = [];
    obj.forEach((item, index) => {
      issues = issues.concat(checkValues(item, heroId, [...path, `[${index}]`]));
    });
    return issues;
  } else if (typeof obj === 'object' && obj !== null) {
    let issues = [];
    Object.keys(obj).forEach(key => {
      issues = issues.concat(checkValues(obj[key], heroId, [...path, key]));
    });
    return issues;
  }
  return [];
}

jaKeys.forEach(id => {
  if (enData[id]) {
    const issues = checkValues(enData[id], id);
    if (issues.length > 0) {
      issuesInEn[id] = issues;
    }
  } else {
    // missing in EN is handled
  }
});

const report = {
  totalJaHeroes: jaKeys.length,
  totalEnHeroes: enKeys.length,
  missingInEn,
  issuesInEn
};

const dir = path.dirname(reportPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
