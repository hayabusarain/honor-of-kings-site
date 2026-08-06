import json
import os

base_folder = r'C:\Users\81901\Pictures\Screenshots'
dirs = os.listdir(base_folder)
used_heroes = set()
for d in dirs:
    if d.startswith('Set_'):
        parts = d.split('_')
        if len(parts) >= 3:
            used_heroes.add(parts[2])

with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

missing = []
for h in heroes:
    if h['name'] not in used_heroes:
        missing.append(h['name'])

for m in missing:
    print(m.encode('utf-8'))
