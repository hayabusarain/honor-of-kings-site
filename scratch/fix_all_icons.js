const fs = require('fs');

const html = fs.readFileSync('C:\\\\Users\\\\81901\\\\Desktop\\\\HOK CAMP.html', 'utf8');
const regex = /<img src=\"\.\/HOK CAMP_files\/([^\"]+)\"[^>]*><div class=\"hero-intro\"><div class=\"hero-intro-name\">([^<]+)<\/div>/g;

let match;
const nameToImg = {};
while ((match = regex.exec(html)) !== null) {
  let img = match[1];
  let name = match[2].trim();
  nameToImg[name] = img;
}

const hokPath = require('path').resolve(__dirname, '../src/data/hok_heroes.json');
const hok = require(hokPath);

let copied = 0;
let missing = [];

hok.forEach(hero => {
  const campImg = nameToImg[hero.name];
  if (campImg) {
    const srcPath = 'C:\\\\Users\\\\81901\\\\Desktop\\\\HOK CAMP_files\\\\' + campImg;
    const destPath = require('path').resolve(__dirname, '../public/images/heroes/' + hero.id + '.jpg');
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      copied++;
    } else {
      console.log('Source file missing:', srcPath);
    }
  } else {
    missing.push(hero.name);
  }
});

console.log('Successfully copied icons for', copied, 'heroes.');
if (missing.length > 0) {
  console.log('Missing from CAMP html:', missing.join(', '));
}
