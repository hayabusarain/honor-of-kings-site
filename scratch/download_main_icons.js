const https = require('https');
const fs = require('fs');
const path = require('path');

const jaPath = 'C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/ja.json';
const outDir = 'C:/Users/81901/Desktop/オナーオブキングスサイト/public/images/skills';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let jaData;
try {
  jaData = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
} catch(e) {
  console.error("Could not read ja.json");
  process.exit(1);
}

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

async function processAll() {
  const heroes = ['hero_069', 'hero_102', 'hero_083', 'hero_059', 'hero_047', 'hero_103', 'hero_110', 'hero_058', 'hero_095'];
  
  for (const heroId of heroes) {
    if (!jaData[heroId]) continue;
    
    for (const skillKey of ['passive', 'skill1', 'skill2', 'skill3', 'skill4']) {
      const skill = jaData[heroId][skillKey];
      if (!skill) continue;
      
      const url = skill.icon;
      if (url && url.startsWith('http')) {
        const destName = `${heroId}_${skillKey}.png`;
        const destPath = path.join(outDir, destName);
        
        console.log(`Downloading ${url} -> ${destName}...`);
        const success = await download(url, destPath);
        if (success) {
          skill.icon = `/images/skills/${destName}`;
        }
      }
    }
  }
  
  fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2), 'utf8');
  console.log("Done downloading main icons and updating ja.json");
}

processAll();
