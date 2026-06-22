import json

with open('C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

targets = ['アグド', 'アレン', 'カイザー', 'ドリア', 'ハイノ']
for k, v in data.items():
    if v.get('hero_name') in targets:
        print(f"{v['hero_name']}: {k}")
