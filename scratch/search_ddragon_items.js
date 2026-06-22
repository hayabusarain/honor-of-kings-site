const https = require('https');

https.get('https://ddragon.leagueoflegends.com/cdn/14.24.1/data/en_US/item.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const items = JSON.parse(data).data;
    Object.keys(items).forEach(id => {
      const item = items[id];
      if (item.name.toLowerCase().includes('hubris')) {
        console.log(`Found Hubris item: ID ${id}, name: ${item.name}, image: ${item.image.full}`);
      }
    });
  });
});
