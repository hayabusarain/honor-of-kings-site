import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load OCR Data
with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

for item in ocr_data:
    txt = item['text']
    if 'アーサー' in txt or 'Arthur' in txt:
        print(f"Found Arthur in {item['filename']}: {txt[:100]}")
