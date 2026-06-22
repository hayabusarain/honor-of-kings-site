import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function downloadImage(url, filepath) {
  if (fs.existsSync(filepath)) return; // Skip if already exists
  try {
    const response = await axios({ url, responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(filepath));
    return new Promise((resolve, reject) => {
      response.data.on('end', () => resolve());
      response.data.on('error', e => reject(e));
    });
  } catch (err) {
    console.error(`Failed to download ${url}`);
  }
}

async function scrapeNorra() {
  console.log('Scraping Norra data from WildRiftFire...');
  const url = 'https://www.wildriftfire.com/guide/norra';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  
  // Ensure public directories exist
  const publicItemsDir = path.join(__dirname, '../public/images/items');
  const publicRunesDir = path.join(__dirname, '../public/images/runes');
  fs.mkdirSync(publicItemsDir, { recursive: true });
  fs.mkdirSync(publicRunesDir, { recursive: true });

  // 1. Scrape Items
  const items = [];
  const imageUrls = [];
  
  $('img').each((i, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('/images/items/') && items.length < 6) { // Take first 6 as core build
      const filename = src.split('/').pop();
      items.push({
        id: filename.replace('.png', ''),
        image: filename,
        name: $(el).attr('alt') || filename.replace('.png', '')
      });
      imageUrls.push({ url: `https://www.wildriftfire.com${src}`, path: path.join(publicItemsDir, filename) });
    }
  });

  // 2. Scrape Runes
  const runes = [];
  $('.runes img').each((i, el) => {
    const src = $(el).attr('src') || '';
    const name = $(el).attr('alt');
    if (src.includes('/images/runes/')) {
      const filename = src.split('/').pop();
      runes.push({
        name: name,
        image: filename
      });
      imageUrls.push({ url: `https://www.wildriftfire.com${src}`, path: path.join(publicRunesDir, filename) });
    }
  });

  console.log(`Found ${items.length} items and ${runes.length} runes.`);
  console.log('Downloading images locally to avoid hotlinking...');
  
  // Download all found images
  for (const img of imageUrls) {
    await downloadImage(img.url, img.path);
  }
  
  // 3. Upsert to Supabase
  console.log('Upserting to Supabase...');
  const { error } = await supabase
    .from('wr_champion_details')
    .upsert({
      champion_id: 'Norra', // Match the ID used in our app (Norra)
      runes: runes, // JSONB
      items: items, // JSONB
      custom_skills: "ノラは長距離からのポークと視界コントロールが得意なアーティラリーメイジです。敵のキャリーを狙ってウルトで分断しましょう。"
    }, { onConflict: 'champion_id' });

  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log('Successfully updated Norra in database!');
  }
}

scrapeNorra();
