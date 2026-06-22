import json

with open('C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    
    found = []
    for hero_id, hero_data in data.items():
        name = hero_data.get('hero_name', '')
        if name in ['劉邦', '呂布', '周瑜', '大司命', '孫策']:
            found.append(f"{name}: {hero_id}")
            for key in ['passive', 'skill1', 'skill2', 'skill3', 'skill4']:
                skill = hero_data.get(key)
                if skill:
                    desc = skill.get('description', '').replace('\n', ' ')
                    found.append(f"  {key}: {desc[:100]}...")
    
    with open('C:/Users/81901/Desktop/scratch_output.txt', 'w', encoding='utf-8') as out:
        out.write('\n'.join(found))
