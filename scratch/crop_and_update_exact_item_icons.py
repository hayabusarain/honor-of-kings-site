import cv2
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

path_3732 = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3732).png'
img = read_img_unicode(path_3732)

if img is not None:
    # Bounding boxes for row 1 items in 3732.png
    # Centers around y=495, x=780, 868, 955, 1042, 1130, 1218
    slots = [
        ("1422.jpg", 455, 535, 742, 822),    # 抵抗の靴 (Green Boots)
        ("1331.jpg", 455, 535, 828, 908),    # 紅蓮のマント (Red Mantle)
        ("1137.jpg", 455, 535, 915, 995),    # 暗砕の斧 (Shadow Axe)
        ("1333.jpg", 455, 535, 1002, 1082),  # 不吉な予感 (Silver Armor Blue Gem)
        ("1328.jpg", 455, 535, 1090, 1170),  # ブラッドレイジ (Red Glowing Orb)
        ("1341.jpg", 455, 535, 1178, 1258)   # フロストショック (Golden Blue Shield)
    ]
    
    for filename, y1, y2, x1, x2 in slots:
        crop = img[y1:y2, x1:x2]
        crop_sq = cv2.resize(crop, (120, 120))
        
        save_path = os.path.join('public', 'images', 'items', filename)
        cv2.imwrite(save_path, crop_sq)
        print(f"Updated public/images/items/{filename} with crisp in-game crop!")
