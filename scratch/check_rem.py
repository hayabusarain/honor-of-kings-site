import json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
for h in data:
    if h['id'] in ['hero_007', 'hero_029']:
        print(f"ID: {h['id']}, JA: {h['name']}, EN: {h.get('name_en')} - {h.get('title')}")
