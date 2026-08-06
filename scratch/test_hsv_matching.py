import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load hok_items.json
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    hok_items = json.load(f)

# Circular mask
mask = np.zeros((68, 68), dtype=np.uint8)
cv2.circle(mask, (34, 34), 28, 255, -1)

templates = []
for item in hok_items:
    icon_rel = item['icon'].lstrip('/')
    icon_path = os.path.join('public', icon_rel)
    if os.path.exists(icon_path):
        img = read_img_unicode(icon_path)
        if img is not None:
            img_resized = cv2.resize(img, (68, 68))
            masked_t = cv2.bitwise_and(img_resized, img_resized, mask=mask)
            
            # Compute HSV histogram for template
            hsv_t = cv2.cvtColor(masked_t, cv2.COLOR_BGR2HSV)
            hist_t = cv2.calcHist([hsv_t], [0, 1], mask, [18, 25], [0, 180, 0, 256])
            cv2.normalize(hist_t, hist_t, 0, 1, cv2.NORM_MINMAX)
            
            templates.append({
                "id": item['id'],
                "name": item['name'],
                "name_en": item.get('name_en') or item['name'],
                "img": masked_t,
                "hist": hist_t
            })

print(f"Loaded {len(templates)} templates with HSV color histograms.")

test_file = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
img = read_img_unicode(test_file)

# Row 1 (Build 1) item centers in Athena screenshot
# Item 1: 赤蓮マント (11110)
# Item 2: 抵抗の靴 (11210)
# Item 3: マスターブレード (1134)
# Item 4: シャドーアックス (1137)
# Item 5: ウィッチクローク (1154)
# Item 6: 血魔の怒り (1159)

x_centers = [780, 868, 956, 1044, 1132, 1220]
y_center = 490 # Y center of row 1 items

print("\n--- COMBINED HSV + TEMPLATE MATCHING (ATHENA ROW 1) ---")
for idx, xc in enumerate(x_centers):
    patch = img[y_center-34:y_center+34, xc-34:xc+34]
    if patch.shape[0] != 68 or patch.shape[1] != 68:
        patch = cv2.resize(patch, (68, 68))
    patch_masked = cv2.bitwise_and(patch, patch, mask=mask)
    
    hsv_p = cv2.cvtColor(patch_masked, cv2.COLOR_BGR2HSV)
    hist_p = cv2.calcHist([hsv_p], [0, 1], mask, [18, 25], [0, 180, 0, 256])
    cv2.normalize(hist_p, hist_p, 0, 1, cv2.NORM_MINMAX)
    
    best_score = -999
    best_item = None
    
    for t in templates:
        # MatchTemplate score
        res = cv2.matchTemplate(patch_masked, t['img'], cv2.TM_CCOEFF_NORMED)
        t_score = res[0][0]
        
        # Hist Correlation score
        h_score = cv2.compareHist(hist_p, t['hist'], cv2.HISTCMP_CORREL)
        
        combined = 0.5 * t_score + 0.5 * h_score
        if combined > best_score:
            best_score = combined
            best_item = t
            
    print(f"Slot {idx+1} (x={xc}): {best_item['name']} (ID: {best_item['id']}) Score: {best_score:.3f}")
