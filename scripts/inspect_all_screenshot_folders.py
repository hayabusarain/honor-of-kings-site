import os, json

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
    
    multiform_candidates = []
    for folder in sorted(folders):
        fpath = os.path.join(screenshots_dir, folder)
        if os.path.isdir(fpath):
            files = [f for f in os.listdir(fpath) if f.endswith('.png')]
            matched = folder_to_hero.get(folder.lower())
            h_id = matched[0] if matched else "N/A"
            h_name = matched[2] if matched else folder
            
            ja_h = ja_data.get(h_id, {})
            en_h = en_data.get(h_id, {})

            has_ja_forms = any('forms' in v and len(v['forms']) > 1 for k, v in ja_h.items() if isinstance(v, dict))
            has_en_forms = any('forms' in v and len(v['forms']) > 1 for k, v in en_h.items() if isinstance(v, dict))

            # If png_count >= 8 or has_ja_forms or has_en_forms
            if len(files) >= 8 or has_ja_forms or has_en_forms:
                multiform_candidates.append({
                    "id": h_id,
                    "name": h_name,
                    "folder": folder,
                    "png_count": len(files),
                    "has_ja_forms": has_ja_forms,
                    "has_en_forms": has_en_forms
                })

    print(f"Total multiform candidate heroes: {len(multiform_candidates)}")
    for c in multiform_candidates:
        print(f"ID {c['id']:>3} | Name: {c['name']:<20} | PNGs: {c['png_count']:>2} | JA_Forms: {c['has_ja_forms']} | EN_Forms: {c['has_en_forms']}")

if __name__ == '__main__':
    main()
