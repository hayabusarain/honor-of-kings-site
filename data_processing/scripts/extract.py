import json

with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\public\data\skills\ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

heroes = [f'hero_{str(i).zfill(3)}' for i in range(99, 113)]

for h in heroes:
    if h in data:
        hero = data[h]
        print(f"--- {h}: {hero.get('hero_name')} ({hero.get('role')}) ---")
        print(f"Passive: {hero.get('passive', {}).get('name')}: {hero.get('passive', {}).get('description')}")
        for i in range(1, 4):
            skill = hero.get(f'skill{i}', {})
            print(f"Skill {i}: {skill.get('name')}: {skill.get('description')}")
        print()
