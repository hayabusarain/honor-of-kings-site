const fs = require('fs');
const contentPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/steps/13040/content.md';

if (!fs.existsSync(contentPath)) {
  console.error("File does not exist.");
  process.exit(1);
}

const content = fs.readFileSync(contentPath, 'utf8');

// Find all src or href containing images
const urls = [];
const srcRegex = /src=["'](.*?)["']/gi;
let match;
while ((match = srcRegex.exec(content)) !== null) {
  urls.push(match[1]);
}

const hrefRegex = /href=["'](.*?\.(png|jpg|jpeg|webp))["']/gi;
while ((match = hrefRegex.exec(content)) !== null) {
  urls.push(match[1]);
}

// Custom search for any text containing wildriftfire images
const wordRegex = /(https?:\/\/\S+?\.(png|jpg|jpeg|webp|svg))/gi;
while ((match = wordRegex.exec(content)) !== null) {
  urls.push(match[1]);
}

const uniqueUrls = [...new Set(urls)];
console.log(`Found ${uniqueUrls.length} unique URLs:`);
uniqueUrls.forEach(url => {
  if (url.includes('images') || url.includes('rune') || url.includes('icon') || url.includes('item')) {
    console.log(url);
  }
});
