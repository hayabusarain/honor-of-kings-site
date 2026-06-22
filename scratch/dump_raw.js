const fs = require('fs');
const raw = require('./src/data/hok_heroes_raw.json');
fs.writeFileSync('scratch/raw_names.txt', raw.map(x => `${x.ename}: ${x.cname}`).join('\n'));
