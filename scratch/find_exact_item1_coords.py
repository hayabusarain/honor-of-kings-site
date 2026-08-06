import cv2
import numpy as np

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

path = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
img = read_img_unicode(path)

# Template 11110.png (赤蓮マント)
template = read_img_unicode(r'public\images\items\11110.png')
th, tw, _ = template.shape

# Crop center 70% of template
t_crop = template[int(th*0.15):int(th*0.85), int(tw*0.15):int(tw*0.85)]

print(f"Full image shape: {img.shape}")

# Test multiple scales of t_crop
best_max_val = 0
best_pos = None
best_scale = 0

for scale in [0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.15, 0.20]:
    sw, sh = int(t_crop.shape[1] * scale), int(t_crop.shape[0] * scale)
    if sw < 10 or sh < 10:
        continue
    t_scaled = cv2.resize(t_crop, (sw, sh))
    res = cv2.matchTemplate(img, t_scaled, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
    print(f"Scale {scale:.2f} (size {sw}x{sh}): Max Score {max_val:.3f} at {max_loc}")
    if max_val > best_max_val:
        best_max_val = max_val
        best_pos = max_loc
        best_scale = scale

print(f"\nBEST OVERALL MATCH: Score {best_max_val:.3f} at position {best_pos} with scale {best_scale}")
