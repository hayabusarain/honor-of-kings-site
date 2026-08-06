import cv2
import json
import numpy as np
import os
import subprocess

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Pictures\Screenshots'
subdirs = sorted([d for d in os.listdir(folder) if os.path.isdir(os.path.join(folder, d))])

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

# Crop hero title region for all 113 set folders
temp_crops = []

for sd in subdirs:
    sd_path = os.path.join(folder, sd)
    files = sorted([f for f in os.listdir(sd_path) if f.endswith('.png')])
    if not files:
        continue
        
    first_path = os.path.join(sd_path, files[0])
    img = read_img_unicode(first_path)
    if img is None:
        continue
        
    h_img, w_img, _ = img.shape
    if w_img != 1920 or h_img != 1080:
        img = cv2.resize(img, (1920, 1080))
        
    # Crop hero name title region (y: 140 to 230, x: 1100 to 1450)
    name_crop = img[140:230, 1100:1450]
    out_crop_path = os.path.join('scratch', f"title_{sd}.png")
    cv2.imwrite(out_crop_path, name_crop)
    temp_crops.append((sd, out_crop_path, files[0]))

print(f"Cropped {len(temp_crops)} hero title regions to scratch/ directory.")
