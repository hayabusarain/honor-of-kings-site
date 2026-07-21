const fs = require('fs');
const path = require('path');
const https = require('https');

const HEROES_URL = 'https://www.honorofkings.com/data/heroes.json?v=' + Date.now();
const LOCAL_JSON_PATH = path.join(__dirname, '../src/data/hok_heroes.json');

async function fetchJson(url) {
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
  console.log('Fetching official heroes list...');
  let officialHeroes;
  try {
    officialHeroes = await fetchJson(HEROES_URL);
  } catch(e) {
    console.error('Failed to fetch official heroes:', e);
    process.exit(1);
  }

  let localHeroes = [];
  if (fs.existsSync(LOCAL_JSON_PATH)) {
    localHeroes = JSON.parse(fs.readFileSync(LOCAL_JSON_PATH, 'utf8'));
  }

  let added = 0;
  for (const h of officialHeroes) {
    const heroId = h.HeroId.toString();
    const enName = h.EN || h.CnName;
    const jpName = h.JP || enName;
    
    // Check if hero already exists in the array
    const exists = localHeroes.find(x => x.id === heroId || x.id === `hero_${heroId}` || x.name_en === enName || x.name === jpName);
    if (!exists) {
      localHeroes.push({
        id: `hero_${heroId}`, // Prefix with hero_ to keep format consistent if preferred, or just heroId
        name: jpName,
        role: h['Job-EN'] ? [h['Job-EN'].charAt(0).toUpperCase() + h['Job-EN'].slice(1)] : [],
        image: `/images/heroes/${heroId}.jpg`,
        title: "称号未設定",
        search_alias: "",
        title_alias: "",
        name_en: enName,
        slug: enName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
      added++;
      console.log(`New Hero Found: ${enName} (${jpName})`);
    }
  }

  fs.writeFileSync(LOCAL_JSON_PATH, JSON.stringify(localHeroes, null, 2));
  console.log(`Sync Complete. Added ${added} new heroes.`);
}

main();
