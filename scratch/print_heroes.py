import json
with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)
for h in heroes:
    print(h['name'], h.get('name_en'))
