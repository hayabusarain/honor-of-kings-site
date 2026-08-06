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
            # Resize template to exact 68x68
            img_resized = cv2.resize(img, (68, 68))
            templates.append({
                "id": item['id'],
                "name": item['name'],
                "name_en": item.get('name_en') or item['name'],
                "img": img_resized
            })

print(f"Loaded {len(templates)} 68x68 item icon templates.")

test_file = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
img = read_img_unicode(test_file)

# Row 1 (Build 1): y_start = 455, y_end = 535
# Row 2 (Build 2): y_start = 710, y_end = 790
# Item X ranges:
# Slot 1: x: 740 to 825
# Slot 2: x: 825 to 910
# Slot 3: x: 910 to 995
# Slot 4: x: 995 to 1080
# Slot 5: x: 1080 to 1165
# Slot 6: x: 1165 to 1250

x_slots = [
    (740, 825),
    (825, 910),
    (910, 995),
    (995, 1080),
    (1080, 1165),
    (1165, 1250)
]

def detect_items_in_row(y1, y2):
    row_items = []
    row_items_en = []
    for idx, (x1, x2) in enumerate(x_slots):
        patch = img[y1:y2, x1:x2]
        
        best_score = -1
        best_item = None
        
        for t in templates:
            res = cv2.matchTemplate(patch, t['img'], cv2.TM_CCOEFF_NORMED)
            _, max_val, _, _ = cv2.minMaxLoc(res)
            if max_val > best_score:
                best_score = max_val
                best_item = t
                
        print(f"  Slot {idx+1}: {best_item['name']} (ID: {best_item['id']}) Score: {best_score:.3f}")
        if best_item and best_score > 0.45:
            row_items.append(best_item['name'])
            row_items_en.append(best_item['name_en'])
            
    return row_items, row_items_en

print("\n--- ATHENA BUILD 1 (ROW 1) ---")
b1_ja, b1_en = detect_items_in_row(455, 535)
print("Detected Build 1 Items:", b1_ja)

print("\n--- ATHENA BUILD 2 (ROW 2) ---")
b2_ja, b2_en = detect_items_in_row(710, 790)
print("Detected Build 2 Items:", b2_ja)
