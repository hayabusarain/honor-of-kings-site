const https = require('https');
https.get('https://liquipedia.net/arenaofvalor/Ata', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    let imgRegex = /src=\"([^\"]+)\"/ig;
    let match;
    while((match = imgRegex.exec(body)) !== null) {
      if (match[1].toLowerCase().includes('ata')) {
        console.log('Ata URL:', match[1]);
      }
    }
  });
});
