const fs = require('fs');
const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');
const hok = require('../src/data/hok_heroes.json');

// Find all hero containers
const regex = /<img src=\"\.\/HOK CAMP_files\/([^"]+)\"[^>]*>.*?<div class=\"hero-intro-name\">([^<]+)<\/div>.*?<\/td>(.*?)<\/tr>/g;
let match;
const extractedImages = {};
const extractedStats = {};

while ((match = regex.exec(html)) !== null) {
  const filename = match[1];
  const name = match[2].trim();
  const rowData = match[3];
  
  extractedImages[name] = filename;
  
  const tdRegex = /<div class=\"table-text[^>]*>([^<]+)<\/div>/g;
  let tdMatch;
  const values = [];
  while ((tdMatch = tdRegex.exec(rowData)) !== null) {
    values.push(tdMatch[1].trim());
  }
  
  if (values.length >= 4) {
    extractedStats[name] = {
      tier: values[0],
      win_rate: parseFloat(values[1].replace('%', '')),
      pick_rate: parseFloat(values[2].replace('%', '')),
      ban_rate: parseFloat(values[3].replace('%', ''))
    };
  }
}

const finalStats = {};

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
  
  // Try mapping
  let filename = extractedImages[mapName] || extractedImages[h.name];
  let stats = extractedStats[mapName] || extractedStats[h.name];
  
  if (filename) {
    const srcPath = 'c:/Users/81901/Desktop/HOK CAMP_files/' + filename;
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, 'public/images/heroes/' + h.id + '.jpg');
    }
  }
  
  if (stats) {
    finalStats[h.id] = stats;
  }
});

fs.writeFileSync('public/data/hero_stats_camp.json', JSON.stringify(finalStats, null, 2));
