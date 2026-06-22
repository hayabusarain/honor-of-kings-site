const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = 'C:/Users/81901/Desktop/オナーオブキングスサイト/public/images/skills';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        resolve(false);
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', () => resolve(false));
  });
}

async function scrapeHero(heroIdStr, tencentId) {
  console.log(`Scraping icons for ${heroIdStr} (Tencent ID: ${tencentId})...`);
  
  // Try suffixes 00 to 99
  for (let i = 0; i < 100; i++) {
    const suffix = i.toString().padStart(2, '0');
    const url = `https://game.gtimg.cn/images/yxzj/img201606/heroimg/${tencentId}/${tencentId}${suffix}.png`;
    const destName = `${heroIdStr}_${suffix}.png`;
    const destPath = path.join(outDir, destName);
    
    const success = await download(url, destPath);
    if (success) {
      console.log(`Downloaded: ${url} -> ${destName}`);
    }
  }
}

async function main() {
  await scrapeHero('hero_047', '154'); // Mulan
  console.log('Done.');
}

main();
