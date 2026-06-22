const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

async function findIcons() {
  const urls = [
    'https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/15410.png',
    'https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/15411.png',
    'https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/15412.png',
    'https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/15440.png',
    'https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/15413.png',
  ];
  for (const url of urls) {
    const exists = await checkUrl(url);
    console.log(`${url}: ${exists}`);
  }
}

findIcons();
