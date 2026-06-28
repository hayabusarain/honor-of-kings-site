import json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

targets = ['チーシャ', 'ファーティフ', 'モンキ', 'ラプール', '棋星', '啓', '蒼', 'カルラ']
with open('scratch/user_heroes.txt', 'w', encoding='utf-8') as out:
    for h in data:
        if h['name'] in targets:
            out.write(f"{h['id']}: JA={h['name']} EN={h.get('name_en')} Title={h.get('title')}\n")
