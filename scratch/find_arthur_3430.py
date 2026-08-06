import os
import cv2
import numpy as np

for num in range(3425, 3445):
    p = f'C:\\Users\\81901\\Pictures\\Screenshots\\スクリーンショット ({num}).png'
    if os.path.exists(p):
        print(f"Exists: ({num}).png")
