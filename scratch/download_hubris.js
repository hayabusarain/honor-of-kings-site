const fs = require('fs');
const https = require('https');
const path = require('path');

async function download(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  const dest = 'public/images/runes/hubris.png';
  const url = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/6697.png';
  try {
    console.log(`Downloading Hubris item icon: ${url} -> ${dest}...`);
    await download(url, dest);
    console.log("Success!");
  } catch (e) {
    console.error("Failed:", e.message);
  }
}

main();
