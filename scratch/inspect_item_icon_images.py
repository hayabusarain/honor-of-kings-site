import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load hok_items.json
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# Crop the 6 items from (3732).png
img_3732 = read_img_unicode(r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3732).png')

slots = [
    ("Item1 (Green Boots)", 740, 825),
    ("Item2 (Red Mantle)", 825, 910),
    ("Item3 (Purple Axe)", 910, 995),
    ("Item4 (Silver Armor)", 995, 1080),
    ("Item5 (Red Glowing Orb)", 1080, 1165),
    ("Item6 (Golden Blue Shield)", 1165, 1250)
]

print("Searching exact image matches in public/images/items/ for each slot...")

for label, x1, x2 in slots:
    patch = img_3732[450:540, x1:x2]
    patch_resized = cv2.resize(patch, (64, 64))
    
    best_score = -1
    best_file = None
    best_item = None
    
    for item in items:
        icon_path = os.path.join('public', item['icon'].lstrip('/'))
        if os.path.exists(icon_path):
            img = read_img_unicode(icon_path)
            if img is not None:
                img_r = cv2.resize(img, (64, 64))
                res = cv2.matchTemplate(patch_resized, img_r, cv2.TM_CCOEFF_NORMED)
                _, max_val, _, _ = cv2.minMaxLoc(res)
                if max_val > best_score:
                    best_score = max_val
                    best_file = item['icon']
                    best_item = item
                    
    print(f"[{label}] -> Best Match in public/images/items/: {best_item['name']} (ID: {best_item['id']}, Icon: {best_file}) with score {best_score:.3f}")
