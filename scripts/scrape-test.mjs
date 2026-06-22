import axios from 'axios';
import * as cheerio from 'cheerio';

async function testScrape() {
  const url = 'https://www.wildriftfire.com/guide/norra';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  
  const items = [];
  $('.build-items img').each((i, el) => {
    items.push($(el).attr('alt') || $(el).attr('src'));
  });
  
  const runes = [];
  $('.runes img').each((i, el) => {
    runes.push($(el).attr('alt'));
  });
  
  console.log('Items:', items.length > 0 ? items : 'Not found in .build-items');
  console.log('Runes:', runes.length > 0 ? runes : 'Not found in .runes');
  
  // Look for any image that might be an item
  const allImgs = [];
  $('img').each((i, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('item') || src.includes('rune')) {
      allImgs.push(src);
    }
  });
  console.log('Sample item/rune images found on page:', allImgs.slice(0, 10));
}

testScrape();
