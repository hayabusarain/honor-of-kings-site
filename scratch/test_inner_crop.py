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
            # Crop center 70% of square template icon to ignore edges
            th, tw, _ = img.shape
            ch_start, ch_end = int(th * 0.15), int(th * 0.85)
            cw_start, cw_end = int(tw * 0.15), int(tw * 0.85)
            crop_t = img[ch_start:ch_end, cw_start:cw_end]
            img_resized = cv2.resize(crop_t, (50, 50))
            templates.append({
                "id": item['id'],
                "name": item['name'],
                "name_en": item.get('name_en') or item['name'],
                "img": img_resized
            })

print(f"Loaded {len(templates)} center-cropped item icon templates.")

test_file = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
img = read_img_unicode(test_file)

# Row 1 (Popular Build 1) item centers:
# y_center = 490, size = 70
# x_centers = [790, 878, 966, 1054, 1142, 1230]

x_centers = [790, 878, 966, 1054, 1142, 1230]
y_center = 490
box_size = 25 # 50x50 region around center

matched_row1 = []
for i, xc in enumerate(x_centers):
    patch = img[y_center-box_size : y_center+box_size, xc-box_size : xc+box_size]
    patch_resized = cv2.resize(patch, (50, 50))
    
    best_score = -1
    best_item = None
    
    for t in templates:
        res = cv2.matchTemplate(patch_resized, t['img'], cv2.TM_CCOEFF_NORMED)
        score = res[0][0]
        if score > best_score:
            best_score = score
            best_item = t
            
    print(f"Row 1 Slot {i+1} (x={xc}): Match -> {best_item['name']} (ID: {best_item['id']}) Score: {best_score:.3f}")
    if best_item:
        matched_row1.append(best_item['name'])

print("\nAthena Build 1 Matched Items:", matched_row1)

# Row 2 (Popular Build 2) item centers:
# y_center = 715
y_center_r2 = 715
matched_row2 = []
for i, xc in enumerate(x_centers):
    patch = img[y_center_r2-box_size : y_center_r2+box_size, xc-box_size : xc+box_size]
    patch_resized = cv2.resize(patch, (50, 50))
    
    best_score = -1
    best_item = None
    
    for t in templates:
        res = cv2.matchTemplate(patch_resized, t['img'], cv2.TM_CCOEFF_NORMED)
        score = res[0][0]
        if score > best_score:
            best_score = score
            best_item = t
            
    print(f"Row 2 Slot {i+1} (x={xc}): Match -> {best_item['name']} (ID: {best_item['id']}) Score: {best_score:.3f}")
    if best_item:
        matched_row2.append(best_item['name'])

print("\nAthena Build 2 Matched Items:", matched_row2)
