import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

path = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
img = read_img_unicode(path)

# Let's crop a window around the item row: y: 450 to 560, x: 700 to 1300
strip = img[450:560, 700:1300]
cv2.imwrite(r'C:\Users\81901\.gemini\antigravity\brain\a68a100b-b7ec-493a-b0f7-9b8c6e2445bd\item_row1_crop.png', strip)

# Load target item 11110 (赤蓮マント)
icon1 = read_img_unicode(r'public\images\items\11110.png')
if icon1 is not None:
    # Resize template to various sizes and match
    for sz in [50, 60, 70, 80, 90, 100]:
        t_sz = cv2.resize(icon1, (sz, sz))
        res = cv2.matchTemplate(strip, t_sz, cv2.TM_CCOEFF_NORMED)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
        print(f"Template 11110 (size {sz}): Max Score {max_val:.3f} at local strip pos {max_loc}")

print("Saved item_row1_crop.png!")
