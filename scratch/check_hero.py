import json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

ids_to_check = ['hero_007', 'hero_088', 'hero_064', 'hero_066', 'hero_079', 'hero_082', 'hero_080', 'hero_097', 'hero_085', 'hero_095', 'hero_059']

with open('scratch/hero_check.txt', 'w', encoding='utf-8') as out:
    for h in data:
        if h['id'] in ids_to_check:
            out.write(f"{h['id']}: {h['name']} ({h.get('name_en')}) - {h.get('title')} - Alias: {h.get('search_alias')}\n")
