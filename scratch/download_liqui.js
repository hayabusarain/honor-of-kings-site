const fs = require('fs');
const https = require('https');
const hok = require('../src/data/hok_heroes.json');

// We will read the mapping built by the subagent
let jpToEng = {};
try {
  jpToEng = JSON.parse(fs.readFileSync('scratch/jp_to_eng.json', 'utf8'));
} catch(e) {
  console.log('Mapping not found yet');
  process.exit(1);
}

// We will extract Liquipedia URLs again
const html = fs.readFileSync('scratch/liquipedia_heroes.html', 'utf8');
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
    let engName = jpToEng[h.name];
    if (!engName) {
      console.log('No mapping for', h.name);
      fail++;
      continue;
    }
    let url = engToUrl[engName];
    if (!url) {
      console.log('No URL for', engName);
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
