const fs = require('fs');
const https = require('https');
const path = require('path');

const API_URL = 'https://pvp.qq.com/web201605/js/ming.json';
const OUTPUT_FILE = path.join(__dirname, '../data/hok_arcanas.json');

const translations = {
  '法术攻击力': '魔力',
  '物理攻击力': '物理攻撃力',
  '物理穿透': '物理貫通',
  '法术穿透': '魔法貫通',
  '物理吸血': '物理吸収',
  '法术吸血': '魔法吸収',
  '最大生命': '最大HP',
  '冷却缩减': 'クールダウン短縮',
  '暴击率': 'クリティカル率',
  '暴击效果': 'クリティカルダメージ',
  '移速': '移動速度',
  '攻击速度': '攻撃速度',
  '每5秒回血': '5秒ごとのHP回復',
  '法术防御': '魔法防御',
  '物理防御': '物理防御'
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
