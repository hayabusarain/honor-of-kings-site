const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const STATS_PATH = path.join(__dirname, '../src/data/hero_stats_camp.json');

async function main() {
  console.log('Launching Puppeteer to fetch HoK CAMP Tier Data...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  let tierData = null;

  await page.setRequestInterception(true);
  page.on('request', request => {
    request.continue();
  });
  
  page.on('response', async response => {
    const url = response.url();
    // Intercept the tier list API (adjust URL pattern based on actual HoK Camp API)
    if (url.includes('api/Hero') || url.includes('hero/list') || url.includes('camp.honorofkings.com/api')) {
      try {
        const json = await response.json();
        if (json && json.data && json.data.list && json.data.list.length > 0 && typeof json.data.list[0].winRate !== 'undefined') {
          tierData = json;
          console.log('Intercepted Tier Data API successfully.');
        }
      } catch (e) {}
    }
  });

  console.log('Navigating to HoK Camp Hero List...');
  // We navigate to the official camp page where the tier list is
  await page.goto('https://camp.honorofkings.com/h5/hero-list/index.html?from=official&lang=ja', {waitUntil: 'networkidle2'});
  
  // Wait a bit for potential API calls
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();

  if (!tierData) {
    console.error('Failed to intercept Tier Data. You may need to manually provide the JSON or login.');
    process.exit(1);
  }

  // Parse and update the local stats
  let statsData = {};
  if (fs.existsSync(STATS_PATH)) {
    statsData = JSON.parse(fs.readFileSync(STATS_PATH, 'utf8'));
  }

  const nameToId = {};
  for (const [heroId, data] of Object.entries(statsData)) {
    if (data.jpName) nameToId[data.jpName] = heroId;
    if (data.enName) nameToId[data.enName] = heroId;
  }

  let updatedCount = 0;
  for (const item of tierData.data.list) {
    if (!item.heroInfo) {
      console.log('Skipping item without heroInfo:', item);
      continue;
    }
    let heroName = item.heroInfo.heroName;
    let matchedId = nameToId[heroName];

    if (!matchedId) {
      for (const [name, id] of Object.entries(nameToId)) {
        if (name.includes(heroName) || heroName.includes(name)) {
          matchedId = id; break;
        }
      }
    }

    if (matchedId) {
      const tRank = item.tRank;
      let newTier = "C";
      if (tRank === 0) newTier = "S";
      else if (tRank === 1) newTier = "A";
      else if (tRank === 2) newTier = "B";
      else if (tRank >= 3) newTier = "C";

      const winRate = parseFloat((item.winRate * 100).toFixed(2));
      const pickRate = parseFloat((item.showRate * 100).toFixed(2));
      const banRate = parseFloat((item.banRate * 100).toFixed(2));

      if (!statsData[matchedId]) statsData[matchedId] = {};
      statsData[matchedId].tier = newTier;
      statsData[matchedId].win_rate = winRate;
      statsData[matchedId].pick_rate = pickRate;
      statsData[matchedId].ban_rate = banRate;
      updatedCount++;
    }
  }

  fs.writeFileSync(STATS_PATH, JSON.stringify(statsData, null, 2), 'utf8');
  console.log(`HoK CAMP Sync Complete. Updated ${updatedCount} heroes.`);
}

main();
