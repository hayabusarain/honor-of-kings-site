const fs = require('fs');
const https = require('https');
const path = require('path');

// Helper to download with redirect follow
async function download(url, filePath) {
  return new Promise((resolve, reject) => {
    function get(url) {
      https.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          get(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Status ${res.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', reject);
    }
    get(url);
  });
}

// Clean name to search for files on wildriftfire
function getKebabCase(name) {
  return name.toLowerCase()
    .replace(/:/g, '')
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-');
}

function getSnakeCase(name) {
  return name.toLowerCase()
    .replace(/:/g, '')
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '_');
}

async function main() {
  const runesPath = 'src/data/runes.json';
  const runes = JSON.parse(fs.readFileSync(runesPath, 'utf8'));
  const targetDir = 'public/images/runes';

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`Analyzing ${runes.length} runes to download official High-Res icons...`);

  for (const rune of runes) {
    const filename = path.basename(rune.image);
    const dest = path.join(targetDir, filename);
    
    // We will try several potential URL locations on WildRiftFire or DDragon
    const baseName = rune.nameEn;
    const kebab = getKebabCase(baseName);
    const snake = getSnakeCase(baseName);
    
    const urls = [];
    
    // 1. WildRiftFire Runes with kebab-case
    urls.push(`https://www.wildriftfire.com/images/runes/${kebab}.png`);
    // 2. WildRiftFire Runes with snake_case
    urls.push(`https://www.wildriftfire.com/images/runes/${snake}.png`);
    // 3. Special cases (e.g. Items folder on WRFire)
    if (rune.id === 'hubris') {
      urls.push(`https://www.wildriftfire.com/images/items/hubris.png`);
    }
    if (rune.id === 'ixtali_seedjar') {
      urls.push(`https://www.wildriftfire.com/images/items/ixtali-seedjar.png`);
    }
    // 4. Glacial Augment special case
    if (rune.id === 'ice_overlord') {
      urls.push(`https://www.wildriftfire.com/images/runes/glacial-augment.png`);
    }
    // 5. Unflinching for Unshakeable
    if (rune.id === 'unshakeable') {
      urls.push(`https://www.wildriftfire.com/images/runes/unflinching.png`);
    }
    
    // 6. DDragon Fallbacks
    const ddragonBase = 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles';
    if (rune.tree === 'Sorcery') {
      urls.push(`${ddragonBase}/Sorcery/${baseName.replace(/\s+/g, '')}/${baseName.replace(/\s+/g, '')}.png`);
    } else if (rune.tree === 'Precision') {
      urls.push(`${ddragonBase}/Precision/${baseName.replace(/\s+/g, '')}/${baseName.replace(/\s+/g, '')}.png`);
    } else if (rune.tree === 'Domination') {
      urls.push(`${ddragonBase}/Domination/${baseName.replace(/\s+/g, '')}/${baseName.replace(/\s+/g, '')}.png`);
    } else if (rune.tree === 'Resolve') {
      urls.push(`${ddragonBase}/Resolve/${baseName.replace(/\s+/g, '')}/${baseName.replace(/\s+/g, '')}.png`);
    } else if (rune.tree === 'Inspiration') {
      urls.push(`${ddragonBase}/Inspiration/${baseName.replace(/\s+/g, '')}/${baseName.replace(/\s+/g, '')}.png`);
    }

    // Try downloading
    let success = false;
    for (const url of urls) {
      try {
        await download(url, dest);
        console.log(`Success [${rune.id}]: Downloaded ${url} -> ${dest}`);
        success = true;
        break;
      } catch (e) {
        // Try next URL
      }
    }

    if (!success) {
      console.error(`Failed [${rune.id}]: Could not download icon for ${baseName} (Tried ${urls.length} URLs)`);
    }
  }

  console.log("Completed download of high-resolution icons!");
}

main();
