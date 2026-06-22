import json

# 1. Load the mapping
mapping = {
  "hero_001": "元流之子（タンク）",
  "hero_002": "元流之子（メイジ）",
  "hero_003": "后羿 こうげい",
  "hero_004": "廉頗 れんぱ",
  "hero_005": "ミレディ",
  "hero_006": "元流之子（マークスマン）",
  "hero_007": "ガルダ",
  "hero_008": "妲己 だっき",
  "hero_009": "魯班7号 ろばんななごう",
  "hero_010": "アンジェラ",
  "hero_011": "小喬",
  "hero_012": "趙雲",
  "hero_013": "墨子",
  "hero_014": "孫尚香",
  "hero_015": "荘子",
  "hero_016": "劉禅",
  "hero_017": "高漸離",
  "hero_018": "阿軻",
  "hero_019": "鐘無艶",
  "hero_020": "孫臏",
  "hero_021": "扁鵲",
  "hero_022": "白起",
  "hero_023": "ミーユエ",
  "hero_024": "呂布",
  "hero_025": "周瑜",
  "hero_026": "元歌",
  "hero_027": "夏侯惇",
  "hero_028": "甄姫",
  "hero_029": "ファティフ",
  "hero_030": "典韋",
  "hero_031": "宮本武蔵",
  "hero_032": "李白",
  "hero_033": "マルコ・ポーロ",
  "hero_034": "ディーレンジェ",
  "hero_035": "達磨",
  "hero_036": "項羽",
  "hero_037": "司馬懿",
  "hero_038": "孔明",
  "hero_039": "関羽",
  "hero_040": "貂蝉",
  "hero_041": "ルナ",
  "hero_042": "太公望",
  "hero_043": "劉邦",
  "hero_044": "韓信",
  "hero_045": "王昭君",
  "hero_046": "蘭陵王",
  "hero_047": "ムーラン",
  "hero_048": "エリン",
  "hero_049": "張良",
  "hero_050": "不知火舞",
  "hero_051": "ドリア",
  "hero_052": "ナコルル",
  "hero_053": "橘右京",
  "hero_054": "アーサー",
  "hero_055": "孫悟空",
  "hero_056": "ラプラプ",
  "hero_057": "劉備",
  "hero_058": "張飛",
  "hero_059": "チチャ",
  "hero_060": "李元芳",
  "hero_061": "虞美人",
  "hero_062": "鐘馗",
  "hero_063": "楊貴妃",
  "hero_064": "蒼",
  "hero_065": "楊戩",
  "hero_066": "女媧",
  "hero_067": "ナタク",
  "hero_068": "干将・莫耶",
  "hero_069": "アテナ",
  "hero_070": "蔡文姫",
  "hero_071": "東皇太一",
  "hero_072": "鬼谷子",
  "hero_073": "鎧",
  "hero_074": "大喬",
  "hero_075": "黄忠",
  "hero_076": "カイザー",
  "hero_077": "百里玄策",
  "hero_078": "百里守約",
  "hero_079": "弈星",
  "hero_080": "モンキ",
  "hero_081": "公孫離 こうそんり",
  "hero_082": "明世隠 めいせいいん",
  "hero_083": "裴擒虎",
  "hero_084": "バイロン",
  "hero_085": "瑶 よう",
  "hero_086": "雲中君 うんちゅうくん",
  "hero_087": "李信 りしん",
  "hero_088": "伽羅 きゃら",
  "hero_089": "孫策 そんさく",
  "hero_090": "上官婉児 じょうかんえんじ",
  "hero_091": "アレン",
  "hero_092": "大司命",
  "hero_093": "白起",
  "hero_094": "溟月",
  "hero_095": "曁",
  "hero_096": "西施",
  "hero_097": "蒙犽",
  "hero_098": "瀾",
  "hero_099": "鏡",
  "hero_100": "アグド",
  "hero_101": "嫦娥",
  "hero_102": "シャーロット",
  "hero_103": "ユンエイ",
  "hero_104": "ハロルド",
  "hero_105": "アレシオ",
  "hero_106": "ルアンラ",
  "hero_107": "アタ",
  "hero_108": "影 えい",
  "hero_109": "ハイノ",
  "hero_110": "姫小満 きしょうまん",
  "hero_111": "少司縁 しょうしえん",
  "hero_112": "バタフライ"
}

with open(r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_heroes.json", "r", encoding="utf-8") as f:
    hok_heroes = json.load(f)

# Normalize string
def normalize(s):
    if not s: return ""
    return s.split(' ')[0].replace('・', '').replace(' ', '').replace('（', '').replace('）', '').replace('(', '').replace(')', '')

hero_name_to_id = {}
for h in hok_heroes:
    names = [
        normalize(h.get('nameJaOfficial', '')),
        normalize(h.get('nameJa', '')),
        normalize(h.get('nameCn', '')),
        normalize(h.get('nameEn', ''))
    ]
    for n in names:
        if n:
            hero_name_to_id[n] = h['id']

# Manual fallbacks
manual_map = {
    '元流之子タンク': '538',
    '元流之子メイジ': '538',
    '元流之子マークスマン': '538',
    'ディーレンジェ': '133',
    '孔明': '190',
    '鐘馗': '175',
    'ファティフ': '112',
    'ラプラプ': '114',
    'チチャ': '113',
    'アーサー': '166',
    '劉邦': '149',
    '百里守約': '196',
    'ルアンラ': '110', # Luara
    'ハロルド': '111', # Heino? Wait no
    'カイザー': '193', # Kaizer / Kai
    '鎧': '193', 
    'タイガー': '502', # Pei Qinhu
    '裴擒虎': '502',
    'アグド': '533',
    '姫小満': '540',
    '少司縁': '545',
    '大司命': '544',
    'アレシオ': '548',
    'ハイノ': '514',
    '溟月': '115',
    '影': '546',
}

# 2. Remap skills
skills_path = r"c:\Users\81901\Desktop\オナーオブキングスサイト\public\data\skills\ja.json"
with open(skills_path, "r", encoding="utf-8") as f:
    skills = json.load(f)

new_skills = {}
for old_key, data in skills.items():
    raw_name = mapping.get(old_key)
    if not raw_name:
        continue
    norm_name = normalize(raw_name)
    matched_id = hero_name_to_id.get(norm_name) or manual_map.get(norm_name)
    
    if matched_id:
        new_key = f"hero_{str(matched_id).zfill(3)}"
        new_skills[new_key] = data
        
with open(skills_path, "w", encoding="utf-8") as f:
    json.dump(new_skills, f, ensure_ascii=False, indent=2)

print(f"Remapped {len(new_skills)} skills successfully.")
