const https = require('https');
https.get('https://www.honorofkings.com/global-en/hero-list.html', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    let html = body;
    let idx = html.indexOf('Ata');
    console.log('Ata index:', idx);
    if (idx !== -1) {
      console.log(html.substring(Math.max(0, idx - 200), idx + 200));
    }
  });
});
