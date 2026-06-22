import json

# The duplicate heroes mapped to their new IDs
dup_map = {
    "hero_002": "hero_9003",
    "hero_006": "hero_9004",
    "hero_064": "hero_9005",
    "hero_092": "hero_9006",
    "hero_104": "hero_9007",
    "hero_109": "hero_9008",
    "hero_018": "hero_9009",
    "hero_112": "hero_9010",
    "hero_038": "hero_9011",
    "hero_073": "hero_9012"
}

# The names parsed from the subagents output
# (I will just parse the json to get their names)
with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

heroes_file = 'src/data/hok_heroes.json'
with open(heroes_file, 'r', encoding='utf-8') as f:
    roster = json.load(f)

for old_id, new_id in dup_map.items():
    if new_id in ja_data:
        lore = ja_data[new_id].get('lore', '')
        # Name is usually the first part of lore
        name = lore.split(' ')[0] if ' ' in lore else "Unknown"
        if '\n' in name:
            name = name.split('\n')[0]
        
        roles = []
        if 'ロール:' in lore:
            roles_part = lore.split('ロール:')[1].split('\n')[0].strip()
            roles = [r.strip() for r in roles_part.split('/')]
        elif '役割：' in lore:
            roles_part = lore.split('役割：')[1].split('。')[0].strip()
            roles = [r.strip() for r in roles_part.split('/')]

        # Convert roles
        role_map = {
            "ファイター": "Fighter",
            "メイジ": "Mage",
            "アサシン": "Assassin",
            "マークスマン": "Marksman",
            "サポート": "Support",
            "タンク": "Tank"
        }
        eng_roles = [role_map.get(r, "Fighter") for r in roles]
        if not eng_roles: eng_roles = ["Fighter"]
        
        roster.append({
            "id": new_id,
            "name": name,
            "role": eng_roles,
            "image": f"/images/heroes/{new_id}.jpg"
        })

# Save roster
with open(heroes_file, 'w', encoding='utf-8') as f:
    json.dump(roster, f, ensure_ascii=False, indent=2)

print(f"Added {len(dup_map)} duplicated heroes to hok_heroes.json!")

stats_file = 'src/data/hero_stats.json'
with open(stats_file, 'r', encoding='utf-8') as f:
    stats = json.load(f)

for old_id, new_id in dup_map.items():
    stats[new_id] = {
        "survivability": 50,
        "attackDamage": 50,
        "skillEffects": 50,
        "difficulty": 50
    }

with open(stats_file, 'w', encoding='utf-8') as f:
    json.dump(stats, f, ensure_ascii=False, indent=2)
    
print("Added to hero_stats.json!")
