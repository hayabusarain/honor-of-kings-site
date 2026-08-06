import cv2
import json
import numpy as np
import os

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
        img_resized = cv2.resize(img, (80, 80))
        hero_templates.append({
            "id": hid,
            "name": hero['name'],
            "img": img_resized
        })

print(f"Loaded {len(hero_templates)} hero avatar templates!")

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
        
    # Crop upper-left quadrant where hero avatar / portrait is displayed
    h, w, _ = img_display.shape
    crop_avatar = img_display[0:int(h*0.5), 0:int(w*0.5)]
    
    best_score = -1
    best_hero = None
    
    for ht in hero_templates:
        for scale in [0.8, 1.0, 1.2]:
            sw, sh = int(80 * scale), int(80 * scale)
            t_scaled = cv2.resize(ht['img'], (sw, sh))
            res = cv2.matchTemplate(crop_avatar, t_scaled, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, _ = cv2.minMaxLoc(res)
            if max_val > best_score:
                best_score = max_val
                best_hero = ht
                
    if best_hero and best_score > 0.4:
        matched_pairs.append({
            "hero_id": best_hero['id'],
            "hero_name": best_hero['name'],
            "display_file": f_display,
            "build_file": f_build,
            "score": best_score,
            "build_raw": ocr_data[i+1]['text']
        })
        print(f"Matched ({f_display} -> {f_build}): {best_hero['name']} (ID: {best_hero['id']}) Score: {best_score:.3f}")

print(f"\nSuccessfully matched {len(matched_pairs)} / {len(ocr_data)//2} screenshot pairs to Hero IDs!")

with open('scratch/matched_screenshot_pairs.json', 'w', encoding='utf-8') as f:
    json.dump(matched_pairs, f, ensure_ascii=False, indent=2)

print("Saved scratch/matched_screenshot_pairs.json successfully!")
