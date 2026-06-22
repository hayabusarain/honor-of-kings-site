const fs = require('fs');
const path = require('path');

const jaPath = path.join(__dirname, '../messages/ja.json');
const enPath = path.join(__dirname, '../messages/en.json');

// Helper to modify JSON preserving order roughly
function updateTranslations(filePath, isJa) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // 1. Sidebar
  if (data.Sidebar) {
    data.Sidebar.runes = isJa ? "ルーン一覧" : "Runes";
  }
  
  // 2. Home
  if (data.Home) {
    data.Home.qaRunesTitle = isJa ? "ルーン一覧" : "Runes List";
    data.Home.qaRunesDesc = isJa ? "ルーン（キーストーン・一般）の効果詳細。" : "Detailed effects for all keystones and minor runes.";
  }
  
  // 3. Runes
  data.Runes = isJa ? {
    title: "ルーンデータベース",
    subtitle: "ワイルドリフトの全ルーンの効果詳細を確認できます。",
    searchPlaceholder: "ルーン名や効果で検索...",
    all: "すべて",
    keystone: "キーストーン",
    domination: "覇道",
    resolve: "不滅",
    precision: "栄華",
    inspiration: "天啓",
    effects: "効果",
    cooldown: "クールダウン",
    detailTitle: "ルーン詳細"
  } : {
    title: "Runes Database",
    subtitle: "Check the detailed effects of all keystones and runes in Wild Rift.",
    searchPlaceholder: "Search by rune name or effect...",
    all: "All",
    keystone: "Keystones",
    domination: "Domination",
    resolve: "Resolve",
    precision: "Precision",
    inspiration: "Inspiration",
    effects: "Effects",
    cooldown: "Cooldown",
    detailTitle: "Rune Details"
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated translations in ${path.basename(filePath)}`);
}

updateTranslations(jaPath, true);
updateTranslations(enPath, false);
