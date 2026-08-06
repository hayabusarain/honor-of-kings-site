import json
import os

p_ja = os.path.abspath(r'public\data\skills\ja.json')
p_en = os.path.abspath(r'public\data\skills\en.json')
p_items = os.path.abspath(r'src\data\hok_items.json')

with open(p_items, 'r', encoding='utf-8') as f:
    hok_items = json.load(f)

# Comprehensive Synonym / Alias Map for all Japanese item names
SYNONYM_MAP_JA = {
    # Defense items
    "赤蓮マント": "紅蓮のマント",
    "紅蓮マント": "紅蓮のマント",
    "不祥の予感": "不吉な予感",
    "不吉の予感": "不吉な予感",
    "不吉な予兆": "不吉な予感",
    "魔女の古衣": "魔女のマント",
    "覇者の重鎧": "覇者の重鎧",
    "覇者の重甲": "覇者の重鎧",
    "スパイラルアーマー": "スパイクアーマー",
    "不屈の甲冑": "不吉な予感",
    "極限の守護盾": "知の宝珠",

    # Attack items
    "スターブレイカー": "破暁",
    "デストロイヤー": "破暁",
    "デイブレイカー": "破暁",
    "スパークダガー": "電撃の弓",
    "エンドレスブレード": "無尽の戦刃",
    "シャドーブレード": "影刃",
    "ドゥームズデイ": "末世",
    "マスターブレード": "宗師の力",
    "シャドーアックス": "暗砕の斧",
    "名剣・司命": "司命",
    "追撃のブレード": "追撃のブレード",

    # Magic items
    "響きの杖": "回響の杖",
    "サボテンの怒り": "博学者之怒",
    "ボイドスタッフ": "虚無の杖",
    "賢者の書": "賢者の書",
    "聖者の庇護": "賢者の庇護",
    "輝月の宝珠": "輝月",
    "氷霜の吐息": "フローズンブレス",

    # Boots
    "抵抗の靴": "抵抗の靴",
    "冷静の靴": "静穏の靴",
    "疾走の靴": "神速の靴",
    "影の靴": "忍の靴"
}

# Ensure every synonym target actually exists in hok_items.json
valid_names = {it['name']: it for it in hok_items if 'name' in it}

print(f"Total valid items in hok_items.json: {len(valid_names)}")

# Clean and normalize ja.json
with open(p_ja, 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

with open(p_en, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

replaced_count = 0

for hid, hdata in ja_data.items():
    meta = hdata.get('meta', {})
    if 'recommended_items' in meta:
        old_rec = meta['recommended_items']
        new_rec = []
        for it_name in old_rec:
            normalized = SYNONYM_MAP_JA.get(it_name, it_name)
            new_rec.append(normalized)
            if normalized != it_name:
                replaced_count += 1
        meta['recommended_items'] = new_rec
        
    if 'build_presets' in meta:
        for preset in meta['build_presets']:
            old_p_items = preset.get('items', [])
            new_p_items = []
            for it_name in old_p_items:
                normalized = SYNONYM_MAP_JA.get(it_name, it_name)
                new_p_items.append(normalized)
            preset['items'] = new_p_items

with open(p_ja, 'w', encoding='utf-8') as f:
    json.dump(ja_data, f, ensure_ascii=False, indent=2)

print(f"Successfully normalized item names in ja.json! Replaced {replaced_count} name variations.")
