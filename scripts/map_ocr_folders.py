import json
import os
import glob

def map_folders():
    heroes_json_path = 'src/data/hok_heroes.json'
    with open(heroes_json_path, 'r', encoding='utf-8') as f:
        hok_heroes = json.load(f)

    # create a map of lowercase name to ID
    name_to_id = {}
    for h in hok_heroes:
        name_to_id[h['name'].lower()] = str(h['id'])
        if 'name_en' in h and h['name_en']:
            name_to_id[h['name_en'].lower()] = str(h['id'])

    screenshot_dir = r"C:\Users\81901\Desktop\オナキンENヒーロー\Screenshots"
    folders = [f.name for f in os.scandir(screenshot_dir) if f.is_dir()]

    unmapped = []
    mapped = []

    for folder in folders:
        f_lower = folder.lower()
        if f_lower in name_to_id:
            mapped.append({'id': name_to_id[f_lower], 'folder': folder})
        else:
            # Try fuzzy or partial matches
            matched = False
            for k, v in name_to_id.items():
                if f_lower in k or k in f_lower:
                    mapped.append({'id': v, 'folder': folder})
                    matched = True
                    break
            if not matched:
                unmapped.append(folder)

    print(f"Mapped: {len(mapped)}")
    print(f"Unmapped: {unmapped}")
    
    with open('scratch/ocr_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(mapped, f, indent=2)

if __name__ == '__main__':
    map_folders()
