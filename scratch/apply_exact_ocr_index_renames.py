import json
import os
import re

base_folder = r'C:\Users\81901\Pictures\Screenshots'
dirs = sorted([d for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d)) and d.startswith("Set_")])

with open('scratch/all_hero_folder_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

print(f"Total current set directories: {len(dirs)}")
print(f"Total OCR entries: {len(ocr_data)}")

renamed_count = 0

for i, d in enumerate(dirs):
    ocr_entry = ocr_data[i] if i < len(ocr_data) else None
    ocr_text = ocr_entry['text'] if ocr_entry else ""
    
    # Extract set number and range string
    # e.g. Set_001_UNKNOWN_3957-3967 -> set_num: 001, range_str: 3957-3967
    m = re.search(r'Set_(\d+)_(?:.*_)?(\d+-\d+)', d)
    if not m:
        continue
    set_num = m.group(1)
    range_str = m.group(2)
    
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
        renamed_count += 1
        print(f"  [{set_num}] Renamed '{d}' -> '{new_dir_name}' (Matched: '{hero_name}')")

print(f"\nSUCCESS! Renamed {renamed_count} set folders to their exact Japanese hero names!")
