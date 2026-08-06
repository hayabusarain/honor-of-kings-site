import cv2
import json
import numpy as np
import os
import re

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load hok_heroes.json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

# Load OCR Data
with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

ocr_map = {item['filename']: item['text'] for item in ocr_data}

print("Inspecting all screenshot display screens for hero names...")

for num in range(3730, 3956):
    fname = f"スクリーンショット ({num}).png"
    txt = ocr_map.get(fname, "")
    
    # Clean text
    clean_t = txt.replace(' ', '').replace('　', '').replace('\n', '')
    
    for h in hok_heroes:
        hname = h['name']
        if len(hname) >= 2 and hname in clean_t:
            print(f"Screenshot ({num}).png -> HERO FOUND: {hname} (ID: {h['id']})")
