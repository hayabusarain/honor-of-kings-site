import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Desktop\おなきんあいてむ'
files = [f for f in os.listdir(folder) if f.endswith('.png')]

print(f"Found {len(files)} screenshot files in {folder}!")

for f in files[:10]:
    p = os.path.join(folder, f)
    img = read_img_unicode(p)
    if img is not None:
        h, w, c = img.shape
        print(f"File: {f} -> Resolution: {w}x{h}")
