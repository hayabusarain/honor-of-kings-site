const fs = require('fs');
const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');
const regex = /<img src=\"\.\/HOK CAMP_files\/([^"]+)\"[^>]*><div class=\"hero-intro\"><div class=\"hero-intro-name\">([^<]+)<\/div>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  if (match[2].includes('›FŒÈ')) {
    console.log(match[1]);
  }
}
