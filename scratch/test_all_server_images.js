const http = require('http');
const fs = require('fs');
const path = require('path');

const itemsPath = path.join(__dirname, '../src/data/physical_items_final.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

let checked = 0;
const failed = [];

function checkNext(index) {
  if (index >= items.length) {
    console.log(`\nChecked ${checked} item images. Failed: ${failed.length}`);
    if (failed.length > 0) {
      console.log('Failed images list:');
      console.log(failed);
    }
    return;
  }

  const item = items[index];
  const imgPath = item.image;
  if (!imgPath.startsWith('/')) {
    checked++;
    checkNext(index + 1);
    return;
  }

  const encodedPath = encodeURI(imgPath);
  const url = `http://localhost:3000${encodedPath}`;

  http.get(url, (res) => {
    checked++;
    if (res.statusCode !== 200) {
      failed.push({ item: item.nameJa, path: imgPath, status: res.statusCode });
    }
    res.resume(); // consume response body
    checkNext(index + 1);
  }).on('error', (e) => {
    checked++;
    failed.push({ item: item.nameJa, path: imgPath, error: e.message });
    checkNext(index + 1);
  });
}

checkNext(0);
