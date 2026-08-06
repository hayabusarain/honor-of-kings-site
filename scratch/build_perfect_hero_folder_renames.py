import json
import os
import re

with open('scratch/all_hero_folder_ocr.json', 'r', encoding='utf-8') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

rename_plan = []

for item in ocr_data:
    old_dir = item['dir']
    ocr_text = item['text']
    
    # Extract set number and range from old_dir
    # e.g. Set_001_3957-3967 or Set_001_瀾_3957-3967
    m = re.search(r'Set_(\d+)_.*?(\d+-\d+)', old_dir)
    if not m:
        m = re.search(r'Set_(\d+)_(\d+-\d+)', old_dir)
        
    if m:
        set_num = m.group(1)
        range_str = m.group(2)
    else:
        set_num = "000"
        range_str = "0000-0000"
        
    matched_hero = None
    if ocr_text:
        # 1. Exact or substring match in hok_heroes.json
        for h in heroes:
            hname = h['name']
            hname_en = h.get('name_en', '')
            if hname in ocr_text or (hname_en and len(hname_en) >= 3 and hname_en.lower() in ocr_text.lower()):
                matched_hero = hname
                break
                
        # 2. 2-character partial match
        if not matched_hero:
            for h in heroes:
                hname = h['name']
                if len(hname) >= 2 and hname[:2] in ocr_text:
                    matched_hero = hname
                    break
                    
    final_hero_name = matched_hero if matched_hero else "UNKNOWN"
    new_dir = f"Set_{set_num}_{final_hero_name}_{range_str}"
    
    rename_plan.append({
        "old_dir": old_dir,
        "new_dir": new_dir,
        "hero_name": final_hero_name,
        "raw_ocr": ocr_text
    })

print("\nPERFECT HERO FOLDER RENAME PLAN (First 25 Folders):")
for r in rename_plan[:25]:
    print(f"  {r['old_dir']} -> {r['new_dir']} (Hero: '{r['hero_name']}')")

with open('scratch/perfect_hero_rename_plan.json', 'w', encoding='utf-8') as f:
    json.dump(rename_plan, f, ensure_ascii=False, indent=2)

print("\nSaved perfect hero rename plan to scratch/perfect_hero_rename_plan.json!")
