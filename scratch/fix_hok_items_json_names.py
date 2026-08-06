import json
import os

p_items = os.path.abspath(r'src\data\hok_items.json')

with open(p_items, 'r', encoding='utf-8') as f:
    items = json.load(f)

# Common synonyms for item names in Honor of Kings
ALIASES_TABLE = {
    "1331": ["紅蓮のマント", "赤蓮マント", "紅蓮マント", "Crimson Cloak", "Blazing Cape"],
    "1333": ["不吉な予感", "不吉な予兆", "不祥の予感", "不吉の予感", "Bad Omen", "Ominous Premonition"],
    "1335": ["魔女のマント", "魔女の古衣", "Witch's Cloak", "Witch Cloak"],
    "1332": ["覇者の重鎧", "覇者の重甲", "Conqueror's heavy armor", "Overlord's Platemail"],
    "1137": ["暗砕の斧", "シャドーアックス", "Shadow Axe", "Black Axe"],
    "11311": ["破暁", "スターブレイカー", "デイブレイカー", "Daybreaker", "Starbreaker"],
    "1157": ["司命", "名剣・司命", "Sage's Refuge", "Famous Sword"],
    "1231": ["回響の杖", "響きの杖", "Scepter of Reverberation", "Echo Staff"],
    "1232": ["博学者之怒", "サボテンの怒り", "Savant's Wrath", "Scholar's Wrath"],
    "1235": ["虚無の杖", "ボイドスタッフ", "Void Staff"],
    "1238": ["賢者の書", "Philosopher's Book", "Book of the Sage"],
    "1234": ["フローズンブレス", "氷霜の吐息", "Frozen Breath", "Frost Breath"],
    "1136": ["電撃の弓", "スパークダガー", "Spark Dagger", "Lightning Bow"],
    "1133": ["無尽の戦刃", "エンドレスブレード", "Endless Blade"],
    "1134": ["宗師の力", "マスターブレード", "Master Blade"],
    "1135": ["末世", "ドゥームズデイ", "Doomsday"],
    "1422": ["抵抗の靴", "Boots of Resistance", "Resistance Shoes"],
    "1423": ["静穏の靴", "冷静の靴", "Boots of Tranquility", "Tranquility Shoes"]
}

for item in items:
    iid = str(item.get('id', ''))
    if iid in ALIASES_TABLE:
        existing_aliases = item.get('aliases', [])
        new_aliases = list(set(existing_aliases + ALIASES_TABLE[iid]))
        item['aliases'] = new_aliases

with open(p_items, 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print(f"Updated {len(items)} items in hok_items.json with rich alias metadata!")
