const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.json') || file.endsWith('.css') || file.endsWith('.md')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src').concat(walk('./messages'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/チャンピオン/g, 'ヒーロー');
  content = content.replace(/ルーン/g, 'アルカナ');
  content = content.replace(/サモナースペル/g, 'サモナースキル');
  content = content.replace(/スペル/g, 'スキル');
  content = content.replace(/ワイルドリフト/g, 'オナーオブキングス');
  content = content.replace(/WildRiftHub/g, 'HonorOfKingsHub');
  content = content.replace(/ワイリフ/g, 'HoK');

  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
