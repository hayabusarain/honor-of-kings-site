import json

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/src/data/hero_stats_camp.json", "r", encoding="utf-8") as f:
    hero_stats = json.load(f)

with open("C:/Users/81901/.gemini/antigravity/brain/f96a5591-ba25-4a35-b1b0-aaa6007f2425/scratch/new_tier_data.json", "r", encoding="utf-8") as f:
    tier_data = json.load(f)

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/scratch/jp_to_eng.json", "r", encoding="utf-8") as f:
    jp_to_eng = json.load(f)

# jp to hero_XXX
jp_to_hero = {}
for hero_id, data in hero_stats.items():
    jp_to_hero[data["jpName"]] = hero_id

# hero_XXX to eng (from jp_to_eng)
hero_to_eng = {}
for jp, eng in jp_to_eng.items():
    if jp in jp_to_hero:
        hero_to_eng[jp_to_hero[jp]] = eng

# eng to hero_XXX
eng_to_hero = {eng: hero_id for hero_id, eng in hero_to_eng.items()}

# Match names
matched = 0
unmatched_tiers = []
hero_id_to_tier_data = {}

# Some hardcoded aliases we might know
aliases = {
    "Wukong": "Sun Wukong",
    "Zhaojun": "Wang Zhaojun",
    "Pei Qinhu": "Pei",
    "Baili Xuance": "Xuance",
    "Baili Shouyue": "Shouyue",
    "Zhuge Liang": "Kongming",
    "Gongsun Li": "Arli",
    "Gao Jianli": "Gao",
    "Yao": "Yaria", # 瑶 is Yaria
    "Dong Zhuo": "Zhu Bajie", # Wait, Dong Zhuo?
    "Wu Zetian": "Wu Ze Tian",
    "Yunzhongjun": "Yun Zhongjun",
    "Haoyue": "Hai Yue",
    "Bairidian": "Baili Shouyue",
    "Arke": "Arke",
    "Feyd": "Fuzi", # Wait, Fuzi is Fuzi.
    "Loong": "Ao'yin", # Wait
    "Chano": "Chicha",
}

for eng_name, stats in tier_data.items():
    search_name = aliases.get(eng_name, eng_name)
    if search_name in eng_to_hero:
        matched += 1
        hero_id_to_tier_data[eng_to_hero[search_name]] = stats
    else:
        # Try finding by partial match
        found = False
        for e, h in eng_to_hero.items():
            if search_name.lower() in e.lower() or e.lower() in search_name.lower():
                hero_id_to_tier_data[h] = stats
                matched += 1
                found = True
                print(f"Matched by substring: {eng_name} -> {e}")
                break
        if not found:
            unmatched_tiers.append(eng_name)

print(f"Matched: {matched}/{len(tier_data)}")
print("Unmatched in tier data:", unmatched_tiers)

# Also find which heroes in db have no tier data
unmatched_db = []
for h, eng in hero_to_eng.items():
    if h not in hero_id_to_tier_data:
        unmatched_db.append(eng)
print("Unmatched in DB:", unmatched_db)
