const fs = require('fs');
const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');
const regex = /<img src=\"\.\/HOK CAMP_files\/([^"]+)\"[^>]*>.*?<div class=\"hero-intro-name\">([^<]+)<\/div>/g;
let match;
const img = {};
while ((match = regex.exec(html)) !== null) {
  img[match[2].trim()] = match[1];
}
console.log('Daji matched image:', img['›FŒÈ']);
