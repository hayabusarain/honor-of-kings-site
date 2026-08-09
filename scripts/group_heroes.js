/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
const { createCanvas, loadImage } = require('canvas');

async function groupScreenshots() {
  console.log('Starting screenshot hero boundary detection...');
  const manifest = JSON.parse(fs.readFileSync('scratch/screenshot_manifest.json', 'utf8'));
  const dir = 'C:\\Users\\81901\\Pictures\\Screenshots';

  const worker = await createWorker('eng');
  
  const _heroGroups = [];
  let _currentHero = null;
  let _currentFiles = [];

  const results = [];

  for (let i = 0; i < manifest.length; i++) {
    const filename = manifest[i];
    const fullPath = path.join(dir, filename);

    try {
      // Load image & crop right hero name area (approx width: 1920x1080 -> crop x: 1100..1600, y: 150..300)
      const image = await loadImage(fullPath);
      const canvas = createCanvas(500, 200);
      const ctx = canvas.getContext('2d');

      // Draw cropped top-right area where hero name resides (e.g. Ziya, Mulan, etc.)
      const cropX = image.width * 0.60;
      const cropY = image.height * 0.12;
      const cropW = image.width * 0.25;
      const cropH = image.height * 0.18;

      ctx.drawImage(image, cropX, cropY, cropW, cropH, 0, 0, 500, 200);
      const croppedBuffer = canvas.toBuffer('image/png');

      const { data: { text } } = await worker.recognize(croppedBuffer);
      const cleanName = text.replace(/[^a-zA-Z\s]/g, '').trim().split('\n')[0];

      results.push({
        index: i,
        file: filename,
        detectedName: cleanName
      });

      if ((i + 1) % 20 === 0 || i === manifest.length - 1) {
        console.log(`Processed ${i + 1}/${manifest.length} images... Latest detected: "${cleanName}" (${filename})`);
      }
    } catch (e) {
      console.error(`Error processing ${filename}:`, e.message);
      results.push({ index: i, file: filename, detectedName: 'UNKNOWN' });
    }
  }

  await worker.terminate();

  fs.writeFileSync('scratch/hero_ocr_scan.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('✁EFinished Hero Boundary Scan! Results saved to scratch/hero_ocr_scan.json');
}

groupScreenshots().catch(err => {
  console.error('Fatal error in groupScreenshots:', err);
});
