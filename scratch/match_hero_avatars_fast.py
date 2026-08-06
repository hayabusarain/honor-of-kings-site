import cv2
import json
import numpy as np
import os
import re

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load hok_heroes.json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

# Load hero avatar templates
hero_templates = []
for hero in hok_heroes:
    hid = str(hero['id'])
    p_jpg = f"public/images/heroes/{hid}.jpg"
    p_png = f"public/images/heroes/{hid}.png"
    
    img = None
    if os.path.exists(p_jpg):
        img = read_img_unicode(p_jpg)
    elif os.path.exists(p_png):
        img = read_img_unicode(p_png)
        
    if img is not None:
        img_resized = cv2.resize(img, (70, 70))
        hero_templates.append({
            "id": hid,
            "name": hero['name'],
            "img": img_resized
        })

print(f"Loaded {len(hero_templates)} hero avatar templates.")

# Load OCR Data
with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

matched_pairs = []

for i in range(0, len(ocr_data)-1, 2):
    f_display = ocr_data[i]['filename']
    f_build = ocr_data[i+1]['filename']
    
    path_display = os.path.join(r'C:\Users\81901\Pictures\Screenshots', f_display)
    img_display = read_img_unicode(path_display)
    
    if img_display is None:
        continue
        
    # Crop upper-left hero avatar region (y: 20-220, x: 20-300)
    h, w, _ = img_display.shape
    crop_avatar = img_display[20:220, 20:300]
    
    best_score = -1
    best_hero = None
    
    for ht in hero_templates:
        res = cv2.matchTemplate(crop_avatar, ht['img'], cv2.TM_CCOEFF_NORMED)
        _, max_val, _, _ = cv2.minMaxLoc(res)
        if max_val > best_score:
            best_score = max_val
            best_hero = ht
                
    if best_hero:
        matched_pairs.append({
            "hero_id": best_hero['id'],
            "hero_name": best_hero['name'],
            "display_file": f_display,
            "build_file": f_build,
            "score": best_score,
            "build_raw": ocr_data[i+1]['text']
        })
        print(f"[{i//2 + 1}/{len(ocr_data)//2}] Matched ({f_display} -> {f_build}): {best_hero['name']} (ID: {best_hero['id']}) Score: {best_score:.3f}")

print(f"\nSuccessfully matched ALL {len(matched_pairs)} screenshot pairs!")

with open('scratch/matched_pairs_fast.json', 'w', encoding='utf-8') as f:
    json.dump(matched_pairs, f, ensure_ascii=False, indent=2)

print("Saved scratch/matched_pairs_fast.json successfully!")
