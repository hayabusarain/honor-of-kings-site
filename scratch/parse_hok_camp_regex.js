const fs = require('fs');
const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');

const results = [];
// Find elements that look like an image followed by a name or vice-versa
// In HOK Camp, the hero list often has something like: <div ...><img src="HOK CAMP_files/xxx.png"><div ...>HeroName</div></div>

const imgRegex = /<img[^>]*src=[\"'](HOK CAMP_files\/[^\"]+)[\"'][^>]*>/gi;
let match;
while ((match = imgRegex.exec(html)) !== null) {
  const src = match[1];
  const index = match.index;
  // look at the next 200 characters for the hero name
  const textAfter = html.slice(index + match[0].length, index + match[0].length + 200);
  const nameMatch = textAfter.match(/>([^<]+)</);
  
  // also look before just in case
  const textBefore = html.slice(Math.max(0, index - 200), index);
  const nameMatchBefore = textBefore.match(/>([^<]+)<\/[^>]+>\s*$/);

  let name = '';
  if (nameMatch && nameMatch[1].trim()) name = nameMatch[1].trim();
  else if (nameMatchBefore && nameMatchBefore[1].trim()) name = nameMatchBefore[1].trim();

  // clean up name
  name = name.replace(/\n/g, '').trim();
  if (name && src && name.length < 20) {
    results.push({ name, src });
  }
}

// deduplicate
const unique = {};
results.forEach(r => {
  if (r.name.length > 0 && !unique[r.name]) unique[r.name] = r.src;
});

console.log('Unique heroes found:', Object.keys(unique).length);
console.log('Sample:', Object.entries(unique).slice(0, 10));
fs.writeFileSync('scratch/camp_extracted.json', JSON.stringify(unique, null, 2));
