import numpy as np
from PIL import Image

def find_crop():
    try:
        img_full = np.array(Image.open(r'C:\Users\81901\Desktop\screenshots\hero_003_passive.png').convert('RGB'))
        img_crop = np.array(Image.open(r'public\images\skills\hero_003_passive.png').convert('RGB'))
        h, w = img_crop.shape[:2]
        
        # We can also do template matching if exact match fails due to png compression,
        # but let's try exact match first on a subset of rows to be faster.
        for y in range(0, img_full.shape[0] - h, 2):
            for x in range(0, img_full.shape[1] - w, 2):
                if np.array_equal(img_full[y:y+h, x:x+w], img_crop):
                    print(f'Exact Match Found at x={x}, y={y}')
                    return
        print("Exact match not found, trying MSE...")
        
        # Try MSE for top-left pixel matching
        best_mse = float('inf')
        best_pos = None
        for y in range(0, img_full.shape[0] - h, 5):
            for x in range(0, img_full.shape[1] - w, 5):
                mse = np.mean((img_full[y:y+h, x:x+w] - img_crop) ** 2)
                if mse < best_mse:
                    best_mse = mse
                    best_pos = (x, y)
        print(f"Best MSE: {best_mse} at x={best_pos[0]}, y={best_pos[1]}")
    except Exception as e:
        print("Error:", e)

find_crop()
