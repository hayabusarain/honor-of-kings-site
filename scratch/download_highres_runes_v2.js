const fs = require('fs');
const https = require('https');
const path = require('path');

// Helper to download with redirect follow and browser headers
async function download(url, filePath) {
  return new Promise((resolve, reject) => {
    function get(currentUrl) {
      try {
        const parsedUrl = new URL(currentUrl);
        const options = {
          hostname: parsedUrl.hostname,
          path: parsedUrl.pathname + parsedUrl.search,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.wildriftfire.com/'
          }
        };

        https.get(options, (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            if (res.headers.location) {
              get(res.headers.location);
            } else {
              reject(new Error("Redirect location missing"));
            }
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
      } catch (err) {
        reject(err);
      }
    }
    get(url);
  });
}

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
  if (!fs.existsSync(runesPath)) {
    console.error("Runes database file not found!");
    return;
  }
  
  const runes = JSON.parse(fs.readFileSync(runesPath, 'utf8'));
  const targetDir = 'public/images/runes';

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`Starting V2 download of high-resolution icons for ${runes.length} runes...`);

  let successCount = 0;
  let failedCount = 0;

  for (const rune of runes) {
    const filename = path.basename(rune.image);
    const dest = path.join(targetDir, filename);
    
    const baseName = rune.nameEn;
    const kebab = getKebabCase(baseName);
    const snake = getSnakeCase(baseName);
    
    // Generate potential URLs to try, in order of priority
    const urls = [];
    
    // 1. WildRiftFire (try both .webp and .png)
    urls.push(`https://www.wildriftfire.com/images/runes/${kebab}.webp`);
    urls.push(`https://www.wildriftfire.com/images/runes/${kebab}.png`);
    urls.push(`https://www.wildriftfire.com/images/runes/${snake}.webp`);
    urls.push(`https://www.wildriftfire.com/images/runes/${snake}.png`);
    
    // 2. Specific overrides
    if (rune.id === 'hubris') {
      urls.push(`https://www.wildriftfire.com/images/items/hubris.webp`);
      urls.push(`https://www.wildriftfire.com/images/items/hubris.png`);
    }
    if (rune.id === 'ixtali_seedjar') {
      urls.push(`https://www.wildriftfire.com/images/items/ixtali-seedjar.webp`);
      urls.push(`https://www.wildriftfire.com/images/items/ixtali-seedjar.png`);
    }
    if (rune.id === 'ice_overlord') {
      urls.push(`https://www.wildriftfire.com/images/runes/glacial-augment.webp`);
      urls.push(`https://www.wildriftfire.com/images/runes/glacial-augment.png`);
    }
    if (rune.id === 'unshakeable') {
      urls.push(`https://www.wildriftfire.com/images/runes/unflinching.webp`);
      urls.push(`https://www.wildriftfire.com/images/runes/unflinching.png`);
    }
    if (rune.id === 'courage_of_the_colossus') {
      // The PC version of Courage of the Colossus is VeteranAftershock
      urls.push(`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png`);
    }

    // 3. DDragon base URLs (PC LoL official High-Res)
    const ddragonCleanName = baseName.replace(/\s+/g, '').replace(/:/g, '').replace(/'/g, '');
    const ddragonBase = 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles';
    
    if (rune.tree === 'Sorcery') {
      urls.push(`${ddragonBase}/Sorcery/${ddragonCleanName}/${ddragonCleanName}.png`);
    } else if (rune.tree === 'Precision') {
      // Special check for Lethal Tempo (LethalTempoTemp in DDragon)
      if (ddragonCleanName === 'LethalTempo') {
        urls.push(`${ddragonBase}/Precision/LethalTempo/LethalTempoTemp.png`);
      }
      urls.push(`${ddragonBase}/Precision/${ddragonCleanName}/${ddragonCleanName}.png`);
    } else if (rune.tree === 'Domination') {
      urls.push(`${ddragonBase}/Domination/${ddragonCleanName}/${ddragonCleanName}.png`);
    } else if (rune.tree === 'Resolve') {
      urls.push(`${ddragonBase}/Resolve/${ddragonCleanName}/${ddragonCleanName}.png`);
    } else if (rune.tree === 'Inspiration') {
      urls.push(`${ddragonBase}/Inspiration/${ddragonCleanName}/${ddragonCleanName}.png`);
    }

    // 4. LoL Wiki / Fandom image URLs (Wiki has transparent renders)
    // We construct typical Wiki filenames
    const wikiCleanName = baseName.replace(/\s+/g, '_');
    const wikiUrls = [
      `https://static.wikia.nocookie.net/leagueoflegends/images/a/ab/${wikiCleanName}_rune.png/revision/latest`,
      `https://static.wikia.nocookie.net/leagueoflegends/images/a/ab/${wikiCleanName}.png/revision/latest`,
      `https://static.wikia.nocookie.net/leagueoflegends/images/a/ab/${wikiCleanName}_%28Wild_Rift%29_rune.png/revision/latest`
    ];
    urls.push(...wikiUrls);

    // Try downloading sequentially until one succeeds
    let success = false;
    for (const url of urls) {
      try {
        await download(url, dest);
        console.log(`[OK] ${rune.id} -> downloaded from ${url}`);
        success = true;
        successCount++;
        break;
      } catch (err) {
        // Try next URL
      }
    }

    if (!success) {
      console.error(`[ERROR] ${rune.id} (nameEn: "${baseName}"): FAILED after trying all URLs!`);
      failedCount++;
    }
  }

  console.log(`\nDownload V2 Finished!`);
  console.log(`Successful downloads: ${successCount}`);
  console.log(`Failed downloads: ${failedCount}`);
}

main();
