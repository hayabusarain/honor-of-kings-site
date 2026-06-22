const fs = require('fs');
let html = fs.readFileSync('C:\\\\Users\\\\81901\\\\Desktop\\\\HOK CAMP.html', 'utf8');

const regex = /<img src=\"\.\/HOK CAMP_files\/([^\"]+)\"[^>]*><div class=\"hero-intro\"><div class=\"hero-intro-name\">([^<]+)<\/div>/g;
let match;
const nameToImg = {};
while ((match = regex.exec(html)) !== null) {
  let img = match[1];
  let name = match[2];
  nameToImg[name] = img;
}
console.log('Found heroes in CAMP:', Object.keys(nameToImg).length);
console.log('Fuzi (ファーティフ) image:', nameToImg['ファーティフ']);
console.log('Ata (アタ) image:', nameToImg['アタ']);
console.log('Butterfly (バタフライ) image:', nameToImg['バタフライ']);
