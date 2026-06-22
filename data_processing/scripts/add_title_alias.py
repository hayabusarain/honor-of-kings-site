import json
import pykakasi

kks = pykakasi.kakasi()

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

for h in heroes:
    if 'title' in h and h['title']:
        result = kks.convert(h['title'])
        hiragana = ''.join([item['hira'] for item in result])
        h['title_alias'] = hiragana

with open('src/data/hok_heroes.json', 'w', encoding='utf-8') as f:
    json.dump(heroes, f, ensure_ascii=False, indent=2)

print("Successfully added title_alias to hok_heroes.json")
