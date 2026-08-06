import json
import os

p_ja = os.path.abspath(r'public\data\skills\ja.json')
p_en = os.path.abspath(r'public\data\skills\en.json')

ITEM_ALIAS_MAP_JA = {
    "赤蓮マント": "紅蓮のマント",
    "不祥の予感": "不吉な予感",
    "魔女の古衣": "魔女のマント",
    "聖者の庇護": "輝月の宝珠",
    "名剣・司命": "名剣・司命",
    "スターブレイカー": "破暁"
}

with open(p_ja, 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

with open(p_en, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

arthur_ja_items = ["紅蓮のマント", "抵抗の靴", "シャドーアックス", "不吉な予感", "魔女のマント", "覇者の重鎧"]
arthur_en_items = ["Crimson Cloak", "Boots of Resistance", "Shadow Axe", "Ominous Premonition", "Witch's Cloak", "Conqueror's heavy armor"]

if '166' in ja_data:
    ja_data['166']['meta']['recommended_items'] = arthur_ja_items
    if 'build_presets' in ja_data['166']['meta']:
        for p in ja_data['166']['meta']['build_presets']:
            p['items'] = arthur_ja_items

if '166' in en_data:
    en_data['166']['meta']['recommended_items'] = arthur_en_items
    if 'build_presets' in en_data['166']['meta']:
        for p in en_data['166']['meta']['build_presets']:
            p['items'] = arthur_en_items

for hid in ja_data:
    if 'meta' in ja_data[hid]:
        rec = ja_data[hid]['meta'].get('recommended_items', [])
        new_rec = [ITEM_ALIAS_MAP_JA.get(item, item) for item in rec]
        ja_data[hid]['meta']['recommended_items'] = new_rec
        
        if 'build_presets' in ja_data[hid]['meta']:
            for p in ja_data[hid]['meta']['build_presets']:
                p_items = p.get('items', [])
                p['items'] = [ITEM_ALIAS_MAP_JA.get(item, item) for item in p_items]

with open(p_ja, 'w', encoding='utf-8') as f:
    json.dump(ja_data, f, ensure_ascii=False, indent=2)

with open(p_en, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Fixed all item name aliases in ja.json & en.json!")
