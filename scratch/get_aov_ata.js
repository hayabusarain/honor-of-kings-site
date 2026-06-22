const https = require('https');
https.get('https://liquipedia.net/arenaofvalor/Ata', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    let imgRegex = /<img[^>]+src=\"([^\"]+)\"[^>]*alt=\"Ata\"/ig;
    let match;
    while((match = imgRegex.exec(body)) !== null) {
      console.log('Ata URL:', match[1]);
    }
  });
});
