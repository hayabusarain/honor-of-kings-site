const https = require('https');

const options = {
  hostname: 'pvp.qq.com',
  port: 443,
  path: '/web201605/herodetail/154.shtml',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
  }
};

const req = https.request(options, res => {
  let body = '';
  res.setEncoding('utf8');
  res.on('data', chunk => {
    body += chunk;
  });
  res.on('end', () => {
    const regex = /<img.*?src=[\'\"'](.*?)[\'\"'].*?>/g;
    let match;
    while ((match = regex.exec(body)) !== null) {
      if (match[1].includes('skill') || match[1].includes('154')) {
        console.log(match[1]);
      }
    }
    console.log('Done.');
  });
});

req.on('error', e => {
  console.error(e);
});

req.end();
