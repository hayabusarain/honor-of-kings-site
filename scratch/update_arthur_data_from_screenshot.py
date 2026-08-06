import json

# Update ja.json
with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

if "166" in ja_data:
    arthur_ja = ja_data["166"]
    if "meta" not in arthur_ja:
        arthur_ja["meta"] = {}
        
    arthur_ja["meta"]["recommended_items"] = [
        "抵抗の靴",
        "紅蓮のマント",
        "サンライズケープ",
        "不死鳥の目",
        "ブリザード",
        "覇者の重装"
    ]
    
    arthur_ja["meta"]["build_presets"] = [
        {
            "name": "人気セット装備 (In-Game Preset #1)",
            "title": "クラッシュ1 人気のセット",
            "wins": 10156,
            "win_rate": "59.68%",
            "items": [
                "抵抗の靴",
                "紅蓮のマント",
                "サンライズケープ",
                "不死鳥の目",
                "ブリザード",
                "覇者の重装"
            ]
        }
    ]
    
    arthur_ja["meta"]["summoner_spells"] = [
        "ターミネート"
    ]
    
    arthur_ja["meta"]["recommended_arcana"] = [
        {"name": "宿命", "count": 10, "stats": "攻撃速度+0.2%, 最大HP+6.3, 物理防御+0.4"},
        {"name": "調和", "count": 10, "stats": "最大HP+8.4, HP回復+1, 移動速度+0.5%"},
        {"name": "虚空", "count": 10, "stats": "最大HP+7.5, クールダウン短縮+0.6%"}
    ]

with open('public/data/skills/ja.json', 'w', encoding='utf-8') as f:
    json.dump(ja_data, f, ensure_ascii=False, indent=2)

print("Updated Arthur in public/data/skills/ja.json!")

# Update en.json
with open('public/data/skills/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

if "166" in en_data:
    arthur_en = en_data["166"]
    if "meta" not in arthur_en:
        arthur_en["meta"] = {}
        
    arthur_en["meta"]["recommended_items"] = [
        "Boots of Resistance",
        "Blazing Cape",
        "Sunrise Cape",
        "Eye of the Phoenix",
        "Glacial Buckler",
        "Overlord's Platemail"
    ]
    
    arthur_en["meta"]["build_presets"] = [
        {
            "name": "Popular Build #1",
            "title": "Clash Lane Popular Build",
            "wins": 10156,
            "win_rate": "59.68%",
            "items": [
                "Boots of Resistance",
                "Blazing Cape",
                "Sunrise Cape",
                "Eye of the Phoenix",
                "Glacial Buckler",
                "Overlord's Platemail"
            ]
        }
    ]
    
    arthur_en["meta"]["summoner_spells"] = [
        "Execute"
    ]
    
    arthur_en["meta"]["recommended_arcana"] = [
        {"name": "Fate", "count": 10, "stats": "Attack Speed+0.2%, Max HP+6.3, Physical Armor+0.4"},
        {"name": "Harmony", "count": 10, "stats": "Max HP+8.4, HP Regen+1, Movement Speed+0.5%"},
        {"name": "Void", "count": 10, "stats": "Max HP+7.5, Cooldown Reduction+0.6%"}
    ]

with open('public/data/skills/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Updated Arthur in public/data/skills/en.json!")
