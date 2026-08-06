import cv2
import json
import numpy as np
import os
import subprocess

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Pictures\Screenshots'
subdirs = sorted([d for d in os.listdir(folder) if d.startswith("Set_") and os.path.isdir(os.path.join(folder, d))])

print(f"Total set folders found: {len(subdirs)}")

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

hero_names = [h['name'] for h in heroes] + [h.get('name_en', '') for h in heroes]

# Test Windows OCR script on first 5 set folders
for sd in subdirs[:5]:
    sd_path = os.path.join(folder, sd)
    files = sorted([f for f in os.listdir(sd_path) if f.endswith('.png')])
    if files:
        first_img_path = os.path.join(sd_path, files[0])
        print(f"Folder {sd} -> First image: {files[0]}")
