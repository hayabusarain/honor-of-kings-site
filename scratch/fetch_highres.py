import json
import urllib.request
import os
import re
import time

def normalize_name(n):
    return re.sub(r'[^a-z0-9]', '', str(n).lower())

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    our_heroes = json.load(f)

with open('scratch/herolist.json', 'r', encoding='utf-8') as f:
    tencent_heroes = json.load(f)

# Build matching dictionaries
t_cname_map = {h['cname']: h for h in tencent_heroes}
t_idname_map = {normalize_name(h.get('id_name', '')): h for h in tencent_heroes}

# Known manual mappings (our name_en or name to Tencent cname)
manual_map = {
    "Laozi": "老夫子",
    "Fuzi": "老夫子", # Sometimes Fuzi is used
    "Dharma": "达摩",
    "Consort Yu": "虞姬",
    "Prince of Lanling": "兰陵王",
    "Musashi Miyamoto": "宫本武藏",
    "Ukyo Tachibana": "橘右京",
    "Mai Shiranui": "不知火舞",
    "Nakoruru": "娜可露露",
    "Zhuangzi": "庄周",
    "Mozi": "墨子",
    "Jiang Ziya": "姜子牙",
    "Yuanliu Child (Tank)": "元流之子",
    "Yuanliu Child (Mage)": "元流之子",
    "Yuanliu Child (Marksman)": "元流之子",
    "Nuwa": "女娲",
    "Wukong": "孙悟空",
    "Lumburr": "牛魔",
    "Zhaojun": "王昭君",
    "Angela": "安琪拉",
    "Arthur": "亚瑟",
    "Milady": "米莱狄",
    "Erin": "艾琳",
    "Doria": "朵莉亚"
}

# Also standard translation fixes for Japanese Kanji to Simplified Chinese
kanji_to_simp = {
    "頗": "颇", "喬": "乔", "趙": "赵", "雲": "云", "孫": "孙", "尚": "尚", "香": "香",
    "魯": "鲁", "班": "班", "號": "号", "荘": "庄", "劉": "刘", "禪": "禅", "漸": "渐",
    "離": "离", "軻": "轲", "鐘": "钟", "無": "无", "艶": "艳", "臏": "膑", "扁": "扁",
    "鵲": "鹊", "呂": "吕", "布": "布", "週": "周", "瑜": "瑜", "甄": "甄", "姫": "姬",
    "典": "典", "韋": "韦", "宮": "宫", "本": "本", "武": "武", "蔵": "藏", "達": "达",
    "磨": "摩", "項": "项", "羽": "羽", "司": "司", "馬": "马", "懿": "懿", "関": "关",
    "貂": "貂", "蝉": "蝉", "太": "太", "公": "公", "望": "望", "邦": "邦", "韓": "韩",
    "信": "信", "昭": "昭", "君": "君", "蘭": "兰", "陵": "陵", "王": "王", "張": "张",
    "良": "良", "橘": "橘", "右": "右", "京": "京", "飛": "飞", "虞": "虞", "美": "美",
    "人": "人", "馗": "馗", "楊": "杨", "貴": "贵", "妃": "妃", "戩": "戬"
}

def kanji_to_simplified(text):
    for k, v in kanji_to_simp.items():
        text = text.replace(k, v)
    return text

matched = 0
not_matched = []

for h in our_heroes:
    t_hero = None
    
    # 1. Manual map
    if h['name_en'] in manual_map and manual_map[h['name_en']] in t_cname_map:
        t_hero = t_cname_map[manual_map[h['name_en']]]
    elif h['name'] in manual_map and manual_map[h['name']] in t_cname_map:
        t_hero = t_cname_map[manual_map[h['name']]]
        
    # 2. Exact match on Japanese name (converted to simplified)
    if not t_hero:
        sim_name = kanji_to_simplified(h['name'].split('（')[0])
        if sim_name in t_cname_map:
            t_hero = t_cname_map[sim_name]
            
    # 3. Match by normalized English name
    if not t_hero:
        norm_en = normalize_name(h['name_en'])
        if norm_en in t_idname_map:
            t_hero = t_idname_map[norm_en]
            
    # 4. Partial match on id_name
    if not t_hero:
        for tid, th in t_idname_map.items():
            if tid in norm_en or norm_en in tid:
                t_hero = th
                break
                
    if t_hero:
        matched += 1
        ename = t_hero['ename']
        url = f'https://game.gtimg.cn/images/yxzj/img201606/heroimg/{ename}/{ename}.jpg'
        out_path = f"public/images/heroes/{h['id']}.jpg"
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            data = urllib.request.urlopen(req).read()
            with open(out_path, 'wb') as imgf:
                imgf.write(data)
            print(f"Downloaded {h['name_en']} -> {ename}.jpg")
        except Exception as e:
            print(f"Failed to download {h['name_en']} from {url}")
            not_matched.append(h['name_en'])
        
        time.sleep(0.1) # Be nice
    else:
        not_matched.append(h['name_en'])
        print(f"No match found for: {h['name']} / {h['name_en']}")

print(f"Total matched: {matched}/{len(our_heroes)}")
if not_matched:
    print("Unmatched:", not_matched)
