const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  await page.setViewport({width: 390, height: 844, isMobile: true});
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ja-JP,ja;q=0.9'
  });
  
  console.log('Navigating...');
  await page.goto('https://camp.honorofkings.com/', {waitUntil: 'networkidle0'});
  
  const hrefs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => a.href);
  });
  
  const texts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.index-nav_nav-item__m4f9A, a, div')).map(e => e.innerText).filter(t => t && t.trim().length > 0 && t.trim().length < 30);
  });

  console.log('Hrefs:', [...new Set(hrefs)].slice(0, 20));
  console.log('Texts:', [...new Set(texts)].slice(0, 50));
  
  await browser.close();
})();
