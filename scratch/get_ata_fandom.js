const https = require('https');
const options = {
  hostname: 'honorofkings.fandom.com',
  path: '/api.php?action=query&titles=Ata&prop=images&format=json',
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};
https.get(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(body);
  });
});
