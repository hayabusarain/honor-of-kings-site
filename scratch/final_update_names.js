const fs = require('fs');

const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');
const regex = /<img src=\"\.\/HOK CAMP_files\/([^"]+)\"[^>]*>.*?<div class=\"hero-intro-name\">([^<]+)<\/div>/g;
var match;
const nameToFilename = {};
const filenameToName = {};

while ((match = regex.exec(html)) !== null) {
  const filename = match[1];
  const name = match[2].trim();
  nameToFilename[name] = filename;
  filenameToName[filename] = name;
}

const hok = require('../src/data/hok_heroes.json');
const ja = require('../public/data/skills/ja.json');

var updatedH = 0;
var updatedJ = 0;

hok.forEach(h => {
  var baseName = h.name.split('（')[0].trim();
  
  var searchName = baseName;
  if (baseName === 'カルラ') searchName = '伽羅';
  if (baseName === '裴擒虎') searchName = 'タイガー';
  if (baseName === '狂鉄') searchName = 'バイロン';
  if (baseName === 'ファーティフ') searchName = '曹操'; // Wait, in HTML it is 'ファーティフ' maybe?
  if (baseName === 'アレッシオ') searchName = '莱西奥'; // Or 'アレッシオ'?
  if (baseName === 'ラブール') searchName = 'ラプール';
  if (baseName === '鍾馗') searchName = '鐘馗';
  if (baseName === '蒙?') searchName = '蒙牙';

  // Some names in HTML might already be global names
  if (!nameToFilename[searchName] && nameToFilename[baseName]) searchName = baseName;

  const filename = nameToFilename[searchName];
  if (filename) {
    const htmlName = filenameToName[filename];
    if (h.name !== htmlName) {
      console.log('Update hok:', h.name, '->', htmlName);
      h.name = htmlName;
      updatedH++;
    }
    if (ja[h.id] && ja[h.id].hero_name !== htmlName) {
      ja[h.id].hero_name = htmlName;
      updatedJ++;
    }
  } else {
    // try to just use htmlNamesByImage by matching their old English ID if we had a mapping?
    // No, we can just use our extractedImages from before.
  }
});

fs.writeFileSync('src/data/hok_heroes.json', JSON.stringify(hok, null, 2));
fs.writeFileSync('public/data/skills/ja.json', JSON.stringify(ja, null, 2));

console.log('Final Update:', updatedH, updatedJ);
