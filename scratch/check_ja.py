import json

with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('scratch/check_ja.txt', 'w', encoding='utf-8') as out:
    for k in ['hero_001', 'hero_002', 'hero_003', 'hero_004', 'hero_005']:
        out.write(f"{k}: {data[k]['hero_name']}\n")
