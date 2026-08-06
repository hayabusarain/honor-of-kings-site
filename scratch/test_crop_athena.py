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
            # Resize template to standard 70x70
            img_resized = cv2.resize(img, (70, 70))
            templates.append({
                "id": item['id'],
                "name": item['name'],
                "name_en": item.get('name_en') or item['name'],
                "img": img_resized
            })

print(f"Loaded {len(templates)} item icon templates.")

test_file = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
img = read_img_unicode(test_file)

print(f"Image shape: {img.shape}")

# Row 1 Popular Build 1: y = 475 to 555
# Item slots: x_offsets: [750, 835, 920, 1005, 1090, 1175], width 75
y_start, y_end = 475, 555
x_positions = [750, 835, 920, 1005, 1090, 1175]

matched_items = []

for i, x in enumerate(x_positions):
    patch = img[y_start:y_end, x:x+75]
    patch_resized = cv2.resize(patch, (70, 70))
    
    best_score = -1
    best_item = None
    
    for t in templates:
        res = cv2.matchTemplate(patch_resized, t['img'], cv2.TM_CCOEFF_NORMED)
        score = res[0][0]
        if score > best_score:
            best_score = score
            best_item = t
            
    print(f"Slot {i+1} (x={x}): Best Match -> {best_item['name']} (ID: {best_item['id']}) Score: {best_score:.3f}")
    if best_item and best_score > 0.4:
        matched_items.append(best_item['name'])

print("Matched Items for Athena Build 1:", matched_items)
