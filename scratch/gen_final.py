import json
from difflib import get_close_matches

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/jp_names.json', 'r', encoding='utf-8') as f:
    jp_data = json.load(f)

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/eng_names.json', 'r', encoding='utf-8') as f:
    eng_names = json.load(f)

jp_names_map = {
"元流の子（タンク）": "Flowborn/Tank",
"元流の子（メイジ）": "Flowborn/Mage",
"后羿": "Hou Yi",
"廉頗": "Lian Po",
"ミレディ": "Milady",
"元流の子（マークスマン）": "Flowborn/Marksman",
"カルラ": "Garo",
"妲己": "Daji",
"魯班7号": "Luban No.7",
"アンジェラ": "Angela",
"小喬": "Xiao Qiao",
"趙雲": "Zilong",
"墨子": "Mozi",
"孫尚香": "Lady Sun",
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
"甄姫": "Zhen Ji",
"ファーティフ": "Fuzi",
"典韋": "Dian Wei",
"宮本武蔵": "Musashi",
"李白": "Li Bai",
"マルコ・ポーロ": "Marco Polo",
"仁傑": "Di Renjie",
"達磨": "Dharma",
"項羽": "Xiang Yu",
"司馬懿": "Sima Yi",
"孔子": "Fuzi",
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
"アーサー": "Arthur",
"孫悟空": "Sun Wukong",
"ラプール": "Niumo", 
"劉備": "Liu Bei",
"張飛": "Zhang Fei",
"チーシャ": "Chicha",
"李元芳": "Fang",
"虞美人": "Consort Yu",
"鐘馗": "Kui",
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
"タイガー": "Pei",
"バイロン": "Biron",
"瑶": "Yaria",
"雲中君": "Yun Zhongjun",
"李信": "Li Xin",
"伽羅": "Garo", 
"孫策": "Sun Ce",
"上官婉児": "Shangguan",
"アレン": "Allain",
"大司命": "Augran",
"白龍": "Ao'yin",
"溟月": "Hai Yue",
"曜": "Dongfang Yao",
"西施": "Xishi",
"蒙牙": "Meng Ya",
"瀾": "Lam",
"鏡": "Jing",
"アグド": "Agudo",
"啓": "Sikong Zhen",
"シャルロット": "Charlotte",
"ユンエイ": "Ying",
"ハロルド": "Cao Cao",
"アレッシオ": "Alessio",
"ルアンナ": "Luara", 
"アタ": "Zhu Bajie",
"影": "Umbrosa",
"ハイノ": "Heino",
"姫小満": "Mayene",
"少司縁": "Dyadia",
"バタフライ": "Butterfly"
}

final_mapping = {}

for jp_item in jp_data:
    name = jp_item["name"]
    eng_name = jp_names_map.get(name, "Unknown")
    
    if eng_name in eng_names:
        final_mapping[name] = eng_name
    else:
        # Special fallback
        matches = get_close_matches(eng_name, eng_names, n=1, cutoff=0.2)
        if matches:
            final_mapping[name] = matches[0]
        else:
            final_mapping[name] = eng_name

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/jp_to_eng.json', 'w', encoding='utf-8') as f:
    json.dump(final_mapping, f, ensure_ascii=False, indent=2)

print(f"Created jp_to_eng.json with {len(final_mapping)} keys.")
