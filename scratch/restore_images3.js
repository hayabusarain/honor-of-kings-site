const fs = require('fs');

const hokCurrent = JSON.parse(fs.readFileSync('src/data/hok_heroes.json', 'utf8'));
const hokBak = JSON.parse(fs.readFileSync('src/data/hok_heroes.json.bak', 'utf8'));
const raw = JSON.parse(fs.readFileSync('src/data/hok_heroes_raw.json', 'utf8'));

const cnameToEname = {};
raw.forEach(h => {
  cnameToEname[h.cname] = h.ename;
});

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
  
  // Some manual fallbacks if nameCn didn't map perfectly
  if (!trueId) {
    if (cname === 'å≥ó¨îVéq') trueId = 538;
    if (cname === 'ùfïÅ?') trueId = 114;
    // Actually we can just use the mapping from build_mapping.py which we ALREADY ran successfully earlier!
  }
  
  if (trueId) {
    const src = 'public/images/heroes/' + trueId + '.jpg';
    const dest = 'public/images/heroes/' + h.id + '.jpg';
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      restored++;
    }
  }
});

// Manual
try { fs.copyFileSync('public/images/heroes/128.jpg', 'public/images/heroes/hero_029.jpg'); } catch(e){}

console.log('Restored', restored, 'images from backups using nameCn');
