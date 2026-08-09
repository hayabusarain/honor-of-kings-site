 
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');

// Translation Dictionary for Stats and Descriptions
const terminologyDict = {
  "物琁E��击劁E": "物琁E��撁E",
  "物琁E��击": "物琁E��撁E",
  "法术攻击劁E": "魔法攻撁E",
  "法术攻击": "魔法攻撁E",
  "最大生命": "最大HP",
  "生命值": "最大HP",
  "最大法力": "最大マナ",
  "法力值": "最大マナ",
  "物琁E��御劁E": "物琁E��御",
  "物琁E��御": "物琁E��御",
  "护甲": "物琁E��御",
  "法术防御劁E": "魔法防御",
  "法术防御": "魔法防御",
  "魔抗": "魔法防御",
  "移动速度": "移動速度",
  "移送E": "移動速度",
  "攻击速度": "攻撁E��度",
  "攻送E": "攻撁E��度",
  "攻速加戁E": "攻撁E��度",
  "冷却缩凁E": "CD短縮",
  "暴击玁E": "クリチE��カル玁E",
  "暴击效果": "クリチE��カルダメージ",
  "物琁E��血": "物琁E��イフスチE��ール",
  "法术吸血": "魔法吸叁E",
  "物琁E��送E": "物琁E��送E",
  "法术穿送E": "魔法貫送E",
  "霸佁E": "スーパ�Eアーマ�E",
  "位移": "ブリンク",
  "控制": "CC�E�行動阻害�E�E",
  "眩晁E": "スタン",
  "击飁E": "ノックアチE�E",
  "沉黁E": "サイレンス",
  "护盾": "シールチE",
  "真实伤害": "確定ダメージ",
  "真伤": "確定ダメージ",
  "生命回夁E": "HP回復",
  "毁E秒回血": "5秒毎HP回復",
  "毁E秒回蓁E": "5秒毎�Eナ回復"
};

// Hero Names mapping (Chinese to Japanese Katakana/Kanji)
const heroNames = {
  "廉颁E": "廉頁E", "小乁E": "小喬", "赵亁E": "趙雲", "墨孁E": "墨孁E", "妲己": "妲己", "嬴政": "始皇币E",
  "孙尚馁E": "孫尚馁E", "鲁班丁E��": "魯班丁E��", "庁E��": "荘周", "刘禁E": "劉禁E", "高渐离": "高漸離",
  "阿轲": "阿軻", "钟无艳": "鍾無艶", "孙�E": "孫臁E", "扁E��E": "扁E��", "白起": "白起", "芈月": "ミ�Eユエ",
  "吕币E": "呂币E", "周瑁E": "周瑁E", "夏侯惁E": "夏侯惁E", "甁E��": "甁E��", "曹擁E": "曹擁E", "典韦": "典韁E",
  "宫本武藁E": "宮本武蔵", "李白": "李白", "马可波罁E": "マルコ・ポ�Eロ", "狁E��杰": "狁E��傑",
  "达摩": "達磨", "项羽": "頁E��", "武则天": "武剁E��", "老夫孁E": "老夫孁E", "关羽": "関羽", "貂蝉": "貂蝉",
  "安琪拁E": "アンジェラ", "程咬釁E": "程咬釁E", "露威E": "ルチE", "姜子牙": "姜子牙", "刘邦": "劉邦",
  "韩信": "韓信", "王昭吁E": "王昭吁E", "兰陵玁E": "蘭陵玁E", "花木兰": "花木蘭", "张良": "張良",
  "不知火舁E": "不知火舁E", "娜可露露": "ナコルル", "橘右京": "橘右京", "亚瑟": "アーサー",
  "孙悟空": "孫悟空", "牛魁E": "牛魔王", "后羿": "后羿", "刘夁E": "劉備", "张飁E": "張飁E",
  "李�E芳": "李�E芳", "虞姬": "虞姫", "钟馁E": "鍾馁E", "成吉思汁E": "チンギス・ハン", "杨戬": "楊戩",
  "雁E�E威E": "アチE��", "夏洛特": "シャーロチE��", "哪吁E": "哪吁E", "太乙真人": "太乙真人",
  "干封E��邪": "干封E��邪", "大乁E": "大喬", "东皇太一": "東皁E��一", "鬼谷孁E": "鬼谷孁E", "百里守约": "百里守紁E",
  "百里玄筁E": "百里玄筁E", "苏烈": "蘁E��", "梦奁E": "夢奁E", "女娲": "女媧", "明世隐": "明世隠",
  "公孙离": "公孫離", "裴擒虎": "裴擒虎", "狂铁": "狂鉄", "米莱狁E": "ミレチE��", "允E��E": "允E��E",
  "司马懿": "司馬懿", "盾山": "盾山", "伽罁E": "伽羁E", "沈梦溪": "沈夢渁E", "李信": "李信", "上官婉�E": "上官婉�E",
  "猪八戁E": "猪八戁E", "盘古": "盤古", "瑶": "瑶", "云中吁E": "雲中吁E", "曁E": "曁E", "马趁E": "馬趁E",
  "西施": "西施", "鲁班大币E": "魯班大師", "蒙犽": "蒙犽", "镁E": "鏡", "蒙恬": "蒙恬", "阿古朵": "阿古朵",
  "澁E": "瀾", "司空霁E": "司空霁E", "艾琳": "アイリーン", "云缨": "雲纁E", "金蝉": "金蝉", "暁E": "暁E", 
  "桑启": "桑啓", "戈威E": "戈婭", "海朁E": "海朁E", "赵怀省E": "趙��省E", "莱西奥": "レシオ", "姬小满": "姫小満", 
  "亚迁E": "アレイン", "朵莉亁E": "ドリア", "海诺": "ハイチE", "敖隐": "アオイン", "大司命": "大司命", 
  "蔡斁E��": "蔡斁E��", "黁E��": "黁E��", "诸葛亮": "諸葛亮", "铠": "鎧"
};

function translateText(text) {
  if (!text || typeof text !== 'string') return text;
  let t = text;
  for (const [zh, ja] of Object.entries(terminologyDict)) {
    t = t.replace(new RegExp(zh, 'g'), ja);
  }
  return t;
}

// 1. Process Items
const itemsPath = path.join(DATA_DIR, 'hok_items.json');
if (fs.existsSync(itemsPath)) {
  const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
  const newItems = items.map(item => ({
    id: item.item_id,
    name: translateText(item.item_name),
    type: item.item_type,
    price: item.price,
    totalPrice: item.total_price,
    stats: translateText(item.des1),
    passive: translateText(item.des2),
    icon: item.icon_local
  }));
  fs.writeFileSync(itemsPath, JSON.stringify(newItems, null, 2));
  console.log(`Processed ${items.length} items.`);
}

// 2. Process Arcanas
const arcanasPath = path.join(DATA_DIR, 'hok_arcanas.json');
if (fs.existsSync(arcanasPath)) {
  const arcanas = JSON.parse(fs.readFileSync(arcanasPath, 'utf8'));
  const newArcanas = arcanas.map(arcana => ({
    id: arcana.ming_id,
    type: arcana.ming_type,
    grade: arcana.ming_grade,
    name: translateText(arcana.ming_name),
    stats: translateText(arcana.ming_des),
    icon: arcana.icon_local
  }));
  fs.writeFileSync(arcanasPath, JSON.stringify(newArcanas, null, 2));
  console.log(`Processed ${arcanas.length} arcanas.`);
}

// 3. Process Summoner Skills
const summonersPath = path.join(DATA_DIR, 'hok_summoners.json');
if (fs.existsSync(summonersPath)) {
  const summoners = JSON.parse(fs.readFileSync(summonersPath, 'utf8'));
  const newSummoners = summoners.map(skill => ({
    id: skill.summoner_id,
    name: translateText(skill.summoner_name),
    unlockLevel: skill.summoner_rank,
    description: translateText(skill.summoner_des),
    icon: skill.icon_local
  }));
  fs.writeFileSync(summonersPath, JSON.stringify(newSummoners, null, 2));
  console.log(`Processed ${summoners.length} summoner skills.`);
}

// 4. Process Heroes
const heroesPath = path.join(DATA_DIR, 'hok_heroes.json');
if (fs.existsSync(heroesPath)) {
  const heroes = JSON.parse(fs.readFileSync(heroesPath, 'utf8'));
  const newHeroes = heroes.map(hero => ({
    id: hero.id,
    nameEn: hero.hero_name_en,
    nameCn: hero.hero_name_cn,
    nameJa: heroNames[hero.hero_name_cn] || hero.hero_name_ja || hero.hero_name_cn,
    tags: hero.tags,
    role: hero.role,
    winRate: hero.win_rate,
    tier: hero.tier,
    avatar: hero.avatar,
    avatarLocal: hero.avatar_local
  }));
  fs.writeFileSync(heroesPath, JSON.stringify(newHeroes, null, 2));
  console.log(`Processed ${heroes.length} heroes.`);
}

console.log('Data translation and camelCase formatting completed.');
