const https = require('https');
https.get('https://www.honorofkings.com/global-en/hero-list.html', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    let matches = body.match(/https?:\/\/[^\"\s]+\.(?:png|jpg)/ig) || [];
    let ataImgs = matches.filter(url => url.toLowerCase().includes('ata'));
    console.log('Ata images found from official:', [...new Set(ataImgs)]);
    if (ataImgs.length === 0) {
      console.log('No Ata images found, trying without full url...');
      let paths = body.match(/\/[^\"\s]+\.(?:png|jpg)/ig) || [];
      console.log('Found paths:', paths.filter(p => p.toLowerCase().includes('ata')));
    }
  });
});
