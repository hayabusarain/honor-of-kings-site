const fs = require('fs');
const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');
const hok = require('../src/data/hok_heroes.json');

const regex = /<img src=\"\.\/HOK CAMP_files\/[^\"]+\"[^>]*>.*?<div class=\"hero-intro-name\">([^<]+)<\/div>.*?<\/td>(.*?)<\/tr>/g;
let match;
const rawExtracted = {};

while ((match = regex.exec(html)) !== null) {
  const name = match[1].trim();
  const rowData = match[2];
  
  // Extract the 4 values: Tier, WinRate, PickRate, BanRate
  const tdRegex = /<div class=\"table-text[^>]*>([^<]+)<\/div>/g;
  let tdMatch;
  const values = [];
  while ((tdMatch = tdRegex.exec(rowData)) !== null) {
    values.push(tdMatch[1].trim());
  }
  
  if (values.length >= 4) {
    rawExtracted[name] = {
      tier: values[0],
      win_rate: parseFloat(values[1].replace('%', '')),
      pick_rate: parseFloat(values[2].replace('%', '')),
      ban_rate: parseFloat(values[3].replace('%', ''))
    };
  }
}

console.log('Extracted stats for', Object.keys(rawExtracted).length, 'heroes from HTML.');

const finalStats = {};
let matched = 0;

hok.forEach(h => {
  let name = h.name.split('（')[0].trim();
  let stats = rawExtracted[name] || rawExtracted[h.name];
  
  if (!stats) {
    if (name === 'カルラ') stats = rawExtracted['伽羅'];
    if (name === 'タイガー') stats = rawExtracted['裴擒虎'];
    if (name === 'バイロン') stats = rawExtracted['狂鉄'];
    if (name === 'ファーティフ') stats = rawExtracted['曹操'] || rawExtracted['ファーティフ'];
    if (name === 'アレッシオ') stats = rawExtracted['莱西奥'] || rawExtracted['アレッシオ'];
    if (name === 'ルアンナ') stats = rawExtracted['ルアンナ'];
  }
  
  if (stats) {
    finalStats[h.id] = stats;
    matched++;
  } else {
    console.log('Missing stats for:', h.name);
  }
});

console.log('Successfully mapped stats for', matched, 'heroes!');

fs.writeFileSync('public/data/hero_stats_camp.json', JSON.stringify(finalStats, null, 2));
console.log('Saved to public/data/hero_stats_camp.json');
