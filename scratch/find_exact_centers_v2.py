import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load hok_items.json
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    hok_items = json.load(f)

templates = []
for item in hok_items:
    icon_rel = item['icon'].lstrip('/')
    icon_path = os.path.join('public', icon_rel)
    if os.path.exists(icon_path):
        img = read_img_unicode(icon_path)
        if img is not None:
            # Crop center 60% of square template icon to match center artwork
            th, tw, _ = img.shape
            ch_start, ch_end = int(th * 0.20), int(th * 0.80)
            cw_start, cw_end = int(tw * 0.20), int(tw * 0.80)
            crop_t = img[ch_start:ch_end, cw_start:cw_end]
            img_resized = cv2.resize(crop_t, (50, 50))
            templates.append({
                "id": item['id'],
                "name": item['name'],
                "name_en": item.get('name_en') or item['name'],
                "img": img_resized
            })

print(f"Loaded {len(templates)} templates.")

test_file = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
img = read_img_unicode(test_file)

# Build 1 centers (Row 1): y_center = 485
# Build 2 centers (Row 2): y_center = 725
# x_centers = [790, 878, 966, 1054, 1142, 1230]

x_centers = [790, 878, 966, 1054, 1142, 1230]
box_size = 25 # 50x50 patch around center

print("--- TESTING ROW 1 (BUILD 1) ---")
matched_r1 = []
for i, xc in enumerate(x_centers):
    patch = img[485-box_size:485+box_size, xc-box_size:xc+box_size]
    patch_resized = cv2.resize(patch, (50, 50))
    
    best_score = -1
    best_item = None
    for t in templates:
        res = cv2.matchTemplate(patch_resized, t['img'], cv2.TM_CCOEFF_NORMED)
        score = res[0][0]
        if score > best_score:
            best_score = score
            best_item = t
            
    print(f"Slot {i+1} (x={xc}): {best_item['name']} (ID: {best_item['id']}) Score: {best_score:.3f}")
    if best_item:
        matched_r1.append(best_item['name'])

print("\n--- TESTING ROW 2 (BUILD 2) ---")
matched_r2 = []
for i, xc in enumerate(x_centers):
    patch = img[725-box_size:725+box_size, xc-box_size:xc+box_size]
    patch_resized = cv2.resize(patch, (50, 50))
    
    best_score = -1
    best_item = None
    for t in templates:
        res = cv2.matchTemplate(patch_resized, t['img'], cv2.TM_CCOEFF_NORMED)
        score = res[0][0]
        if score > best_score:
            best_score = score
            best_item = t
            
    print(f"Slot {i+1} (x={xc}): {best_item['name']} (ID: {best_item['id']}) Score: {best_score:.3f}")
    if best_item:
        matched_r2.append(best_item['name'])
