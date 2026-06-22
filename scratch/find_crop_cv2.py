import cv2
import numpy as np

def find_with_cv2():
    try:
        img = cv2.imread(r'C:\Users\81901\Desktop\screenshots\hero_003_passive.png')
        template = cv2.imread(r'C:\Users\81901\Desktop\temp_crop.png')
        
        result = cv2.matchTemplate(img, template, cv2.TM_SQDIFF_NORMED)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
        
        print(f"Match result: min_val={min_val}, min_loc={min_loc}")
    except Exception as e:
        print("Error:", e)

find_with_cv2()
