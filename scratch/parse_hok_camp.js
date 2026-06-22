const fs = require('fs');
const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');

// We want to find hero names and their images.
// HOK Camp usually has a structure like:
// <div class="hero-item"><img src="HOK CAMP_files/something.png" alt="HeroName"><p>HeroName</p></div>
// Since we don't know the exact class, we'll extract all img tags and the text nearby.

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM(html);
const document = dom.window.document;

const imgs = document.querySelectorAll('img');
console.log('Total images found:', imgs.length);

const results = [];
imgs.forEach(img => {
  const src = img.getAttribute('src');
  if (!src) return;
  // Look for text nearby or alt text
  let name = img.getAttribute('alt') || '';
  if (!name && img.nextElementSibling) {
    name = img.nextElementSibling.textContent.trim();
  }
  if (!name && img.parentElement && img.parentElement.textContent) {
    name = img.parentElement.textContent.trim();
  }
  if (name && src.includes('HOK CAMP_files')) {
    results.push({ name: name.replace(/\n/g, '').trim(), src });
  }
});

console.log('Sample extracted:', results.slice(0, 10));
fs.writeFileSync('scratch/camp_extracted.json', JSON.stringify(results, null, 2));
