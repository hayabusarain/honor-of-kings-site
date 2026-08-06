import cv2
import numpy as np
import glob, os, json

img_path = r'C:\Users\81901\Pictures\Screenshots\Set_002_3968-3978\スクリーンショット (3968).png'
# Read using np.fromfile to handle Japanese characters
stream = np.fromfile(img_path, dtype=np.uint8)
img = cv2.imdecode(stream, cv2.IMREAD_COLOR)
if img is None:
    print('Failed to read image')
    exit(1)

gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

found_items = []
for it in items:
    it_id = str(it['id'])
    icon_p = f'public/images/items/{it_id}.jpg'
    if not os.path.exists(icon_p): continue
    
    stream_icon = np.fromfile(icon_p, dtype=np.uint8)
    template = cv2.imdecode(stream_icon, cv2.IMREAD_GRAYSCALE)
    if template is None: continue
    
    best_match = None
    for size in range(40, 95, 5):
        resized = cv2.resize(template, (size, size))
        res = cv2.matchTemplate(gray_img, resized, cv2.TM_CCOEFF_NORMED)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
        
        if max_val > 0.65:
            if best_match is None or max_val > best_match['score']:
                best_match = {
                    'id': it_id, 
                    'name': it.get('name'), 
                    'score': max_val, 
                    'loc': max_loc,
                    'size': size
                }
    
    if best_match:
        found_items.append(best_match)

# Filter overlaps and sort
filtered = []
for it in sorted(found_items, key=lambda x: x['score'], reverse=True):
    overlap = False
    for f in filtered:
        if (it['loc'][0] - f['loc'][0])**2 + (it['loc'][1] - f['loc'][1])**2 < 400:
            overlap = True
            break
    if not overlap:
        filtered.append(it)

filtered.sort(key=lambda x: x['loc'][0])

print('Found matches:')
for it in filtered:
    print('%s (ID: %s) - Score: %.2f at X:%d Y:%d Size:%d' % (it['name'], it['id'], it['score'], it['loc'][0], it['loc'][1], it['size']))
