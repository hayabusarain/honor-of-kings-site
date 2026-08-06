import cv2
import json
import numpy as np
import os
import re
import subprocess

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

base_folder = r'C:\Users\81901\Pictures\Screenshots'
subdirs = sorted([d for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d)) and d.startswith("Set_")])

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

print(f"Loaded {len(heroes)} heroes. Renaming {len(subdirs)} set folders using exact title crops...")

renamed_count = 0

for d in subdirs:
    sd_path = os.path.join(base_folder, d)
    files = sorted([f for f in os.listdir(sd_path) if f.endswith('.png')])
    if not files:
        continue
        
    m = re.search(r'Set_(\d+)_(?:.*_)?(\d+-\d+)', d)
    if not m:
        continue
    set_num = m.group(1)
    range_str = m.group(2)
    
    first_file_path = os.path.join(sd_path, files[0])
    img = read_img_unicode(first_file_path)
    if img is None:
        continue
        
    h_img, w_img, _ = img.shape
    if w_img != 1920 or h_img != 1080:
        img = cv2.resize(img, (1920, 1080))
        
    # Crop hero name title region (y: 130 to 240, x: 1050 to 1480)
    title_crop = img[130:240, 1050:1480]
    crop_tmp_path = os.path.abspath(os.path.join('scratch', 'crop_title_clean.png'))
    cv2.imwrite(crop_tmp_path, title_crop)
    
    # Run winocr.exe on crop_title_clean.png
    try:
        proc = subprocess.run(['scratch\\winocr.exe', crop_tmp_path], capture_output=True, text=True, encoding='utf-8')
        lines = [line.strip() for line in proc.stdout.splitlines() if line.strip() and "SUCCESS" not in line]
        clean_text = "".join(lines).replace(" ", "")
    except Exception as e:
        clean_text = ""
        
    matched_hero = None
    if clean_text:
        for h in heroes:
            hname = h['name']
            hname_en = h.get('name_en', '')
            if hname in clean_text or (hname_en and len(hname_en) >= 3 and hname_en.lower() in clean_text.lower()):
                matched_hero = hname
                break
                
        if not matched_hero:
            for h in heroes:
                hname = h['name']
                if len(hname) >= 2 and hname[:2] in clean_text:
                    matched_hero = hname
                    break

    hero_name = matched_hero if matched_hero else (clean_text if clean_text else "UNKNOWN")
    new_dir = f"Set_{set_num}_{hero_name}_{range_str}"
    
    old_p = os.path.join(base_folder, d)
    new_p = os.path.join(base_folder, new_dir)
    
    if old_p != new_p:
        try:
            os.rename(old_p, new_p)
            renamed_count += 1
            print(f"  [{set_num}] FIXED: '{d}' -> '{new_dir}' (Matched: '{hero_name}', OCR: '{clean_text}')")
        except Exception as ex:
            print(f"  [{set_num}] Error: {ex}")
    else:
        print(f"  [{set_num}] Kept: '{new_dir}'")

print(f"\nFINALLY COMPLETED! Renamed {renamed_count} set folders to exact Japanese hero names!")
