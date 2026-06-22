const fs = require('fs');
let html = fs.readFileSync('scratch/liquipedia_heroes.html', 'utf8');
let idx = html.indexOf('title=\"Daji\"');
console.log(html.substring(idx - 400, idx + 400));
