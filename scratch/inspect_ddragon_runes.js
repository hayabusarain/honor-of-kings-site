const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    const versions = await fetchJson('https://ddragon.leagueoflegends.com/api/versions.json');
    const latestVersion = versions[0];
    console.log(`Latest DDragon version: ${latestVersion}`);
    
    const url = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/runesReforged.json`;
    console.log(`Fetching ${url}...`);
    const trees = await fetchJson(url);
    
    const runeMap = {};
    trees.forEach(tree => {
      tree.slots.forEach(slot => {
        slot.runes.forEach(rune => {
          runeMap[rune.name] = rune.icon;
          // Also map standard normalized name
          runeMap[rune.key] = rune.icon;
        });
      });
    });
    
    console.log('DDragon Runes Map:');
    console.log(JSON.stringify(runeMap, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

main();
