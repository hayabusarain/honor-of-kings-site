const fs = require('fs');
const html = fs.readFileSync('scratch/liquipedia_heroes.html', 'utf8');

// Match <li> or <div> that contains the image and the hero name text
const heroRegex = /<div class=\"[^\"]*icon[^\"]*\">.*?<img[^>]+src=\"([^\"]+)\"[^>]*>.*?<\/div>.*?<span[^>]*><a[^>]+>([^<]+)<\/a><\/span>/gs;
let match;
const urlToName = {};

// It's a gallery or table. Let's try to just find all <a title="HeroName"> and the image next to it.
const regex = /<a href=\"\/honorofkings\/([^\"]+)\"[^>]*title=\"[^\"]+\"[^>]*>.*?<img[^>]+src=\"([^\"]+)\"/gs;
while ((match = regex.exec(html)) !== null) {
  let name = decodeURIComponent(match[1]).replace(/_/g, ' ');
  let url = match[2];
  if (url.includes('/thumb/')) {
    url = url.replace('/thumb', '');
    url = url.substring(0, url.lastIndexOf('/'));
  }
  if (!url.startsWith('http')) url = 'https://liquipedia.net' + url;
  urlToName[name] = url;
}

console.log('Extracted URLs:', Object.keys(urlToName).length);
console.log(Object.keys(urlToName).slice(0, 5));
