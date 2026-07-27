const fs = require('fs');
const Tesseract = require('tesseract.js');
const { createCanvas, loadImage } = require('canvas');

async function main() {
  const worker = await Tesseract.createWorker('jpn');
  const files = [
    { id: '11110', file: 'scratch/missing_items_raw/11110_full.png', name: 'エンチャント' },
    { id: '11211', file: 'scratch/missing_items_raw/11211_full.png', name: 'フォージ' },
    { id: '1218',  file: 'scratch/missing_items_raw/1218_full.png', name: '結晶' }
  ];

  for (const item of files) {
    if (!fs.existsSync(item.file)) {
      console.log(`Not found: ${item.file}`);
      continue;
    }
    const { data } = await worker.recognize(item.file);
    // console.log("keys:", Object.keys(data));
    
    // data.words is an array of objects
    const words = data.words;
    if (words) {
      const word = words.find(w => w.text.includes(item.name));
      if (word) {
        console.log(`Found ${item.name} at bbox:`, word.bbox);
        
        const image = await loadImage(item.file);
        const canvas = createCanvas(120, 120);
        const ctx = canvas.getContext('2d');
        
        // HOK popup: Icon is usually above or left of the title. Let's guess left and slightly up.
        // Assuming word.bbox is { x0, y0, x1, y1 }
        const cx = Math.max(0, word.bbox.x0 - 150);
        const cy = Math.max(0, word.bbox.y0 - 20);
        
        ctx.drawImage(image, cx, cy, 120, 120, 0, 0, 120, 120);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(`public/images/items/${item.id}.png`, buffer);
        console.log(`Saved crop for ${item.id}`);
      } else {
        console.log(`Could not find word ${item.name} in words array`);
      }
    } else {
      console.log('No words array in data');
    }
  }
  await worker.terminate();
}
main();
