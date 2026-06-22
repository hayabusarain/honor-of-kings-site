const fs = require('fs');
const hok = require('../src/data/hok_heroes.json');
const mapping = JSON.parse(fs.readFileSync('jp_to_eng.json', 'utf8'));

let html = fs.readFileSync('liquipedia_heroes.html', 'utf8');
const regex = /<a href=\"\/honorofkings\/([^\"]+)\"[^>]*title=\"[^\"]+\"[^>]*>.*?<img[^>]+src=\"([^\"]+)\"/gs;
let match;
const engToUrl = {};
while ((match = regex.exec(html)) !== null) {
  let name = decodeURIComponent(match[1]).replace(/_/g, ' ').replace(' (Honor of Kings)', '');
  if (name.includes('Special:')) continue;
  let url = match[2];
  if (url.includes('/thumb/')) {
    url = url.replace('/thumb', '');
    url = url.substring(0, url.lastIndexOf('/'));
  }
  if (!url.startsWith('http')) url = 'https://liquipedia.net' + url;
  engToUrl[name] = url;
}

let count = 0;
hok.forEach((h, index) => {
  let eng = mapping[h.name];
  let url = engToUrl[eng];
  if (!url) {
    console.log(h.id, h.name, '-> missing URL. Mapped to:', eng);
    count++;
  } else {
    // Check if the URL filename looks related to the hero
    let filename = url.split('/').pop().toLowerCase();
    let engNameParts = eng.toLowerCase().split(' ');
    let matched = engNameParts.some(p => filename.includes(p));
    if (!matched && index < 20) {
      console.log('Suspicious mapping:', h.name, '->', eng, '-> URL:', url);
    }
  }
});
console.log('Missing URLs:', count);
