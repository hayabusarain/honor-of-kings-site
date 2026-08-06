import cv2
import numpy as np

p = r'C:\Users\81901\Desktop\おなきんあいてむ\スクリーンショット (2410).png'
img = cv2.imdecode(np.fromfile(p, dtype=np.uint8), cv2.IMREAD_COLOR)

if img is not None:
    # Save preview image
    cv2.imwrite(r'C:\Users\81901\.gemini\antigravity\brain\a68a100b-b7ec-493a-b0f7-9b8c6e2445bd\sample_onakin_2410.png', img)
    print("Saved sample_onakin_2410.png successfully!")
