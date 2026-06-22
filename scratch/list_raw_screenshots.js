const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\81901\\Desktop\\ワイリフサイト\\public\\images\\items\\raw';
if (!fs.existsSync(dir)) {
  console.log('Directory does not exist:', dir);
  process.exit(0);
}

const files = fs.readdirSync(dir);
console.log(`Total files: ${files.length}`);
files.forEach((f, idx) => {
  console.log(`${idx + 1}: ${f}`);
});
