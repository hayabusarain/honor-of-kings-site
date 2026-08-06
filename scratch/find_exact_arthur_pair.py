import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load Arthur's avatar image public/images/heroes/166.png
arthur_img = read_img_unicode(r'public\images\heroes\166.png')
if arthur_img is not None:
    arthur_t = cv2.resize(arthur_img, (80, 80))

print("Searching all screenshots (3730) to (3956) for Arthur's exact screenshot...")

best_score = -1
best_even_num = None

for num in range(3730, 3956, 2):
    p = f'C:\\Users\\81901\\Pictures\\Screenshots\\スクリーンショット ({num}).png'
    if not os.path.exists(p):
        continue
    img = read_img_unicode(p)
    if img is None:
        continue
        
    crop = img[0:300, 0:600]
    res = cv2.matchTemplate(crop, arthur_t, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, _ = cv2.minMaxLoc(res)
    
    if max_val > best_score:
        best_score = max_val
        best_even_num = num

print(f"Arthur's Display Screenshot: ({best_even_num}).png (Score: {best_score:.3f})")
print(f"Arthur's Build Screenshot: ({best_even_num + 1}).png")
