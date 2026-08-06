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

# Load hok_items.json
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    hok_items = json.load(f)

# Circular item mask
mask = np.zeros((68, 68), dtype=np.uint8)
cv2.circle(mask, (34, 34), 28, (255, 255, 255), -1)

item_templates = []
for item in hok_items:
    icon_rel = item['icon'].lstrip('/')
    icon_path = os.path.join('public', icon_rel)
    if os.path.exists(icon_path):
        img = read_img_unicode(icon_path)
        if img is not None:
            img_resized = cv2.resize(img, (68, 68))
            masked_t = cv2.bitwise_and(img_resized, img_resized, mask=mask)
            item_templates.append({
                "id": item['id'],
                "name": item['name'],
                "name_en": item.get('name_en') or item['name'],
                "img": masked_t
            })

print(f"Loaded {len(item_templates)} item templates.")

# Load OCR Data
with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

ocr_map = {item['filename']: item['text'] for item in ocr_data}

hero_build_data = {}

# Iterate over screenshot pairs
for display_num in range(3730, 3956, 2):
    build_num = display_num + 1
    
    f_display = f"スクリーンショット ({display_num}).png"
    f_build = f"スクリーンショット ({build_num}).png"
    
    p_display = os.path.join(r'C:\Users\81901\Pictures\Screenshots', f_display)
    p_build = os.path.join(r'C:\Users\81901\Pictures\Screenshots', f_build)
    
    img_display = read_img_unicode(p_display)
    img_build = read_img_unicode(p_build)
    
    if img_display is None or img_build is None:
        continue
        
    # Match hero avatar from display screen (y: 20-220, x: 20-300)
    crop_avatar = img_display[20:220, 20:300]
    
    best_hero_score = -1
    best_hero = None
    
    for ht in hero_templates:
        res = cv2.matchTemplate(crop_avatar, ht['img'], cv2.TM_CCOEFF_NORMED)
        _, max_val, _, _ = cv2.minMaxLoc(res)
        if max_val > best_hero_score:
            best_hero_score = max_val
            best_hero = ht
            
    if not best_hero or best_hero_score < 0.45:
        print(f"Pair ({display_num} -> {build_num}): Low hero match score {best_hero_score:.3f}")
        continue
        
    hid = best_hero['id']
    hname = best_hero['name']
    
    # Extract OCR stats from build screen
    build_txt = ocr_map.get(f_build, "")
    wins_m = re.search(r'勝利\s*:\s*(\d+)', build_txt)
    wr_m = re.search(r'勝率\s*:\s*([\d\.]+)%?', build_txt)
    
    wins = int(wins_m.group(1)) if wins_m else None
    win_rate = f"{wr_m.group(1)}%" if wr_m else None
    
    # Match 6 items from build screen Row 1
    x_slots = [
        (740, 825),
        (825, 910),
        (910, 995),
        (995, 1080),
        (1080, 1165),
        (1165, 1250)
    ]
    
    items_ja = []
    items_en = []
    
    for x1, x2 in x_slots:
        patch = img_build[455:535, x1:x2]
        if patch.size == 0:
            continue
        patch_resized = cv2.resize(patch, (68, 68))
        patch_masked = cv2.bitwise_and(patch_resized, patch_resized, mask=mask)
        
        best_item_score = -1
        best_item = None
        for t in item_templates:
            res = cv2.matchTemplate(patch_masked, t['img'], cv2.TM_CCOEFF_NORMED)
            _, max_val, _, _ = cv2.minMaxLoc(res)
            if max_val > best_item_score:
                best_item_score = max_val
                best_item = t
                
        if best_item and best_item_score > 0.55:
            items_ja.append(best_item['name'])
            items_en.append(best_item['name_en'])
            
    if len(items_ja) >= 4:
        hero_build_data[hid] = {
            "hero_name": hname,
            "hero_id": hid,
            "wins": wins,
            "win_rate": win_rate,
            "items_ja": items_ja,
            "items_en": items_en,
            "display_file": f_display,
            "build_file": f_build,
            "score": best_hero_score
        }
        print(f"[{display_num} -> {build_num}] Matched Hero: {hname} (ID: {hid}) -> Items: {items_ja}")

print(f"\nSuccessfully extracted REAL screenshot build data for {len(hero_build_data)} heroes!")

with open('scratch/extracted_hero_builds_v2.json', 'w', encoding='utf-8') as f:
    json.dump(hero_build_data, f, ensure_ascii=False, indent=2)

print("Saved scratch/extracted_hero_builds_v2.json successfully!")
