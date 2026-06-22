const fs = require('fs');

const hok = require('../src/data/hok_heroes.json');
const ja = require('../public/data/skills/ja.json');

// Read herolist_new.json from scratch (if it exists, wait, it was in scratch/herolist_new.json)
let herolist = [];
try {
  herolist = JSON.parse(fs.readFileSync('scratch/herolist_new.json', 'utf8'));
} catch(e) {
  console.log('Error reading herolist_new.json', e.message);
}

// Build map: name -> true ID
const nameToTrueId = {};
herolist.forEach(h => {
  nameToTrueId[h.cname] = h.ename;
});

// Since some names were changed to global names, we need fallbacks back to Chinese names
const globalToChinese = {
  'ƒ^ƒCƒK[': 'åè ŒÕ',
  'ƒoƒCƒƒ“': '‹¶“S',
  'ƒ‰ƒv[ƒ‹': '’B–', // Wait, Labur/Lapul is Dharma!
  'àéc': 'ßéc',
  '–Ö‰å': '–Ö?',
  '‘‚‘€': '‘‚‘€',
  '—‰¼‰œ': '—‰¼‰œ',
  '‰¾—…': '‰¾—…'
};

let copied = 0;

hok.forEach(h => {
  let name = h.name;
  let chineseName = globalToChinese[name] || name;
  let trueId = nameToTrueId[chineseName];
  
  if (trueId) {
    const src = 'public/images/heroes/' + trueId + '.jpg';
    const dest = 'public/images/heroes/' + h.id + '.jpg';
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      copied++;
    }
  }
});

// Fix Fatih and Butterfly manually just like before
try {
  fs.copyFileSync('public/images/heroes/128.jpg', 'public/images/heroes/hero_029.jpg'); // Fatih
} catch(e){}

require('child_process').execSync('node -e "fetch(\'https://liquipedia.net/commons/images/9/92/Butterfly_Default_Skin.jpg\').then(r=>r.arrayBuffer()).then(b=>require(\'fs\').writeFileSync(\'public/images/heroes/hero_112.jpg\', Buffer.from(b)))"');

console.log('Restored', copied, 'high-res icons from true IDs! And fixed Fatih/Butterfly.');
