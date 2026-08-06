import cv2
import json
import numpy as np
import os
import re

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Desktop\おなきんあいてむ'
p_items = os.path.abspath(r'src\data\hok_items.json')

with open(p_items, 'r', encoding='utf-8') as f:
    items = json.load(f)

# Build a search index for hok_items
items_by_name = {}
for it in items:
    if 'name' in it:
        items_by_name[it['name']] = it
    if 'nameJa' in it:
        items_by_name[it['nameJa']] = it
    if 'aliases' in it:
        for a in it['aliases']:
            items_by_name[a] = it

files = [f for f in os.listdir(folder) if f.endswith('.png')]
print(f"Processing {len(files)} screenshot files in {folder}...")

processed_count = 0

for filename in files:
    filepath = os.path.join(folder, filename)
    img = read_img_unicode(filepath)
    if img is None:
        continue
        
    # Crop right synthesis top icon (y: 285 to 375, x: 1205 to 1295)
    icon_crop = img[285:375, 1205:1295]
    if icon_crop is None or icon_crop.shape[0] < 50 or icon_crop.shape[1] < 50:
        continue
        
    # Crop title region (y: 165 to 220, x: 1440 to 1750)
    title_crop = img[165:220, 1440:1750]
    
    # We can match the title crop against known items or match the icon image directly
    # For each item, compare icon_crop against current items in public/images/items/
    icon_sq = cv2.resize(icon_crop, (64, 64))
    
    best_score = -1
    best_item = None
    
    for it in items:
        icon_path = os.path.join('public', it['icon'].lstrip('/'))
        if os.path.exists(icon_path):
            ref_img = read_img_unicode(icon_path)
            if ref_img is not None:
                ref_sq = cv2.resize(ref_img, (64, 64))
                res = cv2.matchTemplate(icon_sq, ref_sq, cv2.TM_CCOEFF_NORMED)
                _, max_val, _, _ = cv2.minMaxLoc(res)
                if max_val > best_score:
                    best_score = max_val
                    best_item = it
                    
    if best_item and best_score > 0.45:
        # Overwrite item icon image with the high-resolution crop from the screenshot!
        icon_file_path = os.path.join('public', best_item['icon'].lstrip('/'))
        highres_crop = cv2.resize(icon_crop, (160, 160))
        cv2.imwrite(icon_file_path, highres_crop)
        processed_count += 1

print(f"Successfully processed and updated {processed_count} item icon image files!")
