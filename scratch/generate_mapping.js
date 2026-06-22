const fs = require('fs');
const hok = require('../src/data/hok_heroes.json');
const html = fs.readFileSync('scratch/liquipedia_heroes.html', 'utf8');

const regex = /<a href=\"\/honorofkings\/([^\"]+)\"[^>]*title=\"[^\"]+\"[^>]*>.*?<img[^>]+src=\"([^\"]+)\"/gs;
let match;
const urlToName = {};
while ((match = regex.exec(html)) !== null) {
  let name = decodeURIComponent(match[1]).replace(/_/g, ' ').replace(' (Honor of Kings)', '');
  if (name.includes('Special:')) continue;
  let url = match[2];
  if (url.includes('/thumb/')) {
    url = url.replace('/thumb', '');
    url = url.substring(0, url.lastIndexOf('/'));
  }
  if (!url.startsWith('http')) url = 'https://liquipedia.net' + url;
  urlToName[name] = url;
}

const engNames = Object.keys(urlToName);
fs.writeFileSync('scratch/eng_names.json', JSON.stringify(engNames, null, 2));
const jpNames = hok.map(h => ({id: h.id, name: h.name}));
fs.writeFileSync('scratch/jp_names.json', JSON.stringify(jpNames, null, 2));

console.log('Saved eng_names.json (', engNames.length, ') and jp_names.json (', jpNames.length, ')');
