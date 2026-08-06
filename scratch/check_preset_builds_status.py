import json

with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

heroes_with_presets = 0
total_heroes = len(hok_heroes)

for hero in hok_heroes:
    hid = str(hero['id'])
    if hid in ja_data:
        meta = ja_data[hid].get('meta', {})
        presets = meta.get('build_presets', [])
        rec_items = meta.get('recommended_items', [])
        if presets or len(rec_items) >= 6:
            heroes_with_presets += 1

print(f"Total heroes: {total_heroes}")
print(f"Heroes with complete recommended items / build presets: {heroes_with_presets} / {total_heroes}")
