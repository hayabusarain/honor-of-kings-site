import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load template item icons
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    hok_items = json.load(f)

templates = []
for item in hok_items:
    icon_rel = item['icon'].lstrip('/')
    icon_path = os.path.join('public', icon_rel)
    if os.path.exists(icon_path):
        img = read_img_unicode(icon_path)
        if img is not None:
            templates.append({
                "id": item['id'],
                "name": item['name'],
                "img": img
            })

print(f"Loaded {len(templates)} templates.")

# Test full matchTemplate on screenshot 3738 (Athena build)
test_file = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
scene = read_img_unicode(test_file)

if scene is not None:
    print(f"Scene image dimensions: {scene.shape}")
    
    matches_found = []
    for t in templates:
        t_img = t['img']
        # Try multiple scales of template
        for scale in [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]:
            h_t, w_t = int(t_img.shape[0] * scale), int(t_img.shape[1] * scale)
            if h_t < 10 or w_t < 10 or h_t > scene.shape[0] or w_t > scene.shape[1]:
                continue
            t_scaled = cv2.resize(t_img, (w_t, h_t))
            res = cv2.matchTemplate(scene, t_scaled, cv2.TM_CCOEFF_NORMED)
            loc = np.where(res >= 0.75)
            for pt in zip(*loc[::-1]):
                matches_found.append({
                    "item": t['name'],
                    "id": t['id'],
                    "score": float(res[pt[1], pt[0]]),
                    "pt": (pt[0], pt[1]),
                    "size": (w_t, h_t)
                })

    print(f"Found {len(matches_found)} template matches in 3738.png!")
    for m in matches_found[:20]:
        print(f"  {m['item']} (ID: {m['id']}) at {m['pt']} score {m['score']:.2f}")
