import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load hok_items.json
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# Collect all screenshot build rows in C:\Users\81901\Pictures\Screenshots
screenshots = []
for num in range(3730, 3956):
    p = f'C:\\Users\\81901\\Pictures\\Screenshots\\スクリーンショット ({num}).png'
    if os.path.exists(p):
        screenshots.append(p)

print(f"Loaded {len(screenshots)} screenshot files to extract high-res item icons!")

# Extract item icon crops from all build rows
# Bounding box centers y=495 (row1) and y=695 (row2)
slots_row1 = [
    (455, 535, 742, 822),
    (455, 535, 828, 908),
    (455, 535, 915, 995),
    (455, 535, 1002, 1082),
    (455, 535, 1090, 1170),
    (455, 535, 1178, 1258)
]

slots_row2 = [
    (655, 735, 742, 822),
    (655, 735, 828, 908),
    (655, 735, 915, 995),
    (655, 735, 1002, 1082),
    (655, 735, 1090, 1170),
    (655, 735, 1178, 1258)
]

crop_count = 0

for sc in screenshots:
    img = read_img_unicode(sc)
    if img is None:
        continue
    
    all_slots = slots_row1 + slots_row2
    for y1, y2, x1, x2 in all_slots:
        crop = img[y1:y2, x1:x2]
        if crop is None or crop.shape[0] < 50 or crop.shape[1] < 50:
            continue
            
        # Match crop against items using template matching
        crop_sq = cv2.resize(crop, (64, 64))
        
        best_score = -1
        best_item = None
        
        for item in items:
            icon_file = item['icon'].lstrip('/')
            icon_path = os.path.join('public', icon_file)
            if os.path.exists(icon_path):
                cur_img = read_img_unicode(icon_path)
                if cur_img is not None:
                    cur_r = cv2.resize(cur_img, (64, 64))
                    res = cv2.matchTemplate(crop_sq, cur_r, cv2.TM_CCOEFF_NORMED)
                    _, max_val, _, _ = cv2.minMaxLoc(res)
                    if max_val > best_score:
                        best_score = max_val
                        best_item = item
                        
        if best_item and best_score > 0.85:
            # Overwrite with crisp screenshot crop
            save_path = os.path.join('public', best_item['icon'].lstrip('/'))
            cv2.imwrite(save_path, cv2.resize(crop, (120, 120)))
            crop_count += 1

print(f"Batch updated {crop_count} item icons directly from in-game screenshots!")
