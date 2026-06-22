const fs = require('fs');
const hok = require('../src/data/hok_heroes.json');

const manual = {
  '阿軻': '116',
  'ファーティフ': '128',
  'ラプール': '114',
  'チーシャ': '113',
  '鐘馗': '175',
  '雲中君': '506',
  '蒙牙': '524'
};

let count = 0;
hok.forEach(h => {
  if (manual[h.name]) {
    const src = 'public/images/heroes/' + manual[h.name] + '.jpg';
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, 'public/images/heroes/' + h.id + '.jpg');
      count++;
      console.log('Restored', h.name);
    }
  }
});
console.log('Manual restore:', count);

// Butterfly
fetch('https://liquipedia.net/commons/images/9/92/Butterfly_Default_Skin.jpg')
  .then(r=>r.arrayBuffer())
  .then(b=>{
    fs.writeFileSync('public/images/heroes/hero_112.jpg', Buffer.from(b));
    console.log('Restored Butterfly');
  });
