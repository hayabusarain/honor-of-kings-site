import json

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/chunk_5_translated.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for hero_key in data:
    hero = data[hero_key]
    for sk in ['skill1', 'skill2', 'skill3']:
        if sk in hero and 'cooldown' in hero[sk]:
            cd = hero[sk]['cooldown']
            cd = cd.replace("秒", "s")
            cd = cd.replace("消費MP", "Mana Cost")
            hero[sk]['cooldown'] = cd

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/chunk_5_translated.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Cooldowns fixed.")
