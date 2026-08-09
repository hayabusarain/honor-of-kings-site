import json
import os

def sync_meta():
    ja_path = 'public/data/skills/ja.json'
    en_path = 'public/data/skills/en.json'

    with open(ja_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    updated = 0
    for hero_id, ja_hero in ja_data.items():
        if isinstance(ja_hero, dict) and 'meta' in ja_hero:
            if hero_id in en_data and isinstance(en_data[hero_id], dict):
                en_data[hero_id]['meta'] = ja_hero['meta']
                updated += 1
            else:
                # If hero doesn't exist in EN but does in JA, we can create it or skip
                en_data[hero_id] = {'meta': ja_hero['meta']}
                updated += 1

    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

    print(f"Successfully synced 'meta' for {updated} heroes from ja.json to en.json.")

if __name__ == '__main__':
    sync_meta()
