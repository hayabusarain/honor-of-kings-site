const hok = require('../src/data/hok_heroes.json');
const stats = require('../public/data/hero_stats_camp.json');
const missing = hok.filter(h => !stats[h.id]);
console.log('Missing count:', missing.length);
missing.forEach(h => console.log(h.name));
