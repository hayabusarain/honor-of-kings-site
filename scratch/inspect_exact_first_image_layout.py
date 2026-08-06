import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Pictures\Screenshots'
subdirs = sorted([d for d in os.listdir(folder) if os.path.isdir(os.path.join(folder, d)) and ("Set_" in d or "_" in d)])

print(f"Inspecting first images of first 10 set folders...")

for i, sd in enumerate(subdirs[:10]):
    sd_path = os.path.join(folder, sd)
    files = sorted([f for f in os.listdir(sd_path) if f.endswith('.png')])
    if files:
        img_path = os.path.join(sd_path, files[0])
        img = read_img_unicode(img_path)
        if img is not None:
            # Crop middle header area, top left, top right, etc.
            cv2.imwrite(f"scratch/full_first_{i+1}.png", img)
            # Crop top banner (y: 0 to 250, x: 0 to 1920)
            h, w, _ = img.shape
            if w != 1920 or h != 1080:
                img = cv2.resize(img, (1920, 1080))
            crop_banner = img[0:250, 0:1920]
            cv2.imwrite(f"scratch/banner_first_{i+1}.png", crop_banner)
            print(f"Saved banner_first_{i+1}.png for {sd} -> {files[0]}")
