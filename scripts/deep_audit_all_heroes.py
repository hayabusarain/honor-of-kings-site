import os, json, re

def main():
    screenshots_dir = r'C:\Users\81901\Desktop\オナキンENヒーロー\Screenshots'
    with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    with open('public/data/skills/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
        hok_heroes = json.load(f)

    folder_to_hero = {}
    for h in hok_heroes:
        name_en = h.get('name_en', '')
        name_ja = h.get('name', '')
        h_id = str(h['id'])
        folder_to_hero[name_en.lower()] = (h_id, name_ja, name_en)

    folders = os.listdir(screenshots_dir)
    print(f"Total screenshot folders: {len(folders)}")

    print("\n--- HEROES WITH > 5 SCREENSHOTS (LIKELY MULTI-FORM OR SPECIAL) ---")
    special_heroes = []
    for folder in sorted(folders):
        fpath = os.path.join(screenshots_dir, folder)
        if os.path.isdir(fpath):
            files = [f for f in os.listdir(fpath) if f.endswith('.png')]
            matched_hero = folder_to_hero.get(folder.lower())
            h_id = matched_hero[0] if matched_hero else "UNKNOWN"
            h_name = matched_hero[2] if matched_hero else folder
            
            # Check if ja_data has forms for this hero
            ja_hero = ja_data.get(h_id, {})
            ja_forms_info = []
            if isinstance(ja_hero, dict):
                for k, v in ja_hero.items():
                    if isinstance(v, dict) and 'forms' in v and len(v['forms']) > 1:
                        ja_forms_info.append((k, len(v['forms'])))
            
            en_hero = en_data.get(h_id, {})
            en_forms_info = []
            if isinstance(en_hero, dict):
                for k, v in en_hero.items():
                    if isinstance(v, dict) and 'forms' in v and len(v['forms']) > 1:
                        en_forms_info.append((k, len(v['forms'])))

            if len(files) > 5 or ja_forms_info or en_forms_info:
                special_heroes.append({
                    "folder": folder,
                    "id": h_id,
                    "name": h_name,
                    "png_count": len(files),
                    "ja_forms": ja_forms_info,
                    "en_forms": en_forms_info
                })
                print(f"ID {h_id:>3} | {h_name:<20} | PNGs: {len(files):>2} | JA Forms: {ja_forms_info} | EN Forms: {en_forms_info}")

if __name__ == '__main__':
    main()
