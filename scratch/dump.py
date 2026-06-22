import json
with open('src/data/hok_heroes_raw.json', encoding='utf-8') as f:
    d = json.load(f)
with open('scratch/raw_names.txt', 'w', encoding='utf-8') as f:
    for x in d:
        f.write(f"{x['ename']}: {x['cname']}\n")
