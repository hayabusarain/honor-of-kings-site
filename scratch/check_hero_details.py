import json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

targets = ['hero_007', 'hero_029', 'hero_056', 'hero_059', 'hero_064', 'hero_079', 'hero_080', 'hero_101']
with open('scratch/hero_details.txt', 'w', encoding='utf-8') as out:
    for h in data:
        if h['id'] in targets:
            out.write(f"{h['id']}: JA={h['name']} EN={h.get('name_en')} Role={h.get('role')} Image={h.get('image')}\n")
