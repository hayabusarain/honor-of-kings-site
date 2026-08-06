import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load hok_items.json
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    hok_items = json.load(f)

# Circular mask
mask = np.zeros((68, 68), dtype=np.uint8)
cv2.circle(mask, (34, 34), 28, 255, -1)

templates = []
for item in hok_items:
    icon_rel = item['icon'].lstrip('/')
    icon_path = os.path.join('public', icon_rel)
    if os.path.exists(icon_path):
        img = read_img_unicode(icon_path)
        if img is not None:
            img_resized = cv2.resize(img, (68, 68))
            masked_t = cv2.bitwise_and(img_resized, img_resized, mask=mask)
            templates.append({
                "id": item['id'],
                "name": item['name'],
                "name_en": item.get('name_en') or item['name'],
                "img": masked_t
            })

print(f"Loaded {len(templates)} masked item templates.")

test_file = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
img = read_img_unicode(test_file)

x_slots = [
    (740, 825),
    (825, 910),
    (910, 995),
    (995, 1080),
    (1080, 1165),
    (1165, 1250)
]

def detect_items_masked(y1, y2):
    row_items = []
    row_items_en = []
    for idx, (x1, x2) in enumerate(x_slots):
        patch = img[y1:y2, x1:x2]
        patch_resized = cv2.resize(patch, (68, 68))
        patch_masked = cv2.bitwise_and(patch_resized, patch_resized, mask=mask)
        
        best_score = -1
        best_item = None
        
        for t in templates:
            res = cv2.matchTemplate(patch_masked, t['img'], cv2.TM_CCOEFF_NORMED)
            _, max_val, _, _ = cv2.minMaxLoc(res)
            if max_val > best_score:
                best_score = max_val
                best_item = t
                
        print(f"  Slot {idx+1}: {best_item['name']} (ID: {best_item['id']}) Score: {best_score:.3f}")
        if best_item and best_score > 0.60:
            row_items.append(best_item['name'])
            row_items_en.append(best_item['name_en'])
            
    return row_items, row_items_en

print("\n--- ATHENA BUILD 1 (MASKED MATCH) ---")
b1_ja, b1_en = detect_items_masked(455, 535)
print("Detected Build 1 Items:", b1_ja)
