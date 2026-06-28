const fs = require('fs');

const version = "5月28日アップデートのお知らせ";
const oldVersion = "5.28";

const newPatches = [
  {
    "version": version,
    "change_type": "adjust",
    "hero_name": "超流大乱闘",
    "hero_name_en": "Super Frenzy",
    "description": "天賦「絶命の力」に不具合が確認されたため、一時的に獲得を制限させていただいております。修正完了までしばらくお待ちください。ご不便をおかけしますことを深くお詫び申し上げます。",
    "description_en": "Due to a confirmed issue with the 'Fatal Power' talent, acquisition has been temporarily restricted. We apologize for the inconvenience and ask for your patience until it is fixed.",
    "is_hero": false,
    "id": `patch_5_28_system_1`
  },
  {
    "version": version,
    "change_type": "new",
    "hero_name": "その他のイベント",
    "hero_name_en": "Other Events",
    "description": "無双祈願・孫悟空\nイベント内容：孫悟空の新無双スキン「無相」が期間限定で登場！イベントに参加して、大量の限定カスタマイズアイテムをゲットしよう！さらに、イベント画面初回確認時に「ウィッシュコイン×1」をプレゼント！このチャンスをお見逃しなく！\nイベント期間：6月5日～7月5日（UTC±0）\n\nスター祈願\nスター祈願のラインナップ更新！孔明のスターレジェンドスキン「蒼霊の仙客」新登場！今までのラインナップも、引き続きイベント交換ショップにて交換可能！\n\n上官婉児のスキン「花時雨」\n恵みの雨が降り、万物が光り輝く！上官婉児の新スキン「花時雨」登場！\nイベント詳細：\n5月29日～6月4日の初週は20％OFFセール開催！定価バウチャー×888のスキンがバウチャー×710で購入可能！6月5日～6月27日の期間中は通常価格での販売となります。このチャンスをお見逃しなく！\nイベントポータル：ショップ-スキン\n\nガチャ10回でレジェンドスキン確定\nイベント内容：バウチャーでガチャを引こう！10回引くと必ずすべてのイベント報酬を獲得！運が良ければ、わずかバウチャー×10で王昭君のレジェンドスキン「月下の織姫」やアーサーのレジェンドスキン「マジックチェイス」をゲットできるかも！？運試しに挑戦しよう！\nイベント開始日：6月2日（UTC±0）",
    "description_en": "Sun Wukong's new Mythic skin 'Formless' available for a limited time.\nZhuge Liang's Star Legend skin 'Azure Spirit Immortal' added to Star Wish.\nShangguan Wan'er's new skin 'Flower Rain' released, 20% off for the first week.\n10-draw Gacha guarantees all event rewards, with a chance to get Legend skins for Wang Zhaojun or Arthur.",
    "is_hero": false,
    "id": `patch_5_28_system_2`
  },
  {
    "version": version,
    "change_type": "buff",
    "hero_name": "魯班7号",
    "hero_name_en": "Luban No.7",
    "description": "「数値強化」\nスキルクールダウン短縮\nパッシブ「火力制圧」\n基本ダメージ：\n調整前：50～100（+ターゲットの最大HPの4%）\n調整後：70～140（+ターゲットの最大HPの4.5%）\nスキル1「フグ爆弾」\nクールダウン：\n調整前：7秒\n調整後：7.5秒（スキルLv.ごとに-0.3秒）\nスキル2「シャークキャノン」\nクールダウン：\n調整前：15秒（スキルLv.ごとに-1.2秒）\n調整後：12秒（スキルLv.ごとに-0.6秒）\nスキル3「空中支援」\nクールダウン：\n調整前：40秒（スキルLv.ごとに-10秒）\n調整後：35秒（スキルLv.ごとに-7.5秒）",
    "description_en": "Skill Cooldown Reductions & Damage Buff\nPassive: Base damage increased from 50-100 (+4% max HP) to 70-140 (+4.5% max HP).\nSkill 1: Cooldown adjusted from 7s to 7.5s (-0.3s/lv).\nSkill 2: Cooldown reduced from 15s (-1.2s/lv) to 12s (-0.6s/lv).\nSkill 3: Cooldown reduced from 40s (-10s/lv) to 35s (-7.5s/lv).",
    "is_hero": true,
    "id": `patch_5_28_hero_112`,
    "hero_id": "hero_112"
  },
  {
    "version": version,
    "change_type": "buff",
    "hero_name": "夏侯惇",
    "hero_name_en": "Xiahou Dun",
    "description": "「数値強化」\nスキルダメージ強化\nスキル2「竜巻一閃」\n基本ダメージ：\n調整前：250（スキルLv.ごとに+50）（+追加物理攻撃の80％）\n調整後：300（スキルLv.ごとに+60）（+追加物理攻撃の100％）\n通常攻撃の追加ダメージ：\n調整前：130（スキルLv.ごとに+26）（+追加物理攻撃の40％）\n調整後：150（スキルLv.ごとに+30）（+追加物理攻撃の45％）\nスキル3「放縦の鎌」\nチェーンブレイドの発動モーションを短縮",
    "description_en": "Skill Damage Buffs\nSkill 2: Base damage and Extra PATK scaling increased. Enhanced basic attack damage increased.\nSkill 3: Reduced the cast animation time of the chain blade.",
    "is_hero": true,
    "id": `patch_5_28_hero_028`,
    "hero_id": "hero_028"
  },
  {
    "version": version,
    "change_type": "adjust",
    "hero_name": "妲己",
    "hero_name_en": "Daji",
    "description": "「数値調整」\nスキルクールダウン調整\nスキル1「ソウルショック」\nクールダウン：\n調整前：5秒\n調整後：5秒（スキルLv.ごとに-0.2秒）\nスキル2「アイドルチャーム」\nクールダウン：\n調整前：9秒（スキルLv.ごとに-0.4秒）\n調整後：10秒（スキルLv.ごとに-0.4秒）",
    "description_en": "Skill Cooldown Adjustments\nSkill 1: Cooldown adjusted from 5s to 5s (-0.2s/lv).\nSkill 2: Cooldown increased from 9s (-0.4s/lv) to 10s (-0.4s/lv).",
    "is_hero": true,
    "id": `patch_5_28_hero_109`,
    "hero_id": "hero_109"
  },
  {
    "version": version,
    "change_type": "nerf",
    "hero_name": "韓信",
    "hero_name_en": "Han Xin",
    "description": "「数値調整」\nスキルダメージ調整\nスキル1「無情な突撃」\n基本ダメージ：\n調整前：350（スキルLv.ごとに+70）（+追加物理攻撃の75％）\n調整後：250（スキルLv.ごとに+50）（+追加物理攻撃の85％）\nスキル2「背水の陣」\n追加ダメージ：\n調整前：150（スキルLv.ごとに+30）（+追加物理攻撃の50％）\n調整後：120（スキルLv.ごとに+24）（+追加物理攻撃の50％）\nクールダウン：\n調整前：5秒\n調整後：6秒（スキルLv.ごとに-0.2秒）",
    "description_en": "Skill Damage Adjustments\nSkill 1: Base damage reduced, scaling slightly increased.\nSkill 2: Additional damage reduced. Cooldown increased from 5s to 6s (-0.2s/lv).",
    "is_hero": true,
    "id": `patch_5_28_hero_016`,
    "hero_id": "hero_016"
  },
  {
    "version": version,
    "change_type": "adjust",
    "hero_name": "不具合の修正と最適化",
    "hero_name_en": "Fixes & Optimizations",
    "description": "1．魯班7号のパッシブスキルの敵ヒーローに与える基本ダメージが、レベルアップに伴って増加しない不具合を修正\n2．超流大乱闘モードにおいて、天賦「ラッシュアタック」のスタン効果がヒーローのスーパーアーマー状態を中断できる不具合を修正\n3．超流大乱闘モードの特定の条件下において、チーシャの戟による通常攻撃でダメージを与えられない不具合を修正",
    "description_en": "1. Fixed Luban No.7's passive base damage not increasing with level.\n2. Fixed 'Rush Attack' talent interrupting Super Armor in Super Frenzy.\n3. Fixed Cirrus's halberd basic attacks dealing no damage under certain conditions in Super Frenzy.",
    "is_hero": false,
    "id": `patch_5_28_system_3`
  }
];

const patchesData = JSON.parse(fs.readFileSync('./src/data/patches.json', 'utf8'));

// Filter out old 5.28 patches
const filteredPatches = patchesData.filter(p => p.version !== oldVersion && p.version !== version);

// We need to keep patches sorted somewhat logically. But right now we'll just insert at the top.
// Actually, to keep them in order, maybe we should push it into the array but let PatchTable sort them.
// PatchTable does its own sorting, so order in the file matters less, but let's just prepend.
// But wait, the older patches should be after the newer patches.
// 6.19 is at the top, then 6.17, then 5.28.
// Since we prepend, 5.28 will be at the very top.
// Let's find the correct index to insert. "5月28日" should come after "6月17日".
// We can just append them after "6月17日". Let's find the index of the first item that is older than 5.28.
// Since we only have a few, we can just filter and append.
const insertIndex = filteredPatches.findIndex(p => p.version && p.version.includes("5.14") || p.version === "5.14");
let updatedPatches;
if (insertIndex !== -1) {
  updatedPatches = [
    ...filteredPatches.slice(0, insertIndex),
    ...newPatches,
    ...filteredPatches.slice(insertIndex)
  ];
} else {
  updatedPatches = [...filteredPatches, ...newPatches];
}

fs.writeFileSync('./src/data/patches.json', JSON.stringify(updatedPatches, null, 2));

console.log('Successfully updated patches.json!');

// Now update patch_meta.json
const patchMetaPath = './src/data/patch_meta.json';
const patchMetaData = JSON.parse(fs.readFileSync(patchMetaPath, 'utf8'));

const targetMetaIndex = patchMetaData.findIndex(m => m.version === oldVersion || m.version === version);

if (targetMetaIndex !== -1) {
  patchMetaData[targetMetaIndex].version = version;
  patchMetaData[targetMetaIndex].summary = "5月28日アップデートのお知らせ";
  patchMetaData[targetMetaIndex].details = [
    "孫悟空の新無双スキンや各種イベントが開始",
    "超流大乱闘の「絶命の力」一時取得制限",
    "魯班7号、夏侯惇、妲己の強化、韓信の弱体化",
    "魯班7号のパッシブダメージなどの不具合修正"
  ];
  fs.writeFileSync(patchMetaPath, JSON.stringify(patchMetaData, null, 2));
  console.log('Successfully updated patch_meta.json!');
} else {
  console.log('Could not find meta for version 5.28');
}
