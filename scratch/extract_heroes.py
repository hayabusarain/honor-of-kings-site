import json
with open('C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
targets = ['橘右京', '瀾', '王昭君', '百里玄策', '項羽']

out = {}
for hero_id, hero in data.items():
    if hero.get('hero_name') in targets:
        out[hero_id] = {
            'name': hero['hero_name'],
            'passive': hero.get('passive', {}),
            'skill1': hero.get('skill1', {}),
            'skill2': hero.get('skill2', {}),
            'skill3': hero.get('skill3', {}),
            'skill4': hero.get('skill4', {})
        }

with open('C:/Users/81901/Desktop/オナーオブキングスサイト/scratch/hero_skills_dump.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
