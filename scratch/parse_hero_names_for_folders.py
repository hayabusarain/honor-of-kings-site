import cv2
import json
import numpy as np
import os
import subprocess

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Pictures\Screenshots'
subdirs = sorted([d for d in os.listdir(folder) if d.startswith("Set_") and os.path.isdir(os.path.join(folder, d))])

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

print(f"Loaded {len(heroes)} heroes from hok_heroes.json.")

rename_map = []

for sd in subdirs:
    sd_path = os.path.join(folder, sd)
    files = sorted([f for f in os.listdir(sd_path) if f.endswith('.png')])
    if not files:
        continue
        
    first_file_path = os.path.join(sd_path, files[0])
    
    # Run winocr.exe
    try:
        proc = subprocess.run(['scratch\\winocr.exe', first_file_path], capture_output=True, text=True, encoding='utf-8')
        ocr_out = proc.stdout.strip()
    except Exception as e:
        ocr_out = ""
        
    matched_hero = None
    for h in heroes:
        hname = h['name']
        hname_en = h.get('name_en', '')
        if hname in ocr_out or (hname_en and hname_en.lower() in ocr_out.lower()):
            matched_hero = h
            break
            
    if not matched_hero:
        # Check partial 2-char matches
        for h in heroes:
            hname = h['name']
            if len(hname) >= 2 and hname[:2] in ocr_out:
                matched_hero = h
                break

    hero_str = matched_hero['name'] if matched_hero else "UNKNOWN"
    
    # Format new folder name e.g. 001_廉頗_3957-3967
    m = sd.split('_')
    set_num = m[1] # e.g. 001
    range_str = m[2] # e.g. 3957-3967
    
    new_folder_name = f"{set_num}_{hero_str}_{range_str}"
    rename_map.append({
        "old_name": sd,
        "new_name": new_folder_name,
        "hero": hero_str,
        "first_file": files[0],
        "ocr_output": ocr_out
    })

print("\nHero Folder Renaming Plan (First 20):")
for item in rename_map[:20]:
    print(f"  {item['old_name']} -> {item['new_name']} (Detected: {item['hero']})")

with open('scratch/folder_rename_plan.json', 'w', encoding='utf-8') as f:
    json.dump(rename_map, f, ensure_ascii=False, indent=2)

print("\nSaved full rename plan to scratch/folder_rename_plan.json!")
