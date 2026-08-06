import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load hok_heroes.json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

arthur_hero = next(h for h in hok_heroes if h['id'] == '166')

# Load hok_items.json
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    hok_items = json.load(f)

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

# Load OCR Data
with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

found_files = []
for item in ocr_data:
    txt = item['text']
    if 'アーサー' in txt or 'Arthur' in txt or 'Arthur' in item['filename']:
        found_files.append(item['filename'])

print(f"Found Arthur text in OCR files: {found_files}")

# Search all screenshot pairs looking for Arthur by template matching Arthur's portrait 166.png
arthur_avatar = read_img_unicode(r'public\images\heroes\166.png')
arthur_avatar_t = cv2.resize(arthur_avatar, (70, 70))

best_score = -1
best_build_file = None

for num in range(3730, 3956):
    p = f'C:\\Users\\81901\\Pictures\\Screenshots\\スクリーンショット ({num}).png'
    if not os.path.exists(p):
        continue
    img = read_img_unicode(p)
    if img is None:
        continue
        
    crop = img[0:300, 0:600]
    res = cv2.matchTemplate(crop, arthur_avatar_t, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, _ = cv2.minMaxLoc(res)
    
    if max_val > best_score:
        best_score = max_val
        # The build screen is either num or num+1
        best_build_file = f'スクリーンショット ({num}).png'

print(f"Best match for Arthur avatar: {best_build_file} (Score: {best_score:.3f})")

# Let's inspect the screenshot numbers around 3900 to 3920
for num in [3900, 3901, 3902, 3903, 3904, 3905, 3906, 3907, 3908, 3909, 3910]:
    p = f'C:\\Users\\81901\\Pictures\\Screenshots\\スクリーンショット ({num}).png'
    if not os.path.exists(p):
        continue
    img = read_img_unicode(p)
    if img is None:
        continue
        
    x_slots = [
        (740, 825),
        (825, 910),
        (910, 995),
        (995, 1080),
        (1080, 1165),
        (1165, 1250)
    ]
    items_found = []
    for x1, x2 in x_slots:
        patch = img[455:535, x1:x2]
        if patch.size == 0:
            continue
        patch_resized = cv2.resize(patch, (68, 68))
        patch_masked = cv2.bitwise_and(patch_resized, patch_resized, mask=mask)
        
        b_score = -1
        b_item = None
        for t in item_templates:
            res = cv2.matchTemplate(patch_masked, t['img'], cv2.TM_CCOEFF_NORMED)
            _, max_val, _, _ = cv2.minMaxLoc(res)
            if max_val > b_score:
                b_score = max_val
                b_item = t
        if b_item and b_score > 0.6:
            items_found.append(b_item['name'])
    
    if len(items_found) >= 4:
        print(f"Screenshot ({num}).png -> Items: {items_found}")
