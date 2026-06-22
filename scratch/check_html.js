const fs = require('fs');
let html = fs.readFileSync('liquipedia_heroes.html', 'utf8');

const imgRegex = /<img[^>]+src=\"([^\"]+)\"/g;
let match;
const urls = [];
while ((match = imgRegex.exec(html)) !== null) {
  if (match[1].includes('liquipedia.net/commons/images') || match[1].includes('/commons/images/')) {
    let url = match[1];
    if (url.includes('/thumb/')) {
      url = url.replace('/thumb', '');
      url = url.substring(0, url.lastIndexOf('/'));
    }
    if (!url.startsWith('http')) url = 'https://liquipedia.net' + url;
    urls.push(url);
  }
}

const uniqueUrls = Array.from(new Set(urls));
console.log('Unique images:', uniqueUrls.length);
console.log(uniqueUrls.filter(u => u.toLowerCase().includes('daji')));
