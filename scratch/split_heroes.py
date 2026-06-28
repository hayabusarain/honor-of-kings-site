import json
import os
import math

os.makedirs('scratch/scraper/tasks', exist_ok=True)
os.makedirs('scratch/scraper/outputs', exist_ok=True)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

chunk_size = 10
num_chunks = math.ceil(len(heroes) / chunk_size)

for i in range(num_chunks):
    chunk = heroes[i*chunk_size:(i+1)*chunk_size]
    with open(f'scratch/scraper/tasks/task_{i+1}.md', 'w', encoding='utf-8') as f:
        f.write('# Hero Strategy Extraction Task\n\n')
        f.write('Extract the strategy for the following heroes from ZillionGamer, HoK Camp, or HoKStats.gg:\n\n')
        for h in chunk:
            name_en = h.get('name_en', h['name'])
            f.write(f'- ID: {h["id"]}, Name (EN): {name_en}, Name (JA): {h["name"]}\n')
