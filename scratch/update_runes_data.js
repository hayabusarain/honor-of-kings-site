const fs = require('fs');

const runesPath = 'src/data/runes.json';
const runes = JSON.parse(fs.readFileSync(runesPath, 'utf8'));

const updates = {
  empowerment: {
    descriptionJa: "敵チャンピオンを通常攻撃で3回連続攻撃すると、追加アダプティブダメージを与え、チャンピオンとの戦闘から離脱するまで与えるダメージが9%増加する。アダプティブダメージ: 60 - 200",
    descriptionEn: "Basic attacks on enemy champions 3 consecutive times deals 60 - 200 bonus adaptive damage and increases damage dealt by 9% until exiting combat."
  },
  ingenious_hunter: {
    descriptionJa: "アイテムスキルヘイストが20増加する。チャンピオンやエピックモンスターをキルまたはアシストするたびに、アイテムスキルヘイストを追加で5獲得する（最大5回スタックする）。",
    descriptionEn: "Gain 20 Item Ability Haste. Gain an additional 5 Item Ability Haste for each unique champion or epic monster takedown, stacking up to 5 times (for a maximum of 45 Item Ability Haste)."
  },
  brutal: {
    descriptionJa: "敵チャンピオンへの通常攻撃が、レベルに応じて12 - 19の追加アダプティブダメージを与える。",
    descriptionEn: "Your basic attacks deal 12–19 (based on level) bonus adaptive damage on-hit to champions."
  },
  legend_tenacity: {
    descriptionJa: "行動妨害耐性が3%、スロウ耐性が3%増加する。モンスター、敵チャンピオン、ミニオンからキルまたはアシストを奪うと、追加で行動妨害耐性が最大15%、スロウ耐性が20%増加する。",
    descriptionEn: "Gain 3% Tenacity and 3% Slow Resist. Earn progress toward Legend stacks for every champion takedown, epic monster takedown, large monster kill, and minion kill, up to an additional 15% Tenacity and 20% Slow Resist."
  },
  hextech_flashtraption: {
    descriptionJa: "フラッシュがクールダウンに入ると「ヘクスフラッシュ」に置き換わる。チャージ時間（最大2秒）に応じた距離をダッシュする（クールダウン25秒）。",
    descriptionEn: "While Flash is on cooldown, it is replaced by Hexflash. Channel for up to 2s to blink to a new location. Cooldown: 25s."
  },
  futures_market: {
    descriptionJa: "借金をしてアイテムを購入できるようになる。借金限度額：150 + 5/分。借金手数料：1回につき5ゴールド。",
    descriptionEn: "Enter debt to buy items. Debt limit: 150 + 5/min. Lending fee: 5 gold per item."
  },
  unshakeable: {
    descriptionJa: "物理防御と魔法防御が4%増加する。周囲の敵チャンピオン1体ごとに、物理防御と魔法防御が追加で3%増加する。周囲の敵チャンピオンの数が最大になると（最大：3）、さらにスロウ耐性が20%増加する。",
    descriptionEn: "Gain 4% Armor and Magic Resistance. Gain an additional 3% Armor and Magic Resistance for each nearby enemy champion, stacking up to 3 times. When at maximum stacks, additionally gain 20% Slow Resist."
  }
};

runes.forEach(rune => {
  if (updates[rune.id]) {
    rune.descriptionJa = updates[rune.id].descriptionJa;
    rune.descriptionEn = updates[rune.id].descriptionEn;
    console.log(`Updated description for ${rune.id} (${rune.nameJa})`);
  }
});

fs.writeFileSync(runesPath, JSON.stringify(runes, null, 2), 'utf8');
console.log(`Saved updated runes database to ${runesPath}`);
