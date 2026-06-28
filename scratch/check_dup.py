import json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('scratch/dup_names.txt', 'w', encoding='utf-8') as out:
    names = {}
    for h in data:
        en_name = h.get('name_en', '').strip()
        if not en_name: continue
        if en_name in names:
            names[en_name].append((h['id'], h['name']))
        else:
            names[en_name] = [(h['id'], h['name'])]

    for name, items in names.items():
        if len(items) > 1:
            out.write(f'{name} -> {items}\n')
