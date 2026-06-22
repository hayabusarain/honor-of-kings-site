const fs = require('fs');
const content = fs.readFileSync('C:/Users/81901/.gemini/antigravity/brain/a68a100b-b7ec-493a-b0f7-9b8c6e2445bd/.system_generated/steps/1214/content.md', 'utf8');
const regex = /https:\/\/[^\s"'><]+\.(?:png|jpg|jpeg)/gi;
const matches = content.match(regex);
if (matches) {
  const devaraImages = matches.filter(url => url.toLowerCase().includes('devara'));
  console.log('Devara images:', devaraImages);
} else {
  console.log('No matches');
}
