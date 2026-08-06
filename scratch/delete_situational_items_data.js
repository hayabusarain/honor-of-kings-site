const fs = require('fs');

['./public/data/skills/ja.json', './public/data/skills/en.json'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let count = 0;
    for (const heroId in data) {
      if (data[heroId] && data[heroId].meta && data[heroId].meta.situational_items) {
        delete data[heroId].meta.situational_items;
        count++;
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Deleted situational_items from ${count} heroes in ${filePath}`);
  }
});
