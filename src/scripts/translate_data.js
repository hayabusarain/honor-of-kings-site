const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Translation Dictionary for Stats and Descriptions
const terminologyDict = {
  "物理攻击力": "物理攻撃",
  "物理攻击": "物理攻撃",
  "法术攻击力": "魔法攻撃",
  "法术攻击": "魔法攻撃",
  "最大生命": "最大HP",
  "生命值": "最大HP",
  "最大法力": "最大マナ",
  "法力值": "最大マナ",
  "物理防御力": "物理防御",
  "物理防御": "物理防御",
  "护甲": "物理防御",
  "法术防御力": "魔法防御",
  "法术防御": "魔法防御",
  "魔抗": "魔法防御",
  "移动速度": "移動速度",
  "移速": "移動速度",
  "攻击速度": "攻撃速度",
  "攻速": "攻撃速度",
  "攻速加成": "攻撃速度",
  "冷却缩减": "CD短縮",
  "暴击率": "クリティカル率",
  "暴击效果": "クリティカルダメージ",
  "物理吸血": "物理ライフスティール",
  "法术吸血": "魔法吸収",
  "物理穿透": "物理貫通",
  "法术穿透": "魔法貫通",
  "霸体": "スーパーアーマー",
  "位移": "ブリンク",
  "控制": "CC（行動阻害）",
  "眩晕": "スタン",
  "击飞": "ノックアップ",
  "沉默": "サイレンス",
  "护盾": "シールド",
  "真实伤害": "確定ダメージ",
  "真伤": "確定ダメージ",
  "生命回复": "HP回復",
  "每5秒回血": "5秒毎HP回復",
  "每5秒回蓝": "5秒毎マナ回復"
};

// Hero Names mapping (Chinese to Japanese Katakana/Kanji)
const heroNames = {
  "廉颇": "廉頗", "小乔": "小喬", "赵云": "趙雲", "墨子": "墨子", "妲己": "妲己", "嬴政": "始皇帝",
  "孙尚香": "孫尚香", "鲁班七号": "魯班七号", "庄周": "荘周", "刘禅": "劉禅", "高渐离": "高漸離",
  "阿轲": "阿軻", "钟无艳": "鍾無艶", "孙膑": "孫臏", "扁鹊": "扁鵲", "白起": "白起", "芈月": "ミーユエ",
  "吕布": "呂布", "周瑜": "周瑜", "夏侯惇": "夏侯惇", "甄姬": "甄姫", "曹操": "曹操", "典韦": "典韋",
  "宫本武藏": "宮本武蔵", "李白": "李白", "马可波罗": "マルコ・ポーロ", "狄仁杰": "狄仁傑",
  "达摩": "達磨", "项羽": "項羽", "武则天": "武則天", "老夫子": "老夫子", "关羽": "関羽", "貂蝉": "貂蝉",
  "安琪拉": "アンジェラ", "程咬金": "程咬金", "露娜": "ルナ", "姜子牙": "姜子牙", "刘邦": "劉邦",
  "韩信": "韓信", "王昭君": "王昭君", "兰陵王": "蘭陵王", "花木兰": "花木蘭", "张良": "張良",
  "不知火舞": "不知火舞", "娜可露露": "ナコルル", "橘右京": "橘右京", "亚瑟": "アーサー",
  "孙悟空": "孫悟空", "牛魔": "牛魔王", "后羿": "后羿", "刘备": "劉備", "张飞": "張飛",
  "李元芳": "李元芳", "虞姬": "虞姫", "钟馗": "鍾馗", "成吉思汗": "チンギス・ハン", "杨戬": "楊戩",
  "雅典娜": "アテナ", "夏洛特": "シャーロット", "哪吒": "哪吒", "太乙真人": "太乙真人",
  "干将莫邪": "干将莫邪", "大乔": "大喬", "东皇太一": "東皇太一", "鬼谷子": "鬼谷子", "百里守约": "百里守約",
  "百里玄策": "百里玄策", "苏烈": "蘇烈", "梦奇": "夢奇", "女娲": "女媧", "明世隐": "明世隠",
  "公孙离": "公孫離", "裴擒虎": "裴擒虎", "狂铁": "狂鉄", "米莱狄": "ミレディ", "元歌": "元歌",
  "司马懿": "司馬懿", "盾山": "盾山", "伽罗": "伽羅", "沈梦溪": "沈夢渓", "李信": "李信", "上官婉儿": "上官婉児",
  "猪八戒": "猪八戒", "盘古": "盤古", "瑶": "瑶", "云中君": "雲中君", "曜": "曜", "马超": "馬超",
  "西施": "西施", "鲁班大师": "魯班大師", "蒙犽": "蒙犽", "镜": "鏡", "蒙恬": "蒙恬", "阿古朵": "阿古朵",
  "澜": "瀾", "司空震": "司空震", "艾琳": "アイリーン", "云缨": "雲纓", "金蝉": "金蝉", "暃": "暃", 
  "桑启": "桑啓", "戈娅": "戈婭", "海月": "海月", "赵怀真": "趙懐真", "莱西奥": "レシオ", "姬小满": "姫小満", 
  "亚连": "アレイン", "朵莉亚": "ドリア", "海诺": "ハイノ", "敖隐": "アオイン", "大司命": "大司命", 
  "蔡文姬": "蔡文姫", "黄忠": "黄忠", "诸葛亮": "諸葛亮", "铠": "鎧"
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
