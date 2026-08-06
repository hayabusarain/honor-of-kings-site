const fs = require('fs');

const path = 'public/data/skills/ja.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const keys = Object.keys(data);
const half = Math.floor(keys.length / 2);

const replacements = [
  {
    regex: /クラッシュレーンの猛者として、(.+?)の序盤はレーンの主導権を握り、効率的なトレードを行うことが全てです。/g,
    replace: '序盤の$1はレーンの主導権を握り、効率的なトレードを行うことが重要です。'
  },
  {
    regex: /序盤は(.+?)がミッドレーンを支配することが極めて重要です。/g,
    replace: '序盤は$1がミッドレーンを支配することが重要です。'
  },
  {
    regex: /中盤戦に突入すると、(.+?)は凄まじいパワースパイクを迎えます！/g,
    replace: '中盤の$1はパワースパイクを迎えます。'
  },
  {
    regex: /絶え間ないマップへの意識とアグレッシブなマクロの動きで、敵チームを完全に息詰まらせましょう！/g,
    replace: 'マップ意識とマクロの動きで敵にプレッシャーを与えましょう。'
  },
  {
    regex: /混沌を極める終盤戦では、ミスのない完璧なポジショニングが全てを決定します。/g,
    replace: '終盤戦はポジショニングが重要です。'
  },
  {
    regex: /チームと固く連携し、作戦を遂行するための「最高の一瞬」を待ち構えましょう。/g,
    replace: 'チームと連携し、エンゲージのタイミングを待ちます。'
  },
  {
    regex: /息の合った完璧なエンゲージ、あるいは敵のキーマンを一人キャッチするだけで、一瞬にして敵陣を壊滅させ輝かしい勝利を掴むことができます。スマートに、そして大胆に戦いましょう！/g,
    replace: '的確なエンゲージや敵のキャリーをキャッチすることで、集団戦を有利に進められます。'
  },
  {
    regex: /集団戦が勃発した瞬間、(.+?)は自身の役割を完璧に遂行しなければなりません！/g,
    replace: '集団戦では$1の役割を果たすことが重要です。'
  },
  {
    regex: /ピンポイントの精度でスキルを命中させ、敵の戦意を完全にへし折りましょう！/g,
    replace: '的確にスキルを命中させ、戦闘を有利に進めましょう。'
  },
  {
    regex: /ここでの忍耐とポジショニングが、後半戦で誰も止められない怪物へと変貌する鍵となります！/g,
    replace: 'ここでの忍耐とポジショニングが、後半戦での活躍の鍵となります。'
  },
  {
    regex: /チームの頼れる絶対的なフロントライナーを目指しましょう！/g,
    replace: 'チームのフロントライナーとしての役割を果たしましょう。'
  },
  {
    regex: /リバーの視界を確保し、ジャングラーのサポートやサイドレーンへのロームを積極的に狙いましょう！/g,
    replace: 'リバーの視界を確保し、ジャングラーのサポートやサイドレーンへのロームを狙いましょう。'
  },
  {
    regex: /完成したコアアイテムの力を武器に、有利な集団戦を強制します。/g,
    replace: '完成したコアアイテムを活かし、有利な集団戦を起こしましょう。'
  },
  {
    regex: /序盤の(.+?)はファームレーンでのスケールアップが最優先です。ミニオンのラストヒットを完璧に取りこぼさず、ゴールドとアイテムの完成を急ぎましょう。/g,
    replace: '序盤の$1はファームレーンでのスケールアップが優先です。ミニオンのラストヒットを取り、ゴールドとアイテムの完成を急ぎましょう。'
  },
  {
    regex: /ここでの忍耐とポジショニングが、後半戦で誰も止められない怪物へと変貌する鍵となります！/g,
    replace: 'ここでの忍耐とポジショニングが後半戦の鍵となります。'
  },
  {
    regex: /凄まじい/g,
    replace: '大きな'
  },
  {
    regex: /完全に/g,
    replace: 'しっかり'
  },
  {
    regex: /完璧に/g,
    replace: '確実に'
  },
  {
    regex: /極めて重要/g,
    replace: '重要'
  }
];

let replacedHeroesCount = 0;

for (let i = half; i < keys.length; i++) {
  const h = data[keys[i]];
  const s = h.strategy;
  
  if (!s) continue;
  
  let modified = false;

  ['earlyGame', 'midGame', 'lateGame', 'teamfight'].forEach(phase => {
    if (s[phase]) {
      let text = s[phase];
      replacements.forEach(r => {
        text = text.replace(r.regex, r.replace);
      });
      if (text !== s[phase]) {
        s[phase] = text;
        modified = true;
      }
    }
  });

  if (modified) {
    replacedHeroesCount++;
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log(`Successfully processed and refined strategy texts for ${replacedHeroesCount} heroes in the second half.`);
