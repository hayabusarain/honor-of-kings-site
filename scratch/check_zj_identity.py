import json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('scratch/check_zj_identity.txt', 'w', encoding='utf-8') as f:
    for h in data:
        if 'チーシャ' in h['name'] or 'Zhaojun' in h.get('name_en', ''):
            f.write(f"{h['id']}: EN={h.get('name_en')}, JA={h['name']}, Title={h.get('title')}\n")
