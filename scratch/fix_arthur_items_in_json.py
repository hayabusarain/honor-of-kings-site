import json

# Load ja.json & en.json
with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

with open('public/data/skills/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

arthur_ja_items = ["赤蓮マント", "抵抗の靴", "シャドーアックス", "不祥の予感", "魔女の古衣", "覇者の重鎧"]
arthur_en_items = ["Blazing Cape", "Boots of Resistance", "Shadow Axe", "Ominous Premonition", "Witch's Cloak", "Overlord's Platemail"]

# Update Arthur in ja.json
if '166' in ja_data:
    ja_data['166']['meta']['recommended_items'] = arthur_ja_items
    if 'build_presets' in ja_data['166']['meta']:
        for p in ja_data['166']['meta']['build_presets']:
            p['items'] = arthur_ja_items

# Update Arthur in en.json
if '166' in en_data:
    en_data['166']['meta']['recommended_items'] = arthur_en_items
    if 'build_presets' in en_data['166']['meta']:
        for p in en_data['166']['meta']['build_presets']:
            p['items'] = arthur_en_items

with open('public/data/skills/ja.json', 'w', encoding='utf-8') as f:
    json.dump(ja_data, f, ensure_ascii=False, indent=2)

with open('public/data/skills/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Successfully fixed Arthur's build in ja.json & en.json!")
