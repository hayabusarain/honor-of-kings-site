const fs = require('fs');
const path = require('path');

const cropDir = path.join(__dirname, '../public/images/items/cropped');
const files = fs.readdirSync(cropDir);
console.log(`Total files: ${files.length}`);
files.slice(0, 30).forEach(f => {
  console.log(f);
});
