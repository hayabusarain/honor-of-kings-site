const fs = require('fs');

const hokCurrent = require('../src/data/hok_heroes.json');
const hokBak = require('../src/data/hok_heroes.json.bak');

let herolist = [];
try {
  herolist = JSON.parse(fs.readFileSync('scratch/herolist_new.json', 'utf8'));
} catch(e) {}

// map Chinese name to numeric ID
const cnameToEname = {};
herolist.forEach(h => {
  cnameToEname[h.cname] = h.ename;
});

// map hero_ID to Chinese name from .bak
const idToCname = {};
hokBak.forEach(h => {
  if (h.nameCn) {
    idToCname[h.id] = h.nameCn.split(' ')[0].trim();
  }
});

let restored = 0;

hokCurrent.forEach(h => {
  let cname = idToCname[h.id];
  let trueId = cnameToEname[cname];
  
  if (trueId) {
    const src = 'public/images/heroes/' + trueId + '.jpg';
    const dest = 'public/images/heroes/' + h.id + '.jpg';
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      restored++;
    }
  }
});

console.log('Restored', restored, 'images from backups using nameCn');
