import json
import os
import re

base_folder = r'C:\Users\81901\Pictures\Screenshots'

with open('scratch/all_hero_folder_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

current_dirs = sorted([d for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d)) and d.startswith("Set_")])

print(f"Loaded {len(ocr_data)} OCR entries for {len(current_dirs)} current directories.")

renamed_count = 0

for i, cd in enumerate(current_dirs):
    m = re.search(r'Set_(\d+)_(?:.*_)?(\d+-\d+)', cd)
    if not m:
        continue
    set_num = m.group(1)
    range_str = m.group(2)
    
    ocr_text = ocr_data[i]['text'] if i < len(ocr_data) else ""
    
    matched_hero = None
    
    # Custom overrides for known sets where title text is stylish / stylized font
    if set_num == "001":
        matched_hero = "アーサー"
    elif ocr_text:
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
    new_dir = f"Set_{set_num}_{hero_name}_{range_str}"
    
    old_p = os.path.join(base_folder, cd)
    new_p = os.path.join(base_folder, new_dir)
    
    if old_p != new_p:
        try:
            os.rename(old_p, new_p)
            renamed_count += 1
            print(f"  [{set_num}] RENAMED: '{cd}' -> '{new_dir}'")
        except Exception as ex:
            print(f"  [{set_num}] Error renaming '{cd}': {ex}")

print(f"\nFINALLY COMPLETED! Renamed {renamed_count} set folders to exact Japanese hero names!")
