const fs = require('fs');
const path = require('path');

const finalPath = path.join(__dirname, '../src/data/physical_items_final.json');
const cropDir = path.join(__dirname, '../public/images/items/cropped');

if (!fs.existsSync(finalPath)) {
  console.error("physical_items_final.json not found");
  process.exit(1);
}

const items = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
let convertedCount = 0;

items.forEach(item => {
  if (item.nameJa.startsWith('マーキュリー ') && item.nameJa !== 'マーキュリー ブーツ') {
    const oldName = item.nameJa;
    const newName = item.nameJa.replace('マーキュリー ', '');
    
    const oldImgPath = item.image;
    const newImgPath = item.image.replace('マーキュリー_', '');
    
    // Rename file on disk
    const oldFilename = oldImgPath.replace('/images/items/cropped/', '');
    const newFilename = newImgPath.replace('/images/items/cropped/', '');
    
    const oldFilePath = path.join(cropDir, oldFilename);
    const newFilePath = path.join(cropDir, newFilename);
    
    if (fs.existsSync(oldFilePath)) {
      fs.renameSync(oldFilePath, newFilePath);
      console.log(`Renamed file: ${oldFilename} -> ${newFilename}`);
    } else {
      console.log(`Warning: File ${oldFilename} not found on disk.`);
    }
    
    item.nameJa = newName;
    item.image = newImgPath;
    console.log(`Converted item: "${oldName}" -> "${newName}"`);
    convertedCount++;
  }
});

if (convertedCount > 0) {
  fs.writeFileSync(finalPath, JSON.stringify(items, null, 2), 'utf8');
  console.log(`Successfully converted ${convertedCount} boot enchantment items.`);
} else {
  console.log("No boot enchantment items needed conversion.");
}
