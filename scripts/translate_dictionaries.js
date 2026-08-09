 
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');

const itemNames = {
  "铁剑": "アイアンソーチE",
  "匕馁E": "ダガー",
  "搏�E拳奁E": "コンバットグローチE",
  "吸血之镰": "ヴァンパイアサイズ",
  "雷鸣刁E": "雷鳴の刁E",
  "风暴巨剁E": "スト�EムソーチE",
  "日冁E": "コロチE",
  "狂暴双�E": "狂暴の双�E",
  "陨昁E": "メチE��",
  "碎星锤": "スターブレイカー",
  "末丁E": "ドゥームズチE��",
  "名�E·司命": "名�E・司命",
  "寒霜袭侵": "フロストストライク",
  "速�E之枪": "クイチE��ランス",
  "制裁之�E": "制裁�E刁E",
  "泣血之�E": "ブラチE��ブレイチE",
  "无尽战�E": "インフィニティブレイチE",
  "宗师之力": "マスターフォース",
  "闪电匕馁E": "ライトニングダガー",
  "影刁E": "シャドウブレイチE",
  "暗影战斧": "ダークアチE��ス",
  "强老E��冁E": "破軁E",
  "纯净苍穹": "ピュアスカイ",
  "逐日之弁E": "チE��ブレイクボウ",
  "破魔�E": "破魔�E刀",
  "穿云弁E": "ピアスクラウチE",
  "仁老E��晁E": "ド�Eンブレイカー",
  "咒术典籁E": "スペルブック",
  "蓝宝石": "サファイア",
  "圣老E���E": "賢老E�E法�E",
  "大棁E": "ラージロチE��",
  "血族之书": "吸血鬼の書",
  "炽热支酁E": "ブレイズドミネ�Eター",
  "梦魁E��牙": "ナイトメアファング",
  "虚无法杖": "ヴォイドスタチE��",
  "博学老E��态E": "サヴァンの怒り",
  "辉月": "スプレンダー",
  "回响之杖": "エコースタチE��",
  "凝�E之�E": "フロストブレス",
  "痛苦面具": "ペインマスク",
  "巫术法杖": "ウィチE��スタチE��",
  "圣杯": "ホ�Eリーグレイル",
  "时之颁E��": "時�E預言",
  "贤老E��书": "賢老E�E天書",
  "噬神之书": "ゴチE��イーター",
  "红玛瑙": "レチE��アゲーチE",
  "币E��": "クロースアーマ�E",
  "抗魔披飁E": "マジチE��マンチE",
  "力量腰带": "パワーベルチE",
  "神隐斗篷": "シャドウクローク",
  "雪山圁E��": "スノウシールチE",
  "守护老E��铠": "ガーチE��アンメイル",
  "反伤刺甲": "ソーンアーマ�E",
  "血魔之态E": "ブラチE��フューリー",
  "红莲斗篷": "クリムゾンクローク",
  "霸老E��裁E": "要E��E�E重裁E",
  "冰霜�E击": "フロストインパクチE",
  "不祥征�E": "不吉の予�E",
  "不死鸟之眼": "フェニックスアイ",
  "魔女斗篷": "魔女のクローク",
  "极寒风暴": "極寒�E嵁E",
  "冰痕之握": "アイスグリチE�E",
  "贤老E��庁E��": "賢老E�E加護",
  "暴烈之甲": "フューリーメイル",
  "神速之靴": "スピ�EドブーチE",
  "影忍之足": "忍老E��ーチE",
  "抵抗之靴": "レジストブーチE",
  "冷静之靴": "クールブ�EチE",
  "秘法之靴": "ソーサリーブ�EチE",
  "急速�E靴": "ラピッドブーチE",
  "疾步之靴": "スウィフトブ�EチE",
  "狩猎宽刁E": "ハンターブレーチE",
  "游击弯刀": "ゲリラマチェーチE",
  "巡守利斧": "パトロールアチE��ス",
  "追击刀锁E": "チェイスブレーチE",
  "符斁E��剁E": "ルーンソーチE",
  "巨人之握": "ジャイアントグリチE�E",
  "贪婪之噬": "グリードファング",
  "日暮之流E": "サンセチE��ストリーム",
  "金色圣剁E": "ゴールチE��ソーチE",
  "怒龙剑盾": "ドラゴンスケイル",
  "荁E��护扁E": "ソーンガントレチE��",
  "永夜守护": "エターナルガーチE",
  "原�E遗珠": "オリジンパ�Eル",
  "侵掠·怒魁E": "インベ�Eド�Eソウル",
  "徐行·凛�E": "スロウ・ウィンター",
  "迁E��·日渁E": "ラピッド�Eサン",
  "不动·天穹": "スタチE��チE��・スカイ",
  "难知·月祁E": "ミスチE��ー・ムーン",
  "魔道之石": "マジチE��スト�Eン",
  "云�E木": "クラウドウチE��",
  "迁E��长矁E": "スウィフトスピア",
  "破茧之衣": "コクーンクローク",
  "血魂�E": "ブラチE��ソウル",
  "逐飁E": "ウィンドチェイサー",
  "旭日初�E": "ド�EンライチE",
  "学证E��石": "スカラージェム",
  "极影": "エクストリームシャドウ",
  "近卫": "ロイヤルガーチE",
  "极影·救赁E": "極影・救渁E",
  "极影·星況E": "極影・星況E",
  "极影·奔狼": "極影・奔狼",
  "极影·形昭": "極影・形昭",
  "近卫·救赁E": "近衛�E救渁E",
  "近卫·星況E": "近衛�E星況E",
  "近卫·奔狼": "近衛�E奔狼",
  "近卫·形昭": "近衛�E形昭",
  "急速铠甲": "ラピッドアーマ�E",
  "秘法残页": "ミスチE��チE��ペ�Eジ",
  "陁E��之羽": "エンチャントフェザー",
  "允E��结晶": "オリジンクリスタル",
  "天地石": "ヘブンアーススト�Eン",
  "精钢锻刀": "スチ�EルブレーチE",
  "玛瑙护忁E��": "アゲートミラー",
  "幽影袖箭": "シャドウダーチE"
};

const arcanaNames = {
  "圣人": "聖人", "传承": "伝承", "异变": "異夁E", "纷亁E": "紛亁E", "无叁E": "無叁E", "宿命": "宿命", "梦魁E": "夢魁E", "凶允E": "凶允E", "祸溁E": "禍溁E", "红朁E": "紁E��",
  "长甁E": "長甁E", "贪婪": "強欲", "夺萁E": "奪萁E", "兽痁E": "獣痁E", "冥想": "瞑想", "繁荣": "繁栁E", "轮囁E": "輪廻", "谁E��": "調咁E", "隐匿": "隠匿", "狩猁E": "狩猁E",
  "霸老E": "要E��E", "坁E��": "坁E��", "虚空": "虚空", "灵山": "霊山", "献祭": "献祭", "鹰眼": "鷹の目", "忁E��": "忁E��", "怜悯": "憐�E", "敬畁E": "敬畁E", "回声": "反響",
  // 1級�E2級アルカチE  "衰败": "衰弱", "暴戾": "暴虁E", "荁E��E": "茨", "风暴": "嵁E", "戒征E": "戒征E", "阳炁E": "陽炁E", "惩戁E": "懲戁E", "狂热": "狂�E", "气数": "気数", "刹那": "刹那", 
  "复苏": "蘁E��", "渴血": "渁E��", "吞噬": "貪飁E", "正乁E": "正義", "滋生": "滋生", "急敁E": "応急", "铁躯": "鉁E��", "无畁E": "無畁E", "奁E��": "奁E��", "庁E��": "庁E��", 
  "憎�E": "憎悪", "侵蚀": "侵飁E", "潜�E": "潜在", "野性": "野性", "致命": "致命", "恐惧": "恐态E", "振奁E": "奮起", "拯敁E": "救助", "一闪": "一閁E", "信念": "信念", 
  "饮血": "飲血", "转换": "転揁E", "强健": "強健", "感庁E": "感忁E", "绽放": "開花", "神送E": "神送E", "贯穿": "貫送E", "破魁E": "破魁E", "风态E": "風态E", "收割": "収穫", 
  "崩坁E": "崩壁E", "突迁E": "突E��", "白刁E": "白刁E", "霁E�E": "霁E��", "痛苦": "苦痁E", "践踁E": "蹂躁E", "生长": "成長", "愈合": "癒着", "刚毁E": "剛毁E", "吸收": "吸叁E", 
  "坚壁E": "堁E��E", "幻盾": "幻盾", "破甲": "破甲", "洞寁E": "洞寁E", "勁E��E": "勁E��E", "斗忁E": "闘忁E", "猛攻": "猛攻", "活劁E": "活劁E", "治疁E": "治癁E", "疾衁E": "疾走", 
  "穿刺": "穿刺", "专注": "専忁E", "应激": "応激"
};

const summonerNames = {
  "惩击": "スマイチE", "终绁E": "イグナイチE", "狂暴": "フレンジー", "疾跁E": "ゴースチE", "治疗术": "ヒ�Eル", "干扰": "チE��スターチE", "晕眩": "スタン", "净匁E": "クレンズ", "弱匁E": "ウィークン", "闪现": "フラチE��ュ", "传送E": "チE��ポ�EチE",
  "汁E��为兵·辁E��": "ミニオン化�Eサポ�EチE", "汁E��为兵·法币E": "ミニオン化�Eメイジ", "汁E��为兵·战坦": "ミニオン化�Eタンク", "汁E��为兵·封E��": "ミニオン化�Eマ�Eクスマン", "汁E��为兵·刺客": "ミニオン化�Eアサシン"
};

const dictDesc = {
  "唯一被动": "ユニ�EクパッシチE",
  "唯一主动": "ユニ�EクアクチE��チE",
  "被动": "パッシチE",
  "主动": "アクチE��チE",
  "物琁E��击劁E": "物琁E��撁E", "物琁E��击": "物琁E��撁E",
  "法术攻击劁E": "魔法攻撁E", "法术攻击": "魔法攻撁E",
  "最大生命": "最大HP", "生命值": "HP",
  "最大法力": "最大マナ", "法力值": "マナ",
  "物琁E��御劁E": "物琁E��御", "物琁E��御": "物琁E��御", "护甲": "物琁E��御",
  "法术防御劁E": "魔法防御", "法术防御": "魔法防御", "魔抗": "魔法防御",
  "移动速度": "移動速度", "移送E": "移動速度",
  "攻击速度": "攻撁E��度", "攻送E": "攻撁E��度", "攻速加戁E": "攻撁E��度",
  "冷却缩凁E": "CD短縮", "冷却": "CD短縮",
  "暴击玁E": "クリチE��カル玁E", "暴击效果": "クリチE��カルダメージ", "暴击": "クリチE��カル",
  "物琁E��血": "物琁E��イフスチE��ール", "法术吸血": "魔法吸叁E", "吸血": "ライフスチE��ール",
  "物琁E��送E": "物琁E��送E", "法术穿送E": "魔法貫送E",
  "霸佁E": "スーパ�Eアーマ�E", "位移": "ブリンク", "控制": "行動阻害(CC)",
  "眩晁E": "スタン", "击飁E": "ノックアチE�E", "沉黁E": "サイレンス", "减送E": "スロウ",
  "护盾": "シールチE",
  "真实伤害": "確定ダメージ", "真伤": "確定ダメージ",
  "生命回夁E": "HP回復", "毁E秒回血": "5秒毎HP回復", "毁E秒回蓁E": "5秒毎�Eナ回復",
  "普攻": "通常攻撁E", "普通攻击": "通常攻撁E", "技能": "スキル",
  "英雁E": "ヒ�Eロー", "野怪": "モンスター", "兵线": "ミニオン", "防御塁E": "タワー",
  "额夁E": "追加", "持续": "持綁E", "冷却时间": "クールダウン",
  "法术伤害": "魔法ダメージ", "物琁E��害": "物琁E��メージ"
};

function replaceAllDesc(text) {
  if (!text) return text;
  let t = text;
  // 長ぁE��のから置換するためにキーを長さ頁E��ソーチE  const keys = Object.keys(dictDesc).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    t = t.replace(new RegExp(k, 'g'), dictDesc[k]);
  }
  return t;
}

// 1. Items
const itemsPath = path.join(DATA_DIR, 'hok_items.json');
if (fs.existsSync(itemsPath)) {
  const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
  items.forEach(item => {
    // Already has English keys like name, stats, passive because we ran the previous script
    // We just need to translate the values that were missed.
    // Wait, the previous script replaced 'item_name' with 'name' and we ran it, so they already have 'name'.
    // BUT wait, let me check the keys in the current JSON.
    if (itemNames[item.name]) {
      item.name = itemNames[item.name];
    } else {
      // Maybe it was already translated? Or it's untranslated
      if (itemNames[item.nameEn] || itemNames[item.nameCn]) {
        item.name = itemNames[item.nameCn] || item.name;
      }
    }
    
    // Some values might still have Chinese.
    item.stats = replaceAllDesc(item.stats);
    item.passive = replaceAllDesc(item.passive);
  });
  fs.writeFileSync(itemsPath, JSON.stringify(items, null, 2));
}

// 2. Arcanas
const arcanasPath = path.join(DATA_DIR, 'hok_arcanas.json');
if (fs.existsSync(arcanasPath)) {
  const arcanas = JSON.parse(fs.readFileSync(arcanasPath, 'utf8'));
  arcanas.forEach(arc => {
    if (arcanaNames[arc.name]) {
      arc.name = arcanaNames[arc.name];
    }
    arc.stats = replaceAllDesc(arc.stats);
  });
  fs.writeFileSync(arcanasPath, JSON.stringify(arcanas, null, 2));
}

// 3. Summoners
const summonersPath = path.join(DATA_DIR, 'hok_summoners.json');
if (fs.existsSync(summonersPath)) {
  const summoners = JSON.parse(fs.readFileSync(summonersPath, 'utf8'));
  summoners.forEach(s => {
    if (summonerNames[s.name]) {
      s.name = summonerNames[s.name];
    }
    s.description = replaceAllDesc(s.description);
  });
  fs.writeFileSync(summonersPath, JSON.stringify(summoners, null, 2));
}

// 4. Heroes
// Hero names were mostly translated already by previous script using heroNames mapping, but just in case we can refine it.
// The previous script already mapped "廉颁E -> "廉頁E which is fine.

console.log("Translation applied successfully!");
