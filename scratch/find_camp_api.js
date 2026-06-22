const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  
  // Intercept network requests
  await page.setRequestInterception(true);
  page.on('request', request => {
    request.continue();
  });
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api/Hero') || url.includes('api/hero') || url.includes('hero/get')) {
      console.log('Found API:', url);
      try {
        const text = await response.text();
        console.log('Response excerpt:', text.substring(0, 300));
      } catch (e) {}
    }
  });

  console.log('Navigating to HoK Camp Hero List...');
  await page.goto('https://camp.honorofkings.com/hero', {waitUntil: 'networkidle0'});
  
  // Also let's try navigating to a specific hero detail page (e.g., Arthur which is usually 166 or something, let's try clicking the first hero)
  const firstHero = await page.$('.hero-list .hero-item, a[href*="heroDetail"]');
  if (firstHero) {
    console.log('Found a hero link, clicking...');
    await firstHero.click();
    await page.waitForNavigation({waitUntil: 'networkidle0'});
  } else {
    console.log('No hero link found, evaluating page HTML...');
    const html = await page.content();
    console.log(html.substring(0, 500));
  }
  
  await browser.close();
})();
