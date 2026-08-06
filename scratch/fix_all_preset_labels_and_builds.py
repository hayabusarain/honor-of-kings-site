import json

# Load ja.json & en.json
with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

with open('public/data/skills/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Fix Arthur (166) specifically to match exact tank/clash build
ja_data['166']['meta']['recommended_items'] = ["赤蓮マント", "抵抗の靴", "シャドーアックス", "不祥の予感", "魔女の古衣", "覇者の重鎧"]
en_data['166']['meta']['recommended_items'] = ["Blazing Cape", "Boots of Resistance", "Shadow Axe", "Ominous Premonition", "Witch's Cloak", "Overlord's Platemail"]

# Clean all preset titles to match exact in-game UI: "人気セット装備" / "Popular Item Build"
for hid in ja_data:
    if 'meta' in ja_data[hid] and 'build_presets' in ja_data[hid]['meta']:
        presets = ja_data[hid]['meta']['build_presets']
        for p in presets:
            p['name'] = "人気セット装備 (Popular Item Build)"
            p['title'] = "人気セット装備"
            
for hid in en_data:
    if 'meta' in en_data[hid] and 'build_presets' in en_data[hid]['meta']:
        presets = en_data[hid]['meta']['build_presets']
        for p in presets:
            p['name'] = "Popular Item Build"
            p['title'] = "Popular Item Build"

with open('public/data/skills/ja.json', 'w', encoding='utf-8') as f:
    json.dump(ja_data, f, ensure_ascii=False, indent=2)

with open('public/data/skills/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Cleaned all preset titles to '人気セット装備' / 'Popular Item Build' and updated Arthur's items!")
