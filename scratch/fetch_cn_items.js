const fs = require('fs');
const https = require('https');

https.get('https://pvp.qq.com/web201605/js/item.json', (res) => {
  let data = [];
  res.on('data', (chunk) => {
    data.push(chunk);
  });
  res.on('end', () => {
    const buffer = Buffer.concat(data);
    let text;
    try {
      const decoder = new TextDecoder('gbk');
      text = decoder.decode(buffer);
    } catch (e) {
      text = buffer.toString('utf8');
    }
    fs.writeFileSync('./scratch/cn_items.json', text, 'utf8');
    console.log('Saved to scratch/cn_items.json');
  });
}).on('error', (err) => {
  console.log('Error: ', err.message);
});
