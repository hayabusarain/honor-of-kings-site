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

path_3732 = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3732).png'
img_3732 = read_img_unicode(path_3732)

if img_3732 is not None:
    # Save cropped row 1 to artifacts directory for visual inspection
    row1 = img_3732[450:540, 740:1260]
    cv2.imwrite(r'C:\Users\81901\.gemini\antigravity\brain\a68a100b-b7ec-493a-b0f7-9b8c6e2445bd\arthur_row1_3732.png', row1)
    
    x_slots = [
        (740, 825),
        (825, 910),
        (910, 995),
        (995, 1080),
        (1080, 1165),
        (1165, 1250)
    ]
    
    matched_items = []
    for x1, x2 in x_slots:
        patch = img_3732[450:540, x1:x2]
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
                
        if best_item:
            matched_items.append((best_item['name'], best_item['id'], best_score))

    print(f"Matched Items from (3732).png for Arthur:")
    for name, iid, score in matched_items:
        print(f"  Item: {name} (ID: {iid}) -> Score: {score:.3f}")
