const fs = require('fs');
const paths = ['public/data/skills/ja.json', 'public/data/all_skills.json'];

paths.forEach(p => {
  let content = fs.readFileSync(p, 'utf8');
  
  // Replace variations of level icons with (Lv)
  // Match: (◆), (♦), ◆, ♦, (レベル), (LV), (Lv), (体力)
  // First, normalize everything with parens
  content = content.replace(/\(◆\)/g, '(Lv)');
  content = content.replace(/\(♦\)/g, '(Lv)');
  content = content.replace(/◆/g, '(Lv)');
  content = content.replace(/♦/g, '(Lv)');
  content = content.replace(/\(レベル\)/g, '(Lv)');
  content = content.replace(/\(LV\)/g, '(Lv)');
  content = content.replace(/\(lv\)/g, '(Lv)');
  
  // Specific case for Alistar's incorrect OCR: "27(体力)" -> "27(Lv)"
  content = content.replace(/\(体力\)/g, '(Lv)');

  // Clean up any double parens like ((Lv)) just in case
  content = content.replace(/\(\(Lv\)\)/g, '(Lv)');

  fs.writeFileSync(p, content);
  console.log(`Standardized level icons in ${p}`);
});
