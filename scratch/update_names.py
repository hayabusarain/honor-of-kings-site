import json

file_path = 'src/data/hok_heroes.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Name mappings
updates = {
    'hero_064': 'Genghis Khan',
    'hero_079': 'Yi Xing',
    'hero_080': 'Meng Qi',
    'hero_085': 'Yaria',
    'hero_095': 'Dongfang Yao',
    'hero_101': 'Sakeer',
    'hero_059': 'Chixia'
}

for h in data:
    if h['id'] in updates:
        h['name_en'] = updates[h['id']]

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated hok_heroes.json")
