const fs = require('fs');
const https = require('https');
const hok = require('../src/data/hok_heroes.json');

const mapping = JSON.parse(fs.readFileSync('scratch/jp_to_eng.json', 'utf8'));
let html = fs.readFileSync('scratch/liquipedia_heroes.html', 'utf8');

// Use the precise structure where img is immediately inside the a tag
const regex = /<a href=\"\/honorofkings\/([^\"]+)\"[^>]*title=\"[^\"]+\"[^>]*>\\s*<img[^>]+src=\"([^\"]+)\"/gs;
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
  if (!engToUrl[name]) engToUrl[name] = url;
}

// Check Daji
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
