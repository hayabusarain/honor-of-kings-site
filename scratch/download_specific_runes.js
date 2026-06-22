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
  const targetDir = 'public/images/runes';
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const downloads = [
    {
      url: 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Unflinching/Unflinching.png',
      file: 'unshakeable.png'
    },
    {
      url: 'https://static.wikia.nocookie.net/leagueoflegends/images/b/b9/Future%27s_Market_%28Wild_Rift%29_rune.png/revision/latest',
      file: 'futures_market.png'
    }
  ];

  for (const item of downloads) {
    const dest = path.join(targetDir, item.file);
    try {
      console.log(`Downloading ${item.url} -> ${dest}...`);
      await download(item.url, dest);
      console.log(`Success: ${item.file}`);
    } catch (e) {
      console.error(`Failed to download ${item.file}: ${e.message}`);
    }
  }
}

main();
