import json
import re

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/src/data/hero_stats_camp.json", "r", encoding="utf-8") as f:
    hero_stats = json.load(f)

with open("C:/Users/81901/.gemini/antigravity/brain/f96a5591-ba25-4a35-b1b0-aaa6007f2425/scratch/new_tier_data.json", "r", encoding="utf-8") as f:
    tier_data = json.load(f)

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/hero_map.json", "r", encoding="utf-8") as f:
    hero_map = json.load(f)

# we map hero_id -> jpName based on hero_stats
hero_id_to_jp = {k: v["jpName"] for k, v in hero_stats.items()}
jp_to_hero_id = {v: k for k, v in hero_id_to_jp.items()}

# aliases from english to jpName
# We need to map english in tier_data to JP in hero_stats.
aliases_en_to_jp = {
    "Arthur": "アーサー",
    "Diaochan": "貂蝉",
    "Luban No.7": "魯班7号",
    "Hou Yi": "后羿",
    "Li Bai": "李白",
    "Han Xin": "韓信",
    "Wukong": "孫悟空",
    "Marco Polo": "マルコ・ポーロ",
    "Angela": "アンジェラ",
    "Da Qiao": "大喬",
    "Xiao Qiao": "小喬",
    "Mulan": "ムーラン",
    "Zhaojun": "王昭君",
    "Zhuangzi": "荘子",
    "Daji": "妲己",
    "Pei Qinhu": "裴擒虎 はいきんこ", # Actually in hero_stats it is タイガー! Let's map it:
    "Jing": "鏡",
    "Lan": "瀾",
    "Shangguan Wan'er": "上官婉児",
    "Augran": "大司命",
    "Loong": "ルアンナ", # wait, Loong is Ao'yin? In hero_stats, is it 白龍? Let's check 
    "Lam": "瀾",
    "Gongsun Li": "公孫離",
    "Yao": "瑶",
    "Cai Wenji": "蔡文姫",
    "Zhong Kui": "鐘馗",
    "Mozi": "墨子",
    "Ying Zheng": "嬴政", # Wait, is it in DB?
    "Wu Zetian": "武則天",
    "Xiang Yu": "項羽",
    "Liu Bang": "劉邦",
    "Liu Bei": "劉備",
    "Guan Yu": "関羽",
    "Zhang Fei": "張飛",
    "Zhuge Liang": "孔明",
    "Huang Zhong": "黄忠",
    "Ma Chao": "馬超", # Is it in DB?
    "Sun Ce": "孫策",
    "Zhou Yu": "周瑜",
    "Sun Shangxiang": "孫尚香",
    "Lu Bu": "呂布",
    "Dong Zhuo": "董卓", # Wait, maybe Ata? Or Zhu Bajie? Ata is アタ. 
    "Cao Cao": "曹操",
    "Sima Yi": "司馬懿",
    "Xiahou Dun": "夏侯惇",
    "Dian Wei": "典韋",
    "Zhen Ji": "甄姫",
    "Bian Que": "扁鵲",
    "Cheng Yaojin": "程咬金", # Is it in DB?
    "Yunzhongjun": "雲中君",
    "Nuwa": "女媧",
    "Pangu": "盤古", # Is it in DB?
    "Nezha": "ナタク",
    "Yang Jian": "楊戩",
    "Chang'e": "嫦娥",
    "Yang Yuhuan": "楊貴妃",
    "Ukyo Tachibana": "橘右京",
    "Nakoruru": "ナコルル",
    "Mai Shiranui": "不知火舞",
    "Haoyue": "海月",
    "Erin": "エリン",
    "Milady": "ミレディ",
    "Consort Yu": "虞美人",
    "Biron": "バイロン",
    "Lian Po": "廉頗",
    "Bairidian": "百里守約", # wait, baili shouyue?
    "Baili Shouyue": "百里守約",
    "Baili Xuance": "百里玄策",
    "Su Lie": "蘇烈", # DB?
    "Shen Mengxi": "沈夢渓", # DB?
    "Gao Jianli": "漸離",
    "A Ke": "阿軻",
    "Ming Shiyin": "明世隠",
    "Yixing": "弈星",
    "Wuyan": "鐘無艶",
    "Sun Bin": "孫臏",
    "Agudo": "アグド",
    "Alessio": "アレッシオ",
    "Ao'yin": "白龍", # 白龍 is Ao'yin?
    "Arli": "公孫離",
    "Chano": "チーシャ",
    "Arke": "蒼",
    "Athena": "アテナ",
    "Cirrus": "雲中君", # Yunzhongjun is Cirrus
    "Feyd": "ファーティフ",
    "Gao Changgong": "蘭陵王",
    "Li Xin": "李信",
    "Kaizer": "カイザー",
}

# we'll build a script to match everything
for en, jp in aliases_en_to_jp.items():
    if jp not in jp_to_hero_id:
        # Check if Pei Qinhu is "タイガー"
        if en == "Pei Qinhu": jp = "タイガー"
        elif en == "Loong": jp = "白龍"
        elif en == "Dong Zhuo": jp = "アタ" # Ata is Zhu Bajie? No, Ata is Ata. Zhu Bajie is Ata?
        elif en == "Wu Zetian": jp = "武則天" # maybe not in DB?
        elif en == "Zhong Kui": jp = "鍾馗 しょうき" if "鍾馗 しょうき" in hero_map else "鐘馗"
        # Let's dynamically check
        
# I will just write a function to search for jpName by reading hero_stats keys
for k, v in hero_stats.items():
    jp = v["jpName"]
    # ...

with open("scratch/check_aliases.py", "w", encoding="utf-8") as out:
    out.write("print('ok')")

