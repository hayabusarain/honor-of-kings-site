import json
from difflib import get_close_matches

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/jp_names.json', 'r', encoding='utf-8') as f:
    jp_data = json.load(f)

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/eng_names.json', 'r', encoding='utf-8') as f:
    eng_data = json.load(f)

eng_names = [e for e in eng_data if not e.startswith("index.php")]
# add the rest
eng_names += [e for e in eng_data if e.startswith("index.php")]

mapping = {}

known_mappings = {
    "アーサー": "Arthur",
    "アンジェラ": "Angela",
    "タイガー": "Pei", # Pei Qinhu
    "バイロン": "Biron",
    "ラプール": "Lumburr", # Wait, eng list has something similar?
    "鐘馗": "Kui",
    "蒙牙": "Meng Ya",
    "カルラ": "Garo",
    "バタフライ": "Butterfly",
    "妲己": "Daji",
    "魯班7号": "Luban No.7",
    "孫尚香": "Lady Sun", # Sun Shangxiang
    "甄姫": "Zhen Ji",
    "アタ": "Zhu Bajie", # Ata is Zhu Bajie in global, wait let me check
    "ファーティフ": "Fuzi", # From instructions
    "莱西奥": "Alessio",
    "元流の子（タンク）": "Flowborn/Tank",
    "元流の子（メイジ）": "Flowborn/Mage",
    "元流の子（マークスマン）": "Flowborn/Marksman",
    "后羿": "Hou Yi",
    "廉頗": "Lian Po",
    "ミレディ": "Milady",
    "小喬": "Xiao Qiao",
    "趙雲": "Zilong",
    "墨子": "Mozi",
    "荘子": "Zhuangzi",
    "劉禅": "Liu Shan",
    "漸離": "Gao",
    "阿軻": "A Ke",
    "鐘無艶": "Wuyan",
    "孫臏": "Sun Bin",
    "扁鵲": "Dr Bian",
    "白起": "Bai Qi",
    "ミーユエ": "Mi Yue",
    "呂布": "Lu Bu",
    "周瑜": "Zhou Yu",
    "元歌": "Yango",
    "夏侯惇": "Dun",
    "典韋": "Dian Wei",
    "宮本武蔵": "Musashi",
    "李白": "Li Bai",
    "マルコ・ポーロ": "Marco Polo",
    "仁傑": "Di Renjie",
    "達磨": "Dharma",
    "項羽": "Xiang Yu",
    "司馬懿": "Sima Yi",
    "孔子": "Fuzi", # If Fuzi is not Fatif? Wait. Let me just map manually
    "関羽": "Guan Yu",
    "貂蝉": "Diaochan",
    "ルナ": "Luna",
    "太公望": "Ziya",
    "劉邦": "Liu Bang",
    "韓信": "Han Xin",
    "王昭君": "Wang Zhaojun",
    "蘭陵王": "Gao Changgong",
    "ムーラン": "Mulan",
    "エリン": "Erin",
    "張良": "Zhang Liang",
    "不知火舞": "Mai Shiranui",
    "ドリア": "Dolia",
    "ナコルル": "Nakoruru",
    "橘右京": "Ukyo Tachibana",
    "孫悟空": "Sun Wukong",
    "劉備": "Liu Bei",
    "張飛": "Zhang Fei",
    "チーシャ": "Chicha",
    "李元芳": "Fang",
    "虞美人": "Consort Yu",
    "楊貴妃": "Yuhuan",
    "蒼": "Arke",
    "楊戩": "Yang Jian",
    "女媧": "Nuwa",
    "ナタク": "Nezha",
    "干将・莫耶": "Gan & Mo",
    "アテナ": "Athena",
    "蔡文姫": "Cai Yan",
    "東皇太一": "Donghuang",
    "鬼谷子": "Guiguzi",
    "孔明": "Kongming",
    "大喬": "Da Qiao",
    "黄忠": "Huang Zhong",
    "カイザー": "Kaizer",
    "百里玄策": "Xuance",
    "百里守約": "Shouyue",
    "棋星": "Yixing",
    "モンキ": "Menki",
    "公孫離": "Arli",
    "明世隠": "Ming Shiyin",
    "瑶": "Yaria",
    "雲中君": "Yun Zhongjun",
    "李信": "Li Xin",
    "伽羅": "Garo", # Wait, I already have カルラ -> Garo. 伽羅 is Garo too? Wait.
    "孫策": "Sun Ce",
    "上官婉児": "Shangguan",
    "アレン": "Allain",
    "大司命": "Augran",
    "白龍": "Ao'yin", # Wait, Ao'yin is White Dragon?
    "溟月": "Hai Yue",
    "曜": "Dongfang Yao",
    "西施": "Xishi",
    "瀾": "Lam",
    "鏡": "Jing",
    "アグド": "Agudo",
    "啓": "Sikong Zhen",
    "シャルロット": "Charlotte",
    "ユンエイ": "Ying",
    "ハロルド": "Cao Cao", # Fatif is Cao Cao or Fuzi?
    "アレッシオ": "Alessio",
    "ルアンナ": "Loong",
    "アタ": "Zhu Bajie", # Or Ata
    "影": "Umbrosa",
    "ハイノ": "Heino",
    "姫小満": "Mayene",
    "少司縁": "Dyadia"
}

for jp_item in jp_data:
    name = jp_item["name"]
    mapping[name] = ""

print(json.dumps(mapping, ensure_ascii=False, indent=2))
