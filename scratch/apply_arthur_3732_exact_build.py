import json
import os

p_ja = os.path.abspath(r'public\data\skills\ja.json')
p_en = os.path.abspath(r'public\data\skills\en.json')

with open(p_ja, 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

with open(p_en, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

arthur_exact_ja = ["抵抗の靴", "紅蓮のマント", "暗砕の斧", "不吉な予感", "ブラッドレイジ", "フロストショック"]
arthur_exact_en = ["Boots of Resistance", "Crimson Cloak", "Shadow Axe", "Ominous Premonition", "Blood Rage", "Frost Shock"]

preset_ja = {
    "name": "人気セット装備 (Popular Build #1)",
    "title": "人気セット装備",
    "wins": 21387,
    "win_rate": "57.2%",
    "items": arthur_exact_ja
}

preset_en = {
    "name": "Popular Build #1",
    "title": "Popular Build #1",
    "wins": 21387,
    "win_rate": "57.2%",
    "items": arthur_exact_en
}

if '166' in ja_data:
    ja_data['166']['meta']['recommended_items'] = arthur_exact_ja
    ja_data['166']['meta']['build_presets'] = [preset_ja]

if '166' in en_data:
    en_data['166']['meta']['recommended_items'] = arthur_exact_en
    en_data['166']['meta']['build_presets'] = [preset_en]

with open(p_ja, 'w', encoding='utf-8') as f:
    json.dump(ja_data, f, ensure_ascii=False, indent=2)

with open(p_en, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Applied exact screenshot (3732).png build to Arthur (166) in ja.json & en.json!")
