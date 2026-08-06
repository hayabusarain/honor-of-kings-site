const fs = require('fs');
const path = './public/data/skills/ja.json';

const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
const heroIds = Object.keys(data);
const halfIndex = Math.floor(heroIds.length / 2);
const group1Ids = heroIds.slice(0, halfIndex);

let cleanedCount = 0;

function cleanAiText(text) {
  if (!text || typeof text !== 'string') return text;
  let str = text;

  // Remove theatrical AI filler phrases
  str = str.replace(/ (の|として) (猛者|絶対的な|最高|圧倒的|凄まじい) /g, ' ');
  str = str.replace(/ (として|の猛者として)、/g, 'は、');
  str = str.replace(/することが全てです。/g, 'が基本となります。');
  str = str.replace(/を目指しましょう！/g, 'を意識しましょう。');
  str = str.replace(/目指しましょう！/g, 'を狙いましょう。');
  str = str.replace(/息詰まらせましょう！/g, '有利を広げましょう。');
  str = str.replace(/へし折りましょう！/g, '無力化しましょう。');
  str = str.replace(/輝かしい勝利を掴むことができます。/g, '勝利に繋がります。');
  str = str.replace(/「最高の一瞬」を待ち構えましょう。/g, 'タイミングを見極めましょう。');
  str = str.replace(/ミスのない完璧なポジショニングが全てを決定します。/g, '慎重なポジショニングが重要です。');
  str = str.replace(/絶え間ないマップへの意識と/g, 'マップ意識を持ち、');
  str = str.replace(/スマートに、そして大胆に戦いましょう！/g, '冷静に判断してエンゲージを狙いましょう。');
  str = str.replace(/絶対に失敗は許されません。/g, '注意が必要です。');
  
  // Replace exclamation marks with clean periods
  str = str.replace(/！/g, '。');
  str = str.replace(/。。/g, '。');

  return str;
}

for (const id of group1Ids) {
  const hero = data[id];
  if (hero && hero.strategy) {
    hero.strategy.earlyGame = cleanAiText(hero.strategy.earlyGame);
    hero.strategy.midGame = cleanAiText(hero.strategy.midGame);
    hero.strategy.lateGame = cleanAiText(hero.strategy.lateGame);
    hero.strategy.teamfight = cleanAiText(hero.strategy.teamfight);
    cleanedCount++;
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Successfully naturalized ${cleanedCount} heroes in Group 1!`);
