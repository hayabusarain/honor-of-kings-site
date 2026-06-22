const puppeteer = require('puppeteer');

const PATHS = [
  '/ja/',
  '/ja/champions',
  '/ja/tier-list',
  '/ja/items',
  '/ja/runes',
  '/ja/spells'
];

async function runQA() {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  
  // Set mobile viewport
  await page.setViewport({ width: 375, height: 812, isMobile: true });

  const results = {
    hydrationErrors: [],
    overflowBugs: [],
    otherErrors: []
  };

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      if (text.includes('Hydration failed') || text.includes('Text content does not match') || text.includes('did not match')) {
        results.hydrationErrors.push(`[${page.url()}] ${text}`);
      } else {
        results.otherErrors.push(`[${page.url()}] ${text}`);
      }
    }
  });

  page.on('pageerror', err => {
    results.otherErrors.push(`[${page.url()}] ${err.message}`);
  });

  for (const path of PATHS) {
    const url = `http://localhost:3000${path}`;
    console.log(`Checking ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Give a little extra time for client side rendering
      await new Promise(r => setTimeout(r, 2000));

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth;
      });

      if (hasOverflow) {
        results.overflowBugs.push(url);
      }
    } catch (e) {
      results.otherErrors.push(`[${url}] Failed to navigate: ${e.message}`);
    }
  }

  await browser.close();
  
  console.log(JSON.stringify(results, null, 2));
}

runQA().catch(console.error);
