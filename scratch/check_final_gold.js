const fs = require('fs');
const path = require('path');

const finalPath = 'C:/Users/81901/Desktop/ワイリフサイト/src/data/physical_items_final.json';
if (!fs.existsSync(finalPath)) {
  console.error('physical_items_final.json not found!');
  process.exit(1);
}

const items = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
console.log(`Total items in final JSON: ${items.length}`);

const targetNames = [
  "グレイシャル シュラウド", "波打つ鱗", "ルビー クリスタル", "クロース アーマー", "ヌルマジック マント", "シマリング スパーク",
  "ドラクター ダスクブレード", "ステラックの篭手", "インフィニティ エッジ", "キルヒアイス シャード", "モータル リマインダー",
  "マナムネ", "ムラマナ", "セレイテッド ダーク", "カル", "マルモティウスの胃袋", "マグネティック ブラスター",
  "ファントム ダンサー", "ウィッツ エンド", "エッセンス リーバー", "シールドバッシュ", "ブラッドサースター",
  "デス ダンス", "ナヴォリ クイックブレード", "ナイトエッジ", "ディヴァイン サンダラー", "毒蛇の牙", "コレクター"
];

console.log('--- Checking final JSON items matching targets ---');
targetNames.forEach(name => {
  const match = items.find(item => item.nameJa === name);
  if (match) {
    console.log(`- MATCHED: ${name} (Gold: ${match.gold}, Stats: ${match.stats.join(', ')}, Passives: ${match.passives.length})`);
  } else {
    console.log(`- NOT FOUND IN FINAL: ${name}`);
  }
});
