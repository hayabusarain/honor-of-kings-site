const fs = require('fs');
const path = require('path');
const https = require('https');

const HERO_DATA_PATH = path.join(__dirname, '../../src/data/hok_heroes.json');
const SKILL_IMAGES_DIR = path.join(__dirname, '../../public/images/skills');

// Known mappings
const MANUAL_MAPPING = {
  "元流の子（タンク）": "元流之子(坦克)",
  "元流の子（メイジ）": "元流之子(法师)",
  "元流の子（マークスマン）": "元流之子(射手)",
  "ミレディ": "米莱狄",
  "カルラ": "伽罗",
  "アンジェラ": "安琪拉",
  "荘子": "庄周",
  "漸離": "高渐离",
  "鐘無艶": "钟无艳",
  "ミーユエ": "芈月",
  "ファーティフ": "嬴政", 
  "マルコ・ポーロ": "马可波罗",
  "仁傑": "狄仁杰",
  "達磨": "达摩",
  "孔子": "老夫子",
  "ルナ": "露娜",
  "太公望": "姜子牙",
  "ムーラン": "花木兰",
  "エリン": "艾琳",
  "ドリア": "朵莉亚",
  "ナコルル": "娜可露露",
  "アーサー": "亚瑟",
  "ラプール": "盾山", 
  "チーシャ": "蚩奼", 
  "虞美人": "虞姬",
  "楊貴妃": "杨玉环",
  "蒼": "苍",
  "ナタク": "哪吒",
  "干将・莫耶": "干将莫邪",
  "アテナ": "雅典娜",
  "孔明": "诸葛亮",
  "カイザー": "铠",
  "モンキ": "梦奇",
  "タイガー": "裴擒虎",
  "バイロン": "狂铁",
  "アレン": "亚连",
  "瀾": "澜",
  "鏡": "镜",
  "アグド": "阿古朵",
  "啓": "桑启",
  "シャルロット": "夏洛特",
  "ユンエイ": "云缨",
  "ハロルド": "暃",
  "アレッシオ": "莱西奥",
  "アタ": "猪八戒",
  "ハイノ": "海诺",
  // Kanij conversion that might not match directly
  "后羿": "后羿",
  "廉頗": "廉颇",
  "妲己": "妲己",
  "魯班7号": "鲁班七号",
  "小喬": "小乔",
  "趙雲": "赵云",
  "墨子": "墨子",
  "孫尚香": "孙尚香",
  "劉禅": "刘禅",
  "阿軻": "阿轲",
  "孫臏": "孙膑",
  "扁鵲": "扁鹊",
  "白起": "白起",
  "呂布": "吕布",
  "周瑜": "周瑜",
  "元歌": "元歌",
  "夏侯惇": "夏侯惇",
  "甄姫": "甄姬",
  "典韋": "典韦",
  "宮本武蔵": "宫本武藏",
  "李白": "李白",
  "項羽": "项羽",
  "司馬懿": "司马懿",
  "関羽": "关羽",
  "貂蝉": "貂蝉",
  "劉邦": "刘邦",
  "韓信": "韩信",
  "王昭君": "王昭君",
  "蘭陵王": "兰陵王",
  "張良": "张良",
  "不知火舞": "不知火舞",
  "橘右京": "橘右京",
  "孫悟空": "孙悟空",
  "劉備": "刘备",
  "張飛": "张飞",
  "李元芳": "李元芳",
  "鐘馗": "钟馗",
  "楊戩": "杨戬",
  "女媧": "女娲",
  "蔡文姫": "蔡文姬",
  "東皇太一": "东皇太一",
  "鬼谷子": "鬼谷子",
  "大喬": "大乔",
  "黄忠": "黄忠",
  "百里玄策": "百里玄策",
  "百里守約": "百里守约"
};

function downloadJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log("Fetching hero list...");
  const qqHeroes = await downloadJson('https://pvp.qq.com/web201605/js/herolist.json');
  console.log(`Fetched ${qqHeroes.length} heroes from QQ.`);

  const hokHeroes = JSON.parse(fs.readFileSync(HERO_DATA_PATH, 'utf-8'));
  
  const unmatched = [];
  const heroMapping = [];

  for (const hero of hokHeroes) {
    let cname = MANUAL_MAPPING[hero.name] || hero.name;
    
    let qqHero = qqHeroes.find(q => q.cname === cname);
    
    // Attempt fuzzy match for Kanji
    if (!qqHero) {
      qqHero = qqHeroes.find(q => {
        // try to match characters loosely
        const chars = Array.from(hero.name).filter(c => cname.includes(c));
        return chars.some(c => q.cname.includes(c));
      });
    }

    if (qqHero) {
      heroMapping.push({
        id: hero.id,
        name: hero.name,
        ename: qqHero.ename,
        cname: qqHero.cname
      });
    } else {
      unmatched.push(hero.name);
    }
  }

  if (unmatched.length > 0) {
    console.log("Unmatched heroes (skipping):");
    console.dir(unmatched, { maxArrayLength: null });
    console.log("Please manually check if they exist in CN server.");
  }

  console.log("Proceeding to download images for matched heroes...");

  if (!fs.existsSync(SKILL_IMAGES_DIR)) {
    fs.mkdirSync(SKILL_IMAGES_DIR, { recursive: true });
  }

  // Define download function
  const downloadImage = (url, dest) => {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode === 200) {
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        } else {
          // It's normal for index 4 to 404 sometimes if hero has fewer skills
          res.resume();
          if (res.statusCode === 404) {
            resolve(false); // ignore 404
          } else {
            reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
          }
        }
      }).on('error', err => {
        fs.unlink(dest, () => reject(err));
      });
    });
  };

  let downloadedCount = 0;

  for (const mapped of heroMapping) {
    for (let index = 0; index <= 4; index++) {
      const url = `https://game.gtimg.cn/images/yxzj/img201606/heroimg/${mapped.ename}/${mapped.ename}${index}0.png`;
      const dest = path.join(SKILL_IMAGES_DIR, `${mapped.id}_${index}.png`);
      
      try {
        const result = await downloadImage(url, dest);
        if (result !== false) {
          downloadedCount++;
        }
      } catch (err) {
        console.error(`Error downloading ${url}:`, err.message);
      }
    }
  }

  console.log(`Finished downloading ${downloadedCount} skill icons.`);
}

main().catch(console.error);
