const fs = require('fs');

const hokBak = JSON.parse(fs.readFileSync('src/data/hok_heroes.json.bak', 'utf8'));

// map nameJaOfficial to numeric ID
const nameToId = {};
hokBak.forEach(h => {
  if (h.nameJaOfficial) {
    let base = h.nameJaOfficial.split(' ')[0].trim();
    nameToId[base] = h.id;
  }
});

const hokCurrent = JSON.parse(fs.readFileSync('src/data/hok_heroes.json', 'utf8'));

// some fallbacks if names changed to html names
const aliases = {
  'タイガー': '裴擒虎',
  'バイロン': '狂鉄',
  'ラプール': '達磨',
  '鐘馗': '鍾馗',
  '蒙牙': '蒙?',
  '曹操': '曹操',
  '莱西奥': '莱西奥',
  '伽羅': 'カルラ' // wait, bak probably has カルラ
};

let restored = 0;
hokCurrent.forEach(h => {
  let searchName = h.name;
  if (aliases[h.name]) searchName = aliases[h.name];
  
  let numericId = nameToId[searchName];
  
  if (!numericId) {
    // try exact match against hokBak.nameJa
    let matched = hokBak.find(b => b.nameJaOfficial && b.nameJaOfficial.includes(searchName));
    if (matched) numericId = matched.id;
  }
  
  if (numericId) {
    const src = 'public/images/heroes/' + numericId + '.jpg';
    const dest = 'public/images/heroes/' + h.id + '.jpg';
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      restored++;
    }
  } else {
    console.log('Could not find numeric ID for', h.name);
  }
});

try { fs.copyFileSync('public/images/heroes/128.jpg', 'public/images/heroes/hero_029.jpg'); restored++; } catch(e){}

console.log('Restored', restored, 'images!');
