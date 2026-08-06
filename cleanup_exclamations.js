const fs = require('fs');

const path = 'public/data/skills/ja.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const keys = Object.keys(data);
const half = Math.floor(keys.length / 2);

let replacedCount = 0;

for (let i = half; i < keys.length; i++) {
  const h = data[keys[i]];
  const s = h.strategy;
  if (!s) continue;
  
  let modified = false;

  ['earlyGame', 'midGame', 'lateGame', 'teamfight'].forEach(phase => {
    if (s[phase]) {
      let text = s[phase];
      
      // Clean up enthusiastic endings
      text = text.replace(/狙おう！/g, '狙います。');
      text = text.replace(/広げよう！/g, '広げましょう。');
      text = text.replace(/溶かせ！/g, 'フォーカスします。');
      text = text.replace(/制圧しろ！/g, '制圧しましょう。');
      text = text.replace(/！/g, '。');
      
      // Remove generic AI sentences that might be left
      text = text.replace(/戦意をしっかりとへし折りましょう。/g, '戦闘を有利に進めましょう。');
      text = text.replace(/スマートに、そして大胆に戦いましょう。/g, '');

      if (text !== s[phase]) {
        s[phase] = text.trim();
        modified = true;
      }
    }
  });

  if (modified) {
    replacedCount++;
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log(`Further cleaned up text for ${replacedCount} heroes.`);
