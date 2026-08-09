const fs = require('fs');

const files = [
  'src/data/hok_heroes.json',
  'src/data/hero_stats_camp.json',
  'src/data/top_tier.json'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/"大司命"/g, '"オーグラン"');
    c = c.replace(/"白龍"/g, '"アオイン"');
    fs.writeFileSync(f, c);
  }
});
console.log('Names replaced!');
