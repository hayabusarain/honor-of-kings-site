import json
import os
import re

base_folder = r'C:\Users\81901\Pictures\Screenshots'
dirs = sorted([d for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d))])

with open('scratch/all_hero_folder_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

# Map set_num string e.g. "001" -> ocr_text
ocr_map = {}
for entry in ocr_data:
    dir_name = entry['dir']
    m = re.search(r'Set_(\d+)_', dir_name)
    if m:
        set_num = m.group(1)
        ocr_map[set_num] = entry['text']

print(f"Loaded {len(ocr_map)} set OCR mappings.")

renamed_count = 0

for d in dirs:
    m = re.search(r'Set_(\d+)_(?:.*_)?(\d+-\d+)', d)
    if not m:
        continue
    set_num = m.group(1)
    range_str = m.group(2)
    
    ocr_text = ocr_map.get(set_num, "")
    
    matched_hero = None
    if ocr_text:
        # Match exact hero name in hok_heroes.json
        for h in heroes:
            hname = h['name']
            hname_en = h.get('name_en', '')
            if hname in ocr_text or (hname_en and len(hname_en) >= 3 and hname_en.lower() in ocr_text.lower()):
                matched_hero = hname
                break
                
        if not matched_hero:
            # 2-char substring match
            for h in heroes:
                hname = h['name']
                if len(hname) >= 2 and hname[:2] in ocr_text:
                    matched_hero = hname
                    break

    hero_name = matched_hero if matched_hero else "UNKNOWN"
    new_dir = f"Set_{set_num}_{hero_name}_{range_str}"
    
    old_p = os.path.join(base_folder, d)
    new_p = os.path.join(base_folder, new_dir)
    
    if old_p != new_p:
        os.rename(old_p, new_p)
        renamed_count += 1
        print(f"  [FIXED] Set {set_num}: '{d}' -> '{new_dir}' (Matched: '{hero_name}')")

print(f"\nSUCCESS! Fixed and renamed {renamed_count} set folders to exact Japanese hero names!")
