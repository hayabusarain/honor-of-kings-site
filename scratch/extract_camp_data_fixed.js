const fs = require('fs');
const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');
const hok = require('../src/data/hok_heroes.json');

const regex = /<div class=\"hero-intro-name\">([^<]+)<\/div>/g;
let match;
const extractedNames = new Set();
while ((match = regex.exec(html)) !== null) {
  extractedNames.add(match[1].trim());
}
console.log('Available in HTML:', Array.from(extractedNames).join(', '));
