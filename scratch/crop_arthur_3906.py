import cv2
import numpy as np

path = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3906).png'
img = cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

if img is not None:
    # Crop Row 1 items (y: 450 to 540, x: 730 to 1260)
    row1 = img[440:550, 720:1270]
    out_path = r'C:\Users\81901\.gemini\antigravity\brain\a68a100b-b7ec-493a-b0f7-9b8c6e2445bd\arthur_screenshot_3906_row.png'
    cv2.imwrite(out_path, row1)
    print("Saved arthur_screenshot_3906_row.png successfully!")
