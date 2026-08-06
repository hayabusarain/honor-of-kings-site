import cv2
import numpy as np

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

path = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
img = read_img_unicode(path)

# Slot 1 in Athena build 1: 赤蓮マント (Blazing Cape / 11110)
slot1 = img[440:530, 715:805]
cv2.imwrite(r'C:\Users\81901\.gemini\antigravity\brain\a68a100b-b7ec-493a-b0f7-9b8c6e2445bd\slot1.png', slot1)

template11110 = read_img_unicode(r'public\images\items\11110.png')
cv2.imwrite(r'C:\Users\81901\.gemini\antigravity\brain\a68a100b-b7ec-493a-b0f7-9b8c6e2445bd\template11110.png', template11110)

print(f"Slot1 shape: {slot1.shape}, Template shape: {template11110.shape if template11110 is not None else None}")
