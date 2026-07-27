const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const { createCanvas, loadImage } = require('canvas');

const TARGETS = {
  "11110": "エンチャントフェザー",
  "11211": "フォージセイバー",
  "1218": "元流の結晶"
};

const DIRS = [
  "C:/Users/81901/Desktop/おなきんあいてむ",
  "C:/Users/81901/Desktop/あいてむみきれ"
];

const OUT_DIR = "C:/Users/81901/Desktop/オナーオブキングスサイト/public/images/items";
const DEBUG_DIR = "C:/Users/81901/Desktop/オナーオブキングスサイト/scratch/missing_items_raw";

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(DEBUG_DIR)) fs.mkdirSync(DEBUG_DIR, { recursive: true });

async function main() {
  console.log("Downloading language data...");
  const worker = await Tesseract.createWorker('jpn');
  console.log("Worker ready.");
  
  const found = { "11110": false, "11211": false, "1218": false };
  
  for (const dir of DIRS) {
    if (!fs.existsSync(dir)) continue;
    
    const files = fs.readdirSync(dir).filter(f => f.match(/\.(png|jpe?g)$/i));
    for (const file of files) {
      if (Object.values(found).every(v => v)) break;
      
      const fpath = path.join(dir, file);
      
      try {
        const { data: { text, words } } = await worker.recognize(fpath);
        const cleanText = text.replace(/\s/g, "");
        
        for (const [tid, tname] of Object.entries(TARGETS)) {
          // Sometimes OCR makes small mistakes, so we check for partial matches
          // e.g. "エンチャント" or "フェザー", "フォージ" etc.
          const shortName = tname.substring(0, 5); 
          
          if (!found[tid] && (cleanText.includes(tname) || cleanText.includes(shortName))) {
            console.log(`Found ${tname} in ${file}!`);
            found[tid] = true;
            
            // Try to find the bounding box of the matching word
            let word = words.find(w => w.text.includes(shortName) || tname.includes(w.text));
            
            // If word not found, we just crop from a fixed expected location
            // Let's copy the full image so we can debug
            fs.copyFileSync(fpath, path.join(DEBUG_DIR, `${tid}_full.png`));
            
            const image = await loadImage(fpath);
            
            // To be safe, let's crop a slightly larger area: 150x150
            const canvas = createCanvas(150, 150);
            const ctx = canvas.getContext('2d');
            
            let cx = 50, cy = 200; // arbitrary defaults
            if (word) {
                cx = Math.max(0, word.bbox.x0 - 160);
                cy = Math.max(0, word.bbox.y0 - 20);
            }
            
            ctx.drawImage(image, cx, cy, 150, 150, 0, 0, 150, 150);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(path.join(OUT_DIR, `${tid}.png`), buffer);
            console.log(`Saved crop for ${tid}`);
          }
        }
      } catch (err) {
        console.error(`Error on ${file}:`, err);
      }
    }
  }
  
  await worker.terminate();
  console.log("Done!");
}

main();
