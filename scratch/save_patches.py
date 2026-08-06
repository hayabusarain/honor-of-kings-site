import cv2
import numpy as np

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

path = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
img = read_img_unicode(path)

# Let's crop a wide horizontal strip across y: 400 to 800, x: 600 to 1400
strip1 = img[400:580, 650:1350]
cv2.imwrite(r'C:\Users\81901\.gemini\antigravity\brain\a68a100b-b7ec-493a-b0f7-9b8c6e2445bd\strip1.png', strip1)

strip2 = img[650:830, 650:1350]
cv2.imwrite(r'C:\Users\81901\.gemini\antigravity\brain\a68a100b-b7ec-493a-b0f7-9b8c6e2445bd\strip2.png', strip2)

print("Saved strip1.png and strip2.png!")
