const fs = require('fs');
const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');
const hok = require('../src/data/hok_heroes.json');

// Find all hero containers
const regex = /<img src=\"\.\/HOK CAMP_files\/([^"]+)\"[^>]*><div class=\"hero-intro\"><div class=\"hero-intro-name\">([^<]+)<\/div>/g;

let match;
const extracted = {};
while ((match = regex.exec(html)) !== null) {
  const filename = match[1];
  const name = match[2].trim();
  extracted[name] = filename;
}

console.log('Extracted heroes from HTML:', Object.keys(extracted).length);

let updated = 0;
hok.forEach(h => {
  let name = h.name.split('Åi')[0].trim();
  let filename = extracted[name] || extracted[h.name];
  
  if (filename) {
    const srcPath = 'c:/Users/81901/Desktop/HOK CAMP_files/' + filename;
    if (fs.existsSync(srcPath)) {
      const destPath = 'public/images/heroes/' + h.id + '.jpg';
      fs.copyFileSync(srcPath, destPath);
      updated++;
    }
  } else {
    console.log('Could not find image for:', h.name);
  }
});

console.log('Successfully updated', updated, 'hero images to perfectly match Global HOK Camp!');
