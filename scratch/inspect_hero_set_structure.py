import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Pictures\Screenshots'

print("Inspecting images 3957 to 3977...")

for num in range(3957, 3978):
    p = os.path.join(folder, f"スクリーンショット ({num}).png")
    if os.path.exists(p):
        img = read_img_unicode(p)
        if img is not None:
            h, w, c = img.shape
            print(f"File ({num}).png -> Resolution: {w}x{h}")
