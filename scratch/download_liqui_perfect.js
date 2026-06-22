const fs = require('fs');
const https = require('https');
const hok = require('../src/data/hok_heroes.json');

const mapping = JSON.parse(fs.readFileSync('scratch/jp_to_eng.json', 'utf8'));
let html = fs.readFileSync('scratch/liquipedia_heroes.html', 'utf8');

const engToUrl = {};
const parts = html.split('<a href=\"/honorofkings/');
for (let i = 1; i < parts.length; i++) {
  let p = parts[i];
  let nameMatch = p.match(/^([^\"]+)\"/);
  if (!nameMatch) continue;
  let name = decodeURIComponent(nameMatch[1]).replace(/_/g, ' ').replace(' (Honor of Kings)', '');
  if (name.includes('Special:')) continue;
  
  // check if there is an image right after it
  // Usually it looks like: Daji" title="Daji"><img alt="Daji" src="/commons/...
  let imgMatch = p.match(/^[^<]*<img[^>]+src=\"([^\"]+)\"/);
  if (imgMatch) {
    let url = imgMatch[1];
    if (url.includes('/thumb/')) {
      url = url.replace('/thumb', '');
      url = url.substring(0, url.lastIndexOf('/'));
    }
    if (!url.startsWith('http')) url = 'https://liquipedia.net' + url;
    if (!engToUrl[name]) engToUrl[name] = url;
  }
}

console.log('Parsed valid image pairs:', Object.keys(engToUrl).length);
console.log('Daji URL:', engToUrl['Daji']);

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error('Failed to get ' + url + ' Status: ' + res.statusCode));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', reject);
  });
}

async function run() {
  let success = 0;
  let fail = 0;
  for (let h of hok) {
    let engName = mapping[h.name];
    let url = engToUrl[engName];
    if (!url) {
      console.log('No URL for', engName, '(', h.name, ')');
      fail++;
      continue;
    }
    const dest = 'public/images/heroes/' + h.id + '.jpg';
    try {
      await download(url, dest);
      success++;
    } catch(e) {
      console.log('Error downloading', url, e.message);
      fail++;
    }
  }
  console.log('Done downloading. Success:', success, 'Fail:', fail);
}

run();
