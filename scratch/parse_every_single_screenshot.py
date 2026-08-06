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

# Load hok_items.json
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    hok_items = json.load(f)

# Item templates (68x68 with circular mask)
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

# Function to detect hero name from display screenshot (or adjacent OCR text)
def detect_hero_for_num(num):
    fname = f"スクリーンショット ({num}).png"
    txt = ocr_map.get(fname, "")
    txt_clean = txt.replace(' ', '').replace('　', '')
    
    for h in hok_heroes:
        hname = h['name']
        if hname in txt_clean:
            return h
    return None

# Find all build screens (screens containing '人気セット装備' or '推奨セット装備' or '勝利:')
hero_build_data = {}

for num in range(3730, 3956):
    fname = f"スクリーンショット ({num}).png"
    txt = ocr_map.get(fname, "")
    
    # Check if this is a build screen
    if '人気セット' in txt or '推奨セット' in txt or '勝利' in txt or '勝率' in txt:
        # The hero display screen is usually num - 1
        hero = detect_hero_for_num(num - 1)
        if not hero:
            hero = detect_hero_for_num(num)
        if not hero:
            hero = detect_hero_for_num(num + 1)
            
        if hero:
            hid = str(hero['id'])
            hname = hero['name']
            
            # Crop 6 items from row 1 in build screenshot
            build_path = os.path.join(r'C:\Users\81901\Pictures\Screenshots', fname)
            b_img = read_img_unicode(build_path)
            
            items_ja = []
            items_en = []
            
            if b_img is not None:
                x_slots = [
                    (740, 825),
                    (825, 910),
                    (910, 995),
                    (995, 1080),
                    (1080, 1165),
                    (1165, 1250)
                ]
                
                for x1, x2 in x_slots:
                    patch = b_img[455:535, x1:x2]
                    patch_resized = cv2.resize(patch, (68, 68))
                    patch_masked = cv2.bitwise_and(patch_resized, patch_resized, mask=mask)
                    
                    best_score = -1
                    best_item = None
                    for t in item_templates:
                        res = cv2.matchTemplate(patch_masked, t['img'], cv2.TM_CCOEFF_NORMED)
                        _, max_val, _, _ = cv2.minMaxLoc(res)
                        if max_val > best_score:
                            best_score = max_val
                            best_item = t
                            
                    if best_item and best_score > 0.55:
                        items_ja.append(best_item['name'])
                        items_en.append(best_item['name_en'])
                        
            wins_m = re.search(r'勝利\s*:\s*(\d+)', txt)
            wr_m = re.search(r'勝率\s*:\s*([\d\.]+)%?', txt)
            
            wins = int(wins_m.group(1)) if wins_m else None
            win_rate = f"{wr_m.group(1)}%" if wr_m else None
            
            if len(items_ja) >= 4:
                hero_build_data[hid] = {
                    "hero_name": hname,
                    "hero_id": hid,
                    "wins": wins,
                    "win_rate": win_rate,
                    "items_ja": items_ja,
                    "items_en": items_en,
                    "file": fname
                }
                print(f"Extracted Build for {hname} (ID: {hid}) from {fname}: {items_ja}")

print(f"\nExtracted REAL build screenshots for {len(hero_build_data)} heroes!")

with open('scratch/extracted_hero_builds.json', 'w', encoding='utf-8') as f:
    json.dump(hero_build_data, f, ensure_ascii=False, indent=2)

print("Saved scratch/extracted_hero_builds.json successfully!")
