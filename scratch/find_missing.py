import json
with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
missing = []
for h_id, h_data in data.items():
    strategy = h_data.get('strategy', {})
    if not strategy:
        missing.append(h_data.get('hero_name', h_id))
    elif '見つかりません' in str(strategy.get('earlyGame', '')) or not strategy.get('earlyGame'):
        missing.append(h_data.get('hero_name', h_id))

with open('scratch/missing.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(missing))
