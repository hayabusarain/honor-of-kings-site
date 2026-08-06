import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load hok_heroes.json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

# Load all OCR data
with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

print("Searching all OCR items for Arthur...")
for item in ocr_data:
    txt = item['text']
    if 'アーサー' in txt or 'Arthur' in txt:
        print(f"Match: {item['filename']} -> {txt[:100]}")

# Also search by hero avatar template matching across all 227 screenshots
arthur_avatar = read_img_unicode(r'public\images\heroes\166.png')
arthur_avatar_resized = cv2.resize(arthur_avatar, (80, 80))

best_val = -1
best_file = None

for num in range(3730, 3956):
    p = f'C:\\Users\\81901\\Pictures\\Screenshots\\スクリーンショット ({num}).png'
    if not os.path.exists(p):
        continue
    img = read_img_unicode(p)
    if img is None:
        continue
        
    crop = img[0:350, 0:600]
    res = cv2.matchTemplate(crop, arthur_avatar_resized, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, _ = cv2.minMaxLoc(res)
    
    if max_val > best_val:
        best_val = max_val
        best_file = f'スクリーンショット ({num}).png'

print(f"Best Avatar Match for Arthur (166): {best_file} with score {best_val:.3f}")
