const fs = require('fs');

const version = "6月19日アップデートのお知らせ";
const oldVersion = "6.19";

const newPatches = [
  {
    "version": version,
    "change_type": "buff",
    "hero_name": "デーヴァラ",
    "hero_name_en": "Devara",
    "description": "【数値強化】\nステータスの問題を修正し、スキルのクールダウンを短縮しました。\n\n基礎ステータス：\n基礎ステータスが想定より低くなっていた問題を修正しました。\n\nスキル1 ― 雷駆継承\nクールダウン：\n調整前：9秒（スキルレベルごとに-0.4秒）\n調整後：8秒（スキルレベルごとに-0.3秒）\n\nスキル2 ― 諦聴神罰\nクールダウン：\n調整前：9秒（スキルレベルごとに-0.4秒）\n調整後：8秒（スキルレベルごとに-0.3秒）",
    "description_en": "[Buff]\nFixed stat issues and reduced skill cooldowns.\n\nBase Stats:\nFixed an issue where base stats were lower than expected.\n\nSkill 1:\nCooldown:\nBefore: 9s (-0.4s/lv)\nAfter: 8s (-0.3s/lv)\n\nSkill 2:\nCooldown:\nBefore: 9s (-0.4s/lv)\nAfter: 8s (-0.3s/lv)",
    "is_hero": true,
    "id": `patch_6_19_hero_113_new`,
    "hero_id": "hero_113"
  },
  {
    "version": version,
    "change_type": "adjust",
    "hero_name": "その他のイベント",
    "hero_name_en": "Other Events",
    "description": "マーケット調整\n\n1.マーケット内の「ゲームキッズチェスト」の設定可能な価格帯を引き下げました。これにより、プレイヤーはより低い価格で宝箱を購入・出品できるようになります。すでに出品済み、または公示期間中の商品には影響ありません。\n\n2.新たな取引可能商品がまもなくプレビュー可能になります。今後、順次入手できるようになる予定です。",
    "description_en": "Market Adjustments\n\n1. Lowered the settable price range for 'Game Kids Chest' in the market. This allows players to buy/list chests at lower prices. Existing listings or items in the exhibition period are not affected.\n\n2. New tradable items will be available for preview soon.",
    "is_hero": false,
    "id": `patch_6_19_system_1`
  },
  {
    "version": version,
    "change_type": "adjust",
    "hero_name": "不具合の修正と最適化",
    "hero_name_en": "Fixes & Optimizations",
    "description": "一部既知の不具合を修正しました。",
    "description_en": "Fixed some known bugs.",
    "is_hero": false,
    "id": `patch_6_19_system_2`
  }
];

const patchesData = JSON.parse(fs.readFileSync('./src/data/patches.json', 'utf8'));

// Filter out old 6.19 patches
const filteredPatches = patchesData.filter(p => p.version !== oldVersion && p.version !== version);

// Insert new patches at the top
const updatedPatches = [...newPatches, ...filteredPatches];

fs.writeFileSync('./src/data/patches.json', JSON.stringify(updatedPatches, null, 2));

console.log('Successfully updated patches.json!');

// Now update patch_meta.json
const patchMetaPath = './src/data/patch_meta.json';
const patchMetaData = JSON.parse(fs.readFileSync(patchMetaPath, 'utf8'));

const targetMetaIndex = patchMetaData.findIndex(m => m.version === oldVersion || m.version === version);

if (targetMetaIndex !== -1) {
  patchMetaData[targetMetaIndex].version = version;
  patchMetaData[targetMetaIndex].summary = "6月19日アップデートのお知らせ";
  patchMetaData[targetMetaIndex].details = [
    "デーヴァラ：ステータス強化およびスキル1・2のクールダウン短縮",
    "マーケット：ゲームキッズチェストの価格帯引き下げ",
    "一部既知の不具合を修正"
  ];
  fs.writeFileSync(patchMetaPath, JSON.stringify(patchMetaData, null, 2));
  console.log('Successfully updated patch_meta.json!');
} else {
  console.log('Could not find meta for version 6.19');
}
