import json

data = json.load(open('c:/Users/81901/Desktop/scratch_hero_data.json', encoding='utf-8'))
with open('c:/Users/81901/Desktop/summary.txt', 'w', encoding='utf-8') as f:
    for k, v in data.items():
        f.write(f"\n--- {k} ({v.get('hero_name')}) ---\n")
        f.write(f"Role: {v.get('role')} {v.get('sub_role')}\n")
        f.write(f"Passive: {v.get('passive', {}).get('name')}: {v.get('passive', {}).get('description')}\n")
        for i in range(1, 5):
            sk = v.get(f'skill{i}', {})
            if sk:
                f.write(f"Skill {i}: {sk.get('name')} (Tags: {sk.get('tags')}) - {sk.get('description')}\n")
