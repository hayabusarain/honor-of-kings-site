import cv2
import json
import numpy as np
import os
import glob

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load hok_heroes.json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

# Load all hero avatar templates from public/images/heroes/
hero_templates = []
for hero in hok_heroes:
    hid = str(hero['id'])
    # Check avatar paths
    possible_paths = [
        f"public/images/heroes/{hid}.jpg",
        f"public/images/heroes/{hid}.png",
        f"public/images/champions/{hero['name']}.png"
    ]
    img = None
    for p in possible_paths:
        if os.path.exists(p):
            img = read_img_unicode(p)
            if img is not None:
                break
    if img is not None:
        img_resized = cv2.resize(img, (80, 80))
        hero_templates.append({
            "id": hid,
            "name": hero['name'],
            "img": img_resized
        })

print(f"Loaded {len(hero_templates)} hero avatar templates!")

# Let's inspect where hero avatar / portrait is located in screenshot
# In hero display screen (e.g. 3730, 3733, 3737, etc.):
# Let's test matching hero avatars in screenshot 3737 (Athena) and 3733 (Agudo)
for test_num in [3733, 3737, 3739, 3741, 3751, 3753, 3759, 3761, 3763, 3765]:
    test_file = f'C:\\Users\\81901\\Pictures\\Screenshots\\スクリーンショット ({test_num}).png'
    scene = read_img_unicode(test_file)
    if scene is None:
        continue
        
    best_score = -1
    best_hero = None
    
    # Hero avatar in display screen is around left/center top or hero icon area
    # Let's matchTemplate across upper half of screen (y: 0 to 600, x: 0 to 1920)
    upper_scene = scene[0:600, 0:1920]
    
    for ht in hero_templates:
        for scale in [0.8, 1.0, 1.2, 1.5]:
            sw, sh = int(80 * scale), int(80 * scale)
            t_scaled = cv2.resize(ht['img'], (sw, sh))
            res = cv2.matchTemplate(upper_scene, t_scaled, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, _ = cv2.minMaxLoc(res)
            if max_val > best_score:
                best_score = max_val
                best_hero = ht
                
    print(f"Screenshot ({test_num}).png -> Best Match: {best_hero['name']} (ID: {best_hero['id']}) Score: {best_score:.3f}")
