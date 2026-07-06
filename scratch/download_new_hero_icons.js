const https = require('https');
const fs = require('fs');
const path = require('path');

const heroes = [
  { id: 'hero_631', url: 'https://camp.honorofkings.com/camp/admin/hero/head_128-128/skJXGWLF.png' },
  { id: 'hero_635', url: 'https://camp.honorofkings.com/camp/admin/hero/head_128-128/UDiFFfId.png' },
  { id: 'hero_640', url: 'https://camp.honorofkings.com/camp/admin/hero/head_128-128/49o0xBua.png' }
];

const destDir = path.join(__dirname, '../public/images/heroes');

heroes.forEach(hero => {
  const destPath = path.join(destDir, `${hero.id}.jpg`);
  
  https.get(hero.url, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Failed to get ${hero.url} (${res.statusCode})`);
      return;
    }

    const fileStream = fs.createWriteStream(destPath);
    res.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Downloaded ${hero.id}.jpg`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${hero.id}: ${err.message}`);
  });
});
