import json
import os
import re

base_folder = r'C:\Users\81901\Pictures\Screenshots'

with open('scratch/all_hero_folder_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

current_subdirs = sorted([d for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d))])

print(f"Loaded {len(ocr_data)} OCR entries and {len(current_subdirs)} current subdirs.")

renamed_count = 0

for item in ocr_data:
    ocr_dir = item['dir']
    text = item['text']
    
    # Extract set index e.g. 001, 002... and range e.g. 3957-3967
    m = re.search(r'Set_(\d+)_(?:.*_)?(\d+-\d+)', ocr_dir)
    if not m:
        m = re.search(r'Set_(\d+)_(\d+-\d+)', ocr_dir)
    if not m:
        continue
        
    set_num = m.group(1)
    range_str = m.group(2)
    
    # Find matching directory currently on disk starting with Set_{set_num}_
    matching_disk_dir = None
    for cd in current_subdirs:
        if cd.startswith(f"Set_{set_num}_"):
            matching_disk_dir = cd
            break
            
    if not matching_disk_dir:
        continue
        
    matched_hero = None
    if text:
        # 1. Direct name match in hok_heroes.json
        for h in heroes:
            hname = h['name']
            hname_en = h.get('name_en', '')
            if hname in text or (hname_en and len(hname_en) >= 3 and hname_en.lower() in text.lower()):
                matched_hero = hname
                break
                
        # 2. Match 2-char partial
        if not matched_hero:
            for h in heroes:
                hname = h['name']
                if len(hname) >= 2 and hname[:2] in text:
                    matched_hero = hname
                    break

    hero_name = matched_hero if matched_hero else "UNKNOWN"
    new_dir_name = f"Set_{set_num}_{hero_name}_{range_str}"
    
    old_path = os.path.join(base_folder, matching_disk_dir)
    new_path = os.path.join(base_folder, new_dir_name)
    
    if old_path != new_path and os.path.exists(old_path):
        try:
            os.rename(old_path, new_path)
            renamed_count += 1
            print(f"  [RENAMED] Set {set_num}: {matching_disk_dir} -> {new_dir_name}")
        except Exception as e:
            print(f"  [ERROR] {matching_disk_dir}: {e}")

print(f"\nSUCCESS! Renamed {renamed_count} set folders to exact Japanese hero names!")
