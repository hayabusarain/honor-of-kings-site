import json
with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

for h in heroes:
    if '干将' in h['name'] or 'かんしょう' in h.get('search_alias', ''):
        print('67 is:', h['name'].encode('utf-8'))
