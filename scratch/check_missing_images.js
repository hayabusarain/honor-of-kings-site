const fs = require('fs');
const items = JSON.parse(fs.readFileSync('./src/data/physical_items_final.json', 'utf8'));

const targets = [
  '女神の涙', 'シーン', 'ヴァンパイア セプター', 'ジール', 'キルヒアイス シャード',
  'ヌーンクィヴァー', 'リカーブ ボウ', 'B. F. ソード', 'アジリティ クローク',
  'ラスト ウィスパー', 'エクスキューショナー コーリング', 'ファージ',
  'スティンガー', 'ヘクスドリンカー', 'コールフィールド ウォーハンマー'
];

targets.forEach(name => {
  const item = items.find(i => i.nameJa === name);
  if (item) {
    console.log(`${name} => ${item.image}`);
  } else {
    console.log(`${name} => Not found in database`);
  }
});
