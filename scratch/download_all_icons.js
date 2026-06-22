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

// Download concurrently with a limit
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

async function processAll() {
  const tasks = [];
  
  for (const heroId of Object.keys(jaData)) {
    for (const skillKey of ['passive', 'skill1', 'skill2', 'skill3', 'skill4']) {
      const skill = jaData[heroId][skillKey];
      if (!skill) continue;
      
      const url = skill.icon;
      if (url && url.startsWith('http')) {
        tasks.push({ heroId, skillKey, url, skillObj: skill });
      }
    }
  }
  
  console.log(`Found ${tasks.length} icons to download...`);
  let completed = 0;
  
  await asyncPool(10, tasks, async (task) => {
    const destName = `${task.heroId}_${task.skillKey}.png`;
    const destPath = path.join(outDir, destName);
    const success = await download(task.url, destPath);
    if (success) {
      task.skillObj.icon = `/images/skills/${destName}`;
    }
    completed++;
    if (completed % 50 === 0) {
      console.log(`Progress: ${completed} / ${tasks.length}`);
    }
  });
  
  fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2), 'utf8');
  console.log("Done downloading all icons and updating ja.json");
}

processAll();
