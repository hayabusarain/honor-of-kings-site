const fs = require('fs');

// Modify heroes/page.tsx
const pageFile = 'src/app/[locale]/heroes/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');
content = content.replace(/name: string;/, 'name: string;\n  name_en?: string;');
content = content.replace(/name: hero\.name,/, "name: locale === 'en' && hero.name_en ? hero.name_en : hero.name,\n        name_en: hero.name_en,");
fs.writeFileSync(pageFile, content);

// Modify heroes/[id]/page.tsx
const detailFile = 'src/app/[locale]/heroes/[id]/page.tsx';
let detailContent = fs.readFileSync(detailFile, 'utf8');
detailContent = detailContent.replace(
  /name: hokMatched \? hokMatched\.name : fallbackName,/,
  "name: hokMatched ? (locale === 'en' && hokMatched.name_en ? hokMatched.name_en : hokMatched.name) : fallbackName,"
);
fs.writeFileSync(detailFile, detailContent);

console.log('Modifications complete');
