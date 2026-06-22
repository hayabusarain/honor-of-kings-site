const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/TOP/g, 'CLASH');
  content = content.replace(/ADC/g, 'FARM');
  content = content.replace(/SUPPORT/g, 'ROAM');

  content = content.replace(/'top'/g, "'clash'");
  content = content.replace(/'adc'/g, "'farm'");
  content = content.replace(/'support'/g, "'roam'");

  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated Roles in ' + file);
  }
});
