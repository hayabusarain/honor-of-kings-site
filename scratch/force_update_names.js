const fs = require('fs');

const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');
const regex = /<img src=\"\.\/HOK CAMP_files\/([^"]+)\"[^>]*>.*?<div class=\"hero-intro-name\">([^<]+)<\/div>/g;
let match;
const nameToFilename = {};
const filenameToName = {};

while ((match = regex.exec(html)) !== null) {
  const filename = match[1];
  const name = match[2].trim();
  nameToFilename[name] = filename;
  filenameToName[filename] = name;
}

const hokPath = '../src/data/hok_heroes.json';
const hok = require(hokPath);

const jaPath = '../public/data/skills/ja.json';
const ja = require(jaPath);

let uH = 0, uJ = 0;

hok.forEach(h => {
  let baseName = h.name.split('（')[0].trim();
  
  let searchName = baseName;
  if (baseName === 'カルラ') searchName = '伽羅';
  if (baseName === '裴擒虎') searchName = 'タイガー';
  if (baseName === '狂鉄') searchName = 'バイロン';
  if (baseName === 'ファーティフ') searchName = '曹操';
  if (baseName === 'アレッシオ') searchName = '莱西奥';
  if (baseName === 'ラブール') searchName = 'ラプール';
  if (baseName === '鍾馗') searchName = '鐘馗';
  if (baseName === '蒙?') searchName = '蒙牙';

  const filename = nameToFilename[searchName] || nameToFilename[baseName];
  if (filename && filenameToName[filename]) {
    const htmlName = filenameToName[filename];
    
    if (h.name !== htmlName) {
      console.log('HOK Update:', h.name, '->', htmlName);
      h.name = htmlName;
      uH++;
    }
    if (ja[h.id] && ja[h.id].hero_name !== htmlName) {
      console.log('JA Update:', ja[h.id].hero_name, '->', htmlName);
      ja[h.id].hero_name = htmlName;
      uJ++;
    }
  }
});

fs.writeFileSync('src/data/hok_heroes.json', JSON.stringify(hok, null, 2));
fs.writeFileSync('public/data/skills/ja.json', JSON.stringify(ja, null, 2));

console.log('Done:', uH, uJ);
