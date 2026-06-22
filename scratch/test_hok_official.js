const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  
  console.log('Navigating to Official HoK Global Hero List...');
  await page.goto('https://www.honorofkings.com/global-en/hero-list.html', {waitUntil: 'networkidle0', timeout: 30000});
  
  const heroes = await page.evaluate(() => {
    // Look for hero links
    return Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('hero'));
  });

  console.log('Found hero links:', heroes.slice(0, 10));
  
  await browser.close();
})();
