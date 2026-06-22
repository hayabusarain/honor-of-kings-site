import json
import os

processed_dir = 'C:/Users/81901/Desktop/screenshots/processed'
files = os.listdir(processed_dir)

final_ja = {}
final_en = {}
final_roster = []
final_stats = {}

count = 0

for i in range(1, 113):
    hero_id = f"hero_{i:03d}"
    json_path = os.path.join(processed_dir, f"{hero_id}_data.json")
    
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # The key inside the file is usually "hero_XXX"
        if hero_id in data:
            hero_data = data[hero_id]
        else:
            hero_data = data
            
        final_ja[hero_id] = hero_data
        final_en[hero_id] = hero_data
        
        # Roster mapping
        lore = hero_data.get('lore', '')
        name = lore.split(' ')[0] if ' ' in lore else hero_id
        if '\n' in name:
            name = name.split('\n')[0]
        if name == "": name = hero_id
        
        roles = []
        if 'ロール:' in lore:
            roles_part = lore.split('ロール:')[1].split('\n')[0].strip()
            roles = [r.strip() for r in roles_part.split('/')]
        elif '役割：' in lore:
            roles_part = lore.split('役割：')[1].split('。')[0].strip()
            roles = [r.strip() for r in roles_part.split('/')]

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
        
        final_roster.append({
            "id": hero_id,
            "name": name,
            "role": eng_roles,
            "image": f"/images/heroes/{hero_id}.jpg" # The local site uses these sequential IDs
        })
        
        final_stats[hero_id] = {
            "survivability": 50,
            "attackDamage": 50,
            "skillEffects": 50,
            "difficulty": 50
        }
        
        count += 1
    else:
        print(f"Missing {json_path}")

# Fatih and Lapulapu mapping
# The user wants all 112 heroes. Fatih is 029, Lapulapu is 056. They are already in the 1-112 list!
# So we don't need any special IDs like 9001. Fatih is just hero_029!

with open('public/data/skills/ja.json', 'w', encoding='utf-8') as f:
    json.dump(final_ja, f, ensure_ascii=False, indent=2)
with open('public/data/skills/en.json', 'w', encoding='utf-8') as f:
    json.dump(final_en, f, ensure_ascii=False, indent=2)
with open('src/data/hok_heroes.json', 'w', encoding='utf-8') as f:
    json.dump(final_roster, f, ensure_ascii=False, indent=2)
with open('src/data/hero_stats.json', 'w', encoding='utf-8') as f:
    json.dump(final_stats, f, ensure_ascii=False, indent=2)

print(f"Successfully rebuilt all {count} heroes from the processed folder!")
