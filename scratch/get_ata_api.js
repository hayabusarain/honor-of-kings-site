const https = require('https');
https.get('https://honorofkings.fandom.com/api.php?action=query&titles=Ata&prop=images&format=json', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(body);
  });
});
