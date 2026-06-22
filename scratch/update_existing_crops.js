const fs = require('fs');
const path = require('path');

const finalPath = './src/data/physical_items_final.json';
const croppedDir = './public/images/items/cropped';

if (!fs.existsSync(finalPath)) {
  console.log("Database file not found");
  process.exit(1);
}

const items = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
const croppedFiles = fs.readdirSync(croppedDir).filter(f => f.endsWith('.png'));

let updatedCount = 0;

items.forEach(item => {
  const nameJa = item.nameJa;
  const safeName = nameJa.replace(/[^\w\-_]/g, '_');
  const possibleFilenames = [
    `${nameJa}.png`,
    `${safeName}.png`
  ];
  
  const matchedFile = croppedFiles.find(f => possibleFilenames.includes(f));
  
  if (matchedFile) {
    const relativePath = `/images/items/cropped/${matchedFile}`;
    if (item.image !== relativePath) {
      item.image = relativePath;
      console.log(`Updated: ${nameJa} => ${relativePath}`);
      updatedCount++;
    }
  }
});

if (updatedCount > 0) {
  fs.writeFileSync(finalPath, JSON.stringify(items, null, 2), 'utf8');
  console.log(`Successfully updated ${updatedCount} items with existing cropped images.`);
} else {
  console.log("No new updates found for existing cropped images.");
}
