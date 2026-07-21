const https = require('https');
const fs = require('fs');
const path = require('path');

const NEWS_URL = 'https://hok-sg-community.playerinfinite.com/api/gpts.information_feeds_svr.InformationFeedsSvr/GetContentByLabel';
const LOCAL_JSON_PATH = path.join(__dirname, '../src/data/patches.json');

async function fetchNews() {
  const postData = JSON.stringify({
    "LabelId": "1158", // ID for patches/news on official site
    "PageNum": 1,
    "PageSize": 10,
    "Language": "ja",
    "GameId": 32,
    "ChannelId": 1
  });

  return new Promise((resolve, reject) => {
    const req = https.request(NEWS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('Fetching official news...');
  let newsData;
  try {
    newsData = await fetchNews();
  } catch (e) {
    console.error('Failed to fetch news:', e);
    process.exit(1);
  }

  if (!newsData.Data || !newsData.Data.ContentList) {
    console.log('No news found or invalid response.');
    return;
  }

  let localPatches = [];
  if (fs.existsSync(LOCAL_JSON_PATH)) {
    localPatches = JSON.parse(fs.readFileSync(LOCAL_JSON_PATH, 'utf8'));
  }

  let added = 0;
  for (const item of newsData.Data.ContentList) {
    const title = item.Title;
    const date = item.PublishTime;
    const id = item.ContentId;
    
    // Check if already exists
    if (!localPatches.find(p => p.id === id || p.title === title)) {
      localPatches.unshift({
        id: id || Date.now().toString(),
        title: title,
        date: date || new Date().toISOString().split('T')[0],
        type: 'official',
        content: item.Summary || title
      });
      added++;
    }
  }

  if (added > 0) {
    fs.writeFileSync(LOCAL_JSON_PATH, JSON.stringify(localPatches, null, 2));
  }
  console.log(`News Sync Complete. Added ${added} new patches/news.`);
}

main();
