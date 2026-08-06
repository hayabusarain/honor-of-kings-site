import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Pictures\Screenshots'
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

# Save crops of top left title for 3957 to 3975 to inspect hero transitions
for num in range(3957, 3978):
    p = os.path.join(folder, f"スクリーンショット ({num}).png")
    if os.path.exists(p):
        img = read_img_unicode(p)
        if img is not None:
            # Crop top-left hero header area (y: 0 to 120, x: 0 to 400)
            crop = img[0:120, 0:400]
            out_p = os.path.join('scratch', f'header_{num}.png')
            cv2.imwrite(out_p, crop)

print("Cropped headers for 3957 to 3977 to scratch/ directory.")
