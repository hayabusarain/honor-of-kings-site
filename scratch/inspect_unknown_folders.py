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

with open('scratch/all_hero_folder_ocr_utf8.json', 'r', encoding='utf-8') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

unknown_list = []

for i, d in enumerate(subdirs):
    m = re.search(r'Set_(\d+)_(?:.*_)?(\d+-\d+)', d)
    if not m:
        continue
    set_num = m.group(1)
    range_str = m.group(2)
    
    ocr_text = ocr_data[i]['text'] if i < len(ocr_data) else ""
    
    matched_hero = None
    if set_num == "001":
        matched_hero = "アーサー"
    elif ocr_text:
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

    if not matched_hero:
        sd_path = os.path.join(base_folder, d)
        files = sorted([f for f in os.listdir(sd_path) if f.endswith('.png')])
        first_f = files[0] if files else ""
        unknown_list.append({
            "set": set_num,
            "dir": d,
            "first_file": first_f,
            "ocr_text": ocr_text
        })

print(f"Found {len(unknown_list)} folders with UNKNOWN hero name.")
print("\nFirst 15 UNKNOWN entries:")
for u in unknown_list[:15]:
    print(f"  Set {u['set']} ({u['dir']}) -> OCR: '{u['ocr_text'][:60]}...'")

with open('scratch/unknown_folders_list.json', 'w', encoding='utf-8') as f:
    json.dump(unknown_list, f, ensure_ascii=False, indent=2)
