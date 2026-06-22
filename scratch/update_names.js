const fs = require('fs');

const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');
const regex = /<img src=\"\.\/HOK CAMP_files\/([^"]+)\"[^>]*>.*?<div class=\"hero-intro-name\">([^<]+)<\/div>/g;
let match;
const extractedImages = {};
const htmlNamesByImage = {};

while ((match = regex.exec(html)) !== null) {
  const filename = match[1];
  const name = match[2].trim();
  extractedImages[name] = filename;
  htmlNamesByImage[filename] = name;
}

const hokPath = '../src/data/hok_heroes.json';
const hok = require(hokPath);

const jaPath = '../public/data/skills/ja.json';
const ja = require(jaPath);

const heroStatsPath = '../public/data/hero_stats_camp.json';
const heroStats = require(heroStatsPath);

let updatedHokCount = 0;
let updatedJaCount = 0;

const newStats = {};

hok.forEach(h => {
  let name = h.name.split('（')[0].trim();
  
  let mapName = name;
  if (name === 'カルラ') mapName = '伽羅';
  if (name === '裴擒虎') mapName = 'タイガー';
  if (name === '狂鉄') mapName = 'バイロン';
  if (name === 'ファーティフ') mapName = '曹操';
  if (name === 'アレッシオ') mapName = '莱西奥';
  if (name === 'ラブール') mapName = 'ラプール';
  if (name === '鍾馗') mapName = '鐘馗';
  if (name === '蒙?') mapName = '蒙牙';
  
  let filename = extractedImages[mapName] || extractedImages[h.name];
  if (filename && htmlNamesByImage[filename]) {
    const newName = htmlNamesByImage[filename];
    if (h.name !== newName) {
      h.name = newName;
      updatedHokCount++;
    }
    
    if (ja[h.id] && ja[h.id].hero_name !== newName) {
      ja[h.id].hero_name = newName;
      updatedJaCount++;
    }
  }
});

// Save changes back (note we are inside scratch, so paths for writing need to be absolute or relative to cwd)
fs.writeFileSync('src/data/hok_heroes.json', JSON.stringify(hok, null, 2));
fs.writeFileSync('public/data/skills/ja.json', JSON.stringify(ja, null, 2));

console.log('Updated', updatedHokCount, 'names in hok_heroes.json');
console.log('Updated', updatedJaCount, 'names in ja.json');
