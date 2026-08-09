 
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const https = require('https');
const path = require('path');

const API_URL = 'https://pvp.qq.com/web201605/js/ming.json';
const OUTPUT_FILE = path.join(__dirname, '../src/data/hok_arcanas.json');

const translations = {
  '法术攻击力': '魔力',
  '物理攻击力': '物理攻击',
  '物理穿透': '物理穿透',
  '法术穿透': '魔法穿透',
  '物理吸血': '物理吸血',
  '法术吸血': '魔法吸血',
  '最大生命': '最大HP',
  '冷却缩减': '冷却缩减',
  '暴击率': '暴击率',
  '暴击效果': '暴击效果',
  '物理穿透': '物理穿透',
  '攻击速度': '攻撁E��度',
  '毁E秒回血': '5秒ごとのHP回復',
  '法术防御': '魔法防御',
  '物琁E��御': '物琁E��御'
};

https.get(API_URL, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const raw = JSON.parse(data);
    const arcanas = raw.map(item => {
      let stats = item.ming_des || '';
      // Translate stats
      for (const [cn, ja] of Object.entries(translations)) {
        stats = stats.replace(new RegExp(cn, 'g'), ja);
      }
      
      return {
        id: item.ming_id,
        type: item.ming_type,
        grade: item.ming_grade,
        name: item.ming_name,
        stats: stats,
        icon: `https://game.gtimg.cn/images/yxzj/img201606/mingwen/${item.ming_id}.png`
      };
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(arcanas, null, 2));
    console.log('Saved ' + arcanas.length + ' arcanas to ' + OUTPUT_FILE);
  });
}).on('error', (e) => {
  console.error(e);
});
