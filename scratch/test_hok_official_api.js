const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('.json') || url.includes('api')) {
      console.log('Intercepted:', url);
    }
  });

  console.log('Navigating...');
  await page.goto('https://www.honorofkings.com/global-en/hero-list.html', {waitUntil: 'networkidle0', timeout: 30000});
  
  await browser.close();
})();
