import json

with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('scratch/test_strategy.txt', 'w', encoding='utf-8') as out:
    for hero_id in ['hero_001', 'hero_002', 'hero_008', 'hero_010', 'hero_050']:
        out.write(f"{hero_id} ({data[hero_id].get('hero_name')}): {data[hero_id].get('strategy', {}).get('earlyGame', '')[:30]}...\n")
