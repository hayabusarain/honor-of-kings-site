import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Desktop\おなきんあいてむ'
p = os.path.join(folder, 'スクリーンショット (2410).png')
img = read_img_unicode(p)

if img is not None:
    # 1. Main Icon in the left list (Selected item icon around x: 345 to 455, y: 300 to 410)
    icon_left = img[295:405, 345:455]
    cv2.imwrite(r'scratch\sample_icon_left.png', icon_left)
    
    # 2. Main Icon in the detail tree (Right top detail icon around x: 1205 to 1295, y: 285 to 375)
    icon_right = img[285:375, 1205:1295]
    cv2.imwrite(r'scratch\sample_icon_right.png', icon_right)
    
    # 3. Item Name Region in tree list (x: 460 to 700, y: 315 to 365)
    name_crop = img[315:365, 460:700]
    cv2.imwrite(r'scratch\sample_name.png', name_crop)
    
    # 4. Item Name Region in right panel (x: 1440 to 1750, y: 165 to 220)
    title_crop = img[165:220, 1440:1750]
    cv2.imwrite(r'scratch\sample_title.png', title_crop)
    
    # 5. Right Panel Details (x: 1440 to 1800, y: 220 to 600)
    details_crop = img[220:600, 1440:1800]
    cv2.imwrite(r'scratch\sample_details.png', details_crop)

    print("Cropped sample layout regions to scratch/ directory!")
