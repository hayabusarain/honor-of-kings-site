import json

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

names = {}
for h in data:
    en_name = h.get('name_en', '').strip()
    if not en_name: continue
    if en_name in names:
        names[en_name].append(h['id'])
    else:
        names[en_name] = [h['id']]

duplicates = {k: v for k, v in names.items() if len(v) > 1}
if duplicates:
    print("STILL DUPLICATES:", duplicates)
else:
    print("NO DUPLICATES!")
