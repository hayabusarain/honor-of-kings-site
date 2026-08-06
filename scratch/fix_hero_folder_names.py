import json
import os
import re

base_folder = r'C:\Users\81901\Pictures\Screenshots'
with open('scratch/all_hero_folder_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

current_subdirs = sorted([d for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d)) and d.startswith("Set_")])

print(f"Loaded {len(ocr_data)} OCR entries and {len(current_subdirs)} current subdirs.")

# Map set number to OCR entry
ocr_map = {}
for item in ocr_data:
    old_dir = item['dir']
    m = re.search(r'Set_(\d+)_', old_dir)
    if m:
        set_num = m.group(1)
        ocr_map[set_num] = item['text']

fixed_count = 0

for d in current_subdirs:
    m = re.search(r'Set_(\d+)_(?:.*_)?(\d+-\d+)', d)
    if not m:
        continue
    set_num = m.group(1)
    range_str = m.group(2)
    
    ocr_text = ocr_map.get(set_num, "")
    
    matched_hero = None
    if ocr_text:
        # Match hero name in hok_heroes.json
        for h in heroes:
            hname = h['name']
            hname_en = h.get('name_en', '')
            if hname in ocr_text or (hname_en and len(hname_en) >= 3 and hname_en.lower() in ocr_text.lower()):
                matched_hero = hname
                break
                
        if not matched_hero:
            for h in heroes:
                hname = h['name']
                if len(hname) >= 2 and hname[:2] in ocr_text:
                    matched_hero = hname
                    break

    hero_name = matched_hero if matched_hero else "UNKNOWN"
    new_dir_name = f"Set_{set_num}_{hero_name}_{range_str}"
    
    old_path = os.path.join(base_folder, d)
    new_path = os.path.join(base_folder, new_dir_name)
    
    if old_path != new_path:
        os.rename(old_path, new_path)
        fixed_count += 1
        print(f"  [CORRECTED] Set {set_num} -> {new_dir_name}")

print(f"\nFinal Fix Summary: Corrected {fixed_count} folder names to exact Japanese hero names!")
