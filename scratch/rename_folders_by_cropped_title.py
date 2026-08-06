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

print(f"Processing cropped title OCR for {len(subdirs)} set folders...")

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
        
    # Crop hero name title region (y: 140 to 230, x: 1100 to 1450)
    title_crop = img[140:230, 1100:1450]
    crop_tmp_path = os.path.abspath(os.path.join('scratch', 'crop_title_tmp.png'))
    cv2.imwrite(crop_tmp_path, title_crop)
    
    # Run winocr.exe on crop_title_tmp.png
    try:
        proc = subprocess.run(['scratch\\winocr.exe', crop_tmp_path], capture_output=True, text=True, encoding='utf-8')
        raw_ocr = proc.stdout.strip().replace(" ", "").replace("\n", "").replace("\r", "")
    except Exception as e:
        raw_ocr = ""
        
    matched_hero = None
    if raw_ocr:
        for h in heroes:
            hname = h['name']
            hname_en = h.get('name_en', '')
            if hname in raw_ocr or (hname_en and len(hname_en) >= 3 and hname_en.lower() in raw_ocr.lower()):
                matched_hero = hname
                break
                
        if not matched_hero:
            for h in heroes:
                hname = h['name']
                if len(hname) >= 2 and hname[:2] in raw_ocr:
                    matched_hero = hname
                    break

    hero_name = matched_hero if matched_hero else (raw_ocr if raw_ocr else "UNKNOWN")
    new_dir = f"Set_{set_num}_{hero_name}_{range_str}"
    
    old_p = os.path.join(base_folder, d)
    new_p = os.path.join(base_folder, new_dir)
    
    if old_p != new_p:
        os.rename(old_p, new_p)
        renamed_count += 1
        print(f"  [{set_num}] SUCCESS: '{d}' -> '{new_dir}' (OCR: '{raw_ocr}')")
    else:
        print(f"  [{set_num}] Kept: '{new_dir}'")

print(f"\nCOMPLETED! Renamed {renamed_count} set folders to exact Japanese hero names!")
