import json
import re

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/src/data/hero_stats_camp.json", "r", encoding="utf-8") as f:
    hero_stats = json.load(f)

with open("C:/Users/81901/.gemini/antigravity/brain/f96a5591-ba25-4a35-b1b0-aaa6007f2425/scratch/new_tier_data.json", "r", encoding="utf-8") as f:
    tier_data = json.load(f)

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/scratch/jp_to_eng.json", "r", encoding="utf-8") as f:
    jp_to_eng = json.load(f)
    
# Clean up hero stats and find mapping
en_to_jp_from_dict = {v: k for k, v in jp_to_eng.items()}
# add reverse mapping from jp_to_eng where there are multiples? 
# let's just make a comprehensive dict:

jpName_to_hero_id = {v["jpName"]: k for k, v in hero_stats.items()}

# We'll map English -> hero_id
eng_to_hero_id = {}

for jp, en in jp_to_eng.items():
    if jp in jpName_to_hero_id:
        eng_to_hero_id[en] = jpName_to_hero_id[jp]
        
# Add custom aliases
aliases = {
    "Wukong": "Sun Wukong",
    "Zhaojun": "Wang Zhaojun",
    "Pei Qinhu": "Pei",
    "Baili Xuance": "Xuance",
    "Baili Shouyue": "Shouyue",
    "Zhuge Liang": "Kongming",
    "Gongsun Li": "Arli",
    "Gao Jianli": "Gao",
    "Yao": "Yaria",
    "Dong Zhuo": "Zhu Bajie", 
    "Wu Zetian": "Wu Ze Tian",
    "Yunzhongjun": "Yun Zhongjun",
    "Haoyue": "Hai Yue",
    "Bairidian": "Shouyue",
    "Arke": "Arke",
    "Feyd": "Fuzi",
    "Loong": "Ao'yin",
    "Chano": "Chicha",
    "Arthur": "Arthur",
    "Diaochan": "Diaochan",
    "Luban No.7": "Luban No.7",
    "Hou Yi": "Hou Yi",
    "Li Bai": "Li Bai",
    "Han Xin": "Han Xin",
    "Marco Polo": "Marco Polo",
    "Angela": "Angela",
    "Da Qiao": "Da Qiao",
    "Xiao Qiao": "Xiao Qiao",
    "Mulan": "Mulan",
    "Zhuangzi": "Zhuangzi",
    "Daji": "Daji",
    "Jing": "Jing",
    "Lan": "Lam",
    "Shangguan Wan'er": "Shangguan",
    "Augran": "Augran",
    "Lam": "Lam",
    "Cai Wenji": "Cai Yan",
    "Zhong Kui": "Kui",
    "Mozi": "Mozi",
    "Ying Zheng": "Ying Zheng",
    "Xiang Yu": "Xiang Yu",
    "Liu Bang": "Liu Bang",
    "Liu Bei": "Liu Bei",
    "Guan Yu": "Guan Yu",
    "Zhang Fei": "Zhang Fei",
    "Huang Zhong": "Huang Zhong",
    "Ma Chao": "Ma Chao",
    "Sun Ce": "Sun Ce",
    "Zhou Yu": "Zhou Yu",
    "Sun Shangxiang": "Lady Sun",
    "Lu Bu": "Lu Bu",
    "Cao Cao": "Cao Cao",
    "Sima Yi": "Sima Yi",
    "Xiahou Dun": "Dun",
    "Dian Wei": "Dian Wei",
    "Zhen Ji": "Zhen Ji",
    "Bian Que": "Dr Bian",
    "Cheng Yaojin": "Cheng Yaojin",
    "Nuwa": "Nuwa",
    "Pangu": "Pangu",
    "Nezha": "Nezha",
    "Yang Jian": "Yang Jian",
    "Chang'e": "Chang'e",
    "Yang Yuhuan": "Yuhuan",
    "Ukyo Tachibana": "Ukyo Tachibana",
    "Nakoruru": "Nakoruru",
    "Mai Shiranui": "Mai Shiranui",
    "Erin": "Erin",
    "Milady": "Milady",
    "Consort Yu": "Consort Yu",
    "Biron": "Biron",
    "Lian Po": "Lian Po",
    "Su Lie": "Su Lie",
    "Shen Mengxi": "Shen Mengxi",
    "A Ke": "A Ke",
    "Ming Shiyin": "Ming Shiyin",
    "Yixing": "Yixing",
    "Wuyan": "Wuyan",
    "Sun Bin": "Sun Bin",
    "Agudo": "Agudo",
    "Alessio": "Alessio",
    "Ao'yin": "Ao'yin",
    "Arli": "Arli",
    "Athena": "Athena",
    "Cirrus": "Yun Zhongjun",
    "Gao Changgong": "Gao Changgong",
    "Li Xin": "Li Xin",
    "Kaizer": "Kaizer"
}

# Some extra JP fallback mappings if not in eng_to_hero_id
extra_jp_fallback = {
    "Chang'e": "嫦娥",
    "Cheng Yaojin": "程咬金",
    "Pangu": "盤古",
    "Su Lie": "蘇烈",
    "Shen Mengxi": "沈夢渓",
    "Wu Ze Tian": "武則天",
    "Ying Zheng": "嬴政",
    "Ma Chao": "馬超",
    "Dong Zhuo": "董卓",
    "Pei": "タイガー",
}

for en_name, target in aliases.items():
    if target in eng_to_hero_id:
        pass
    else:
        # maybe extra fallback?
        jp = extra_jp_fallback.get(target)
        if jp and jp in jpName_to_hero_id:
            eng_to_hero_id[target] = jpName_to_hero_id[jp]

missing = []
for en_name in tier_data.keys():
    target = aliases.get(en_name, en_name)
    if target not in eng_to_hero_id:
        if en_name not in eng_to_hero_id:
            missing.append(en_name)

if len(missing) == 0:
    print("All matched!")
else:
    print("Missing:", missing)

# Now write the data to hero_stats
for en_name, data in tier_data.items():
    target = aliases.get(en_name, en_name)
    hero_id = eng_to_hero_id.get(target) or eng_to_hero_id.get(en_name)
    if hero_id and hero_id in hero_stats:
        hero_stats[hero_id]["tier"] = data["tier"]
        hero_stats[hero_id]["win_rate"] = data["win_rate"]
        hero_stats[hero_id]["pick_rate"] = data["pick_rate"]
        hero_stats[hero_id]["ban_rate"] = data["ban_rate"]

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/src/data/hero_stats_camp.json", "w", encoding="utf-8") as f:
    json.dump(hero_stats, f, indent=2, ensure_ascii=False)

print("Saved hero_stats_camp.json")
