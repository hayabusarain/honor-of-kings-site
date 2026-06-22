const fs = require('fs');
const newHeroes = require('../src/data/hok_heroes.json');
const bakHeroes = JSON.parse(fs.readFileSync('./src/data/hok_heroes.json.bak', 'utf8'));

let success = 0;
let failed = [];

const mapping = {
  "hero_001": "元流の子", "hero_002": "元流の子", "hero_003": "后羿", "hero_004": "廉頗", "hero_005": "ミレディ",
  "hero_006": "元流の子", "hero_007": "カルラ", "hero_008": "妲己", "hero_009": "魯班7号", "hero_010": "アンジェラ",
  "hero_011": "小喬", "hero_012": "趙雲", "hero_013": "墨子", "hero_014": "孫尚香", "hero_015": "荘子",
  "hero_016": "劉禅", "hero_017": "高漸離", "hero_018": "阿軻", "hero_019": "鐘無艶", "hero_020": "孫臏",
  "hero_021": "扁鵲", "hero_022": "白起", "hero_023": "ミーユエ", "hero_024": "呂布", "hero_025": "周瑜",
  "hero_026": "元歌", "hero_027": "夏侯惇", "hero_028": "甄姫", "hero_029": "ファーティフ", "hero_030": "典韋",
  "hero_031": "宮本武蔵", "hero_032": "李白", "hero_033": "マルコ・ポーロ", "hero_034": "仁傑", "hero_035": "達磨",
  "hero_036": "項羽", "hero_037": "司馬懿", "hero_038": "孔子", "hero_039": "関羽", "hero_040": "貂蝉",
  "hero_041": "ルナ", "hero_042": "太公望", "hero_043": "劉邦", "hero_044": "韓信", "hero_045": "王昭君",
  "hero_046": "蘭陵王", "hero_047": "ムーラン", "hero_048": "エリン", "hero_049": "張良", "hero_050": "不知火舞",
  "hero_051": "ドリア", "hero_052": "ナコルル", "hero_053": "橘右京", "hero_054": "アーサー", "hero_055": "孫悟空",
  "hero_056": "ラプール", "hero_057": "劉備", "hero_058": "張飛", "hero_059": "チーシャ", "hero_060": "李元芳",
  "hero_061": "虞美人", "hero_062": "鐘馗", "hero_063": "楊貴妃", "hero_064": "蒼", "hero_065": "楊戩",
  "hero_066": "女媧", "hero_067": "ナタク", "hero_068": "干将・莫耶", "hero_069": "アテナ", "hero_070": "蔡文姫",
  "hero_071": "東皇太一", "hero_072": "鬼谷子", "hero_073": "孔明", "hero_074": "大喬", "hero_075": "黄忠",
  "hero_076": "カイザー", "hero_077": "百里玄策", "hero_078": "百里守約", "hero_079": "棋星", "hero_080": "モンキ",
  "hero_081": "公孫離", "hero_082": "明世隠", "hero_083": "タイガー", "hero_084": "バイロン", "hero_085": "瑶",
  "hero_086": "雲中君", "hero_087": "李信", "hero_088": "伽羅", "hero_089": "孫策", "hero_090": "上官婉児",
  "hero_091": "アレン", "hero_092": "大司命", "hero_093": "白龍", "hero_094": "溟月", "hero_095": "曜",
  "hero_096": "西施", "hero_097": "蒙犽", "hero_098": "瀾", "hero_099": "鏡", "hero_100": "アグド",
  "hero_101": "啓", "hero_102": "シャルロット", "hero_103": "ユンエイ", "hero_104": "ハロルド", "hero_105": "アレッシオ",
  "hero_106": "ルアンナ", "hero_107": "アタ", "hero_108": "影", "hero_109": "ハイノ", "hero_110": "姫小満",
  "hero_111": "少司縁", "hero_112": "バタフライ"
};

newHeroes.forEach(nh => {
  // Normalize names for better matching
  const norm = (s) => s ? s.replace(/（.*?）|\(.*?\)|・|\s|げんりゅうのこ|こうげい|れんぱ|だっき|ろばんななごう/g, '') : '';
  const rawName = mapping[nh.id] || nh.name;
  const nhName = norm(rawName);
  
  let match = Object.values(bakHeroes).find(bh => 
    norm(bh.nameJa) === nhName || 
    norm(bh.nameJaOfficial) === nhName || 
    norm(bh.nameEn) === nhName || 
    norm(bh.nameCn) === nhName
  );
  
  if (!match) {
     if (nhName.includes('元流')) match = Object.values(bakHeroes).find(bh => bh.id == '538');
     else if (nhName.includes('仁傑')) match = Object.values(bakHeroes).find(bh => bh.id == '133');
     else if (nhName.includes('孔子')) match = Object.values(bakHeroes).find(bh => bh.id == '190'); // Zhuge Liang
     else if (nhName.includes('孔明')) match = Object.values(bakHeroes).find(bh => bh.id == '190'); // Zhuge Liang
     else if (nhName.includes('鐘馗')) match = Object.values(bakHeroes).find(bh => bh.id == '175');
     else if (nhName.includes('ファーティフ')) match = Object.values(bakHeroes).find(bh => bh.id == '112');
     else if (nhName.includes('ラプール')) match = Object.values(bakHeroes).find(bh => bh.id == '114');
     else if (nhName.includes('チーシャ')) match = Object.values(bakHeroes).find(bh => bh.id == '113'); // Chicha -> Zhuang Zhou
     else if (nhName.includes('ルアンナ')) match = Object.values(bakHeroes).find(bh => bh.id == '518'); 
     else if (nhName.includes('荘子')) match = Object.values(bakHeroes).find(bh => bh.id == '113');
     else if (nhName.includes('鐘無艶')) match = Object.values(bakHeroes).find(bh => bh.id == '117');
     else if (nhName.includes('虞美人')) match = Object.values(bakHeroes).find(bh => bh.id == '174');
     else if (nhName.includes('棋星')) match = Object.values(bakHeroes).find(bh => bh.id == '197');
     else if (nhName.includes('伽羅')) match = Object.values(bakHeroes).find(bh => bh.id == '508');
     else if (nhName.includes('瀾')) match = Object.values(bakHeroes).find(bh => bh.id == '531');
     else if (nhName.includes('鏡')) match = Object.values(bakHeroes).find(bh => bh.id == '528');
     else if (nhName.includes('少司縁')) match = Object.values(bakHeroes).find(bh => bh.id == '577');
     else if (nhName.includes('白龍')) match = Object.values(bakHeroes).find(bh => bh.id == '517'); // Ao Yin
     else if (nhName.includes('蒼')) match = Object.values(bakHeroes).find(bh => bh.id == '177'); // Genghis Khan
     else if (nhName.includes('啓')) match = Object.values(bakHeroes).find(bh => bh.id == '537'); // Qi? Let's check 537
  }
  
  if (match) {
    const src = `./public/images/heroes/${match.id}.jpg`;
    const dest = `./public/images/heroes/${nh.id}.jpg`;
    if (fs.existsSync(src)) {
       fs.copyFileSync(src, dest);
       success++;
    } else {
       failed.push(nh.name + ' (img missing ' + match.id + ')');
    }
  } else {
    failed.push(nh.name + ' (no match)');
  }
});

console.log('Success:', success);
console.log('Failed:', failed);
