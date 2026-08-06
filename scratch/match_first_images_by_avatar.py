import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Pictures\Screenshots'
subdirs = sorted([d for d in os.listdir(folder) if d.startswith("Set_") and os.path.isdir(os.path.join(folder, d))])

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

# Pre-load hero avatar images
hero_avatars = []
for h in heroes:
    avatar_url = h.get('avatar', f"/images/heroes/{h['id']}.png")
    avatar_path = os.path.join('public', avatar_url.lstrip('/'))
    if os.path.exists(avatar_path):
        img = read_img_unicode(avatar_path)
        if img is not None:
            sq = cv2.resize(img, (64, 64))
            hero_avatars.append((h, sq))

print(f"Pre-loaded {len(hero_avatars)} hero avatars for template matching.")

rename_plan = []

for sd in subdirs:
    sd_path = os.path.join(folder, sd)
    files = sorted([f for f in os.listdir(sd_path) if f.endswith('.png')])
    if not files:
        continue
        
    first_file_path = os.path.join(sd_path, files[0])
    img = read_img_unicode(first_file_path)
    if img is None:
        continue
        
    # Crop hero header avatar or main display region
    # Test multiple candidate crop regions in screen:
    # 1. Top left avatar / hero display region
    # 2. Main hero portrait
    best_score = -1
    best_hero = None
    
    # Resize screen to standard 1920x1080 if needed
    h_img, w_img, _ = img.shape
    if w_img != 1920 or h_img != 1080:
        img_std = cv2.resize(img, (1920, 1080))
    else:
        img_std = img
        
    # Standard hero overview screen top-left or hero avatar location
    crop = img_std[0:200, 0:400]
    
    for h_info, avatar_sq in hero_avatars:
        res = cv2.matchTemplate(crop, avatar_sq, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, _ = cv2.minMaxLoc(res)
        if max_val > best_score:
            best_score = max_val
            best_hero = h_info
            
    hero_name = best_hero['name'] if (best_hero and best_score >= 0.35) else "UNKNOWN"
    
    parts = sd.split('_')
    set_num = parts[1]
    range_str = parts[2]
    
    new_name = f"Set_{set_num}_{hero_name}_{range_str}"
    rename_plan.append({
        "old_dir": sd,
        "new_dir": new_name,
        "hero_id": best_hero['id'] if best_hero else None,
        "hero_name": hero_name,
        "score": round(float(best_score), 3),
        "first_file": files[0]
    })

print("\nSample Hero Detection Results (First 20 Set Folders):")
for r in rename_plan[:20]:
    print(f"  {r['old_dir']} -> {r['new_dir']} (Score: {r['score']})")

with open('scratch/avatar_rename_plan.json', 'w', encoding='utf-8') as f:
    json.dump(rename_plan, f, ensure_ascii=False, indent=2)

print("\nSaved avatar rename plan to scratch/avatar_rename_plan.json!")
