import cv2
import json
import numpy as np
import os
import re

def read_img_unicode(path):
    try:
        return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)
    except Exception as e:
        return None

# Load hok_items.json
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    hok_items = json.load(f)

# Load item icon templates
templates = []
for item in hok_items:
    icon_rel = item['icon'].lstrip('/')
    icon_path = os.path.join('public', icon_rel)
    if os.path.exists(icon_path):
        img = read_img_unicode(icon_path)
        if img is not None:
            img_resized = cv2.resize(img, (60, 60))
            templates.append({
                "id": item['id'],
                "name": item['name'],
                "name_en": item.get('name_en') or item['name'],
                "img": img_resized
            })

print(f"Loaded {len(templates)} item icon templates.")

def match_item_patch(patch):
    if patch is None or patch.size == 0:
        return None
    patch_resized = cv2.resize(patch, (60, 60))
    
    best_score = -1
    best_item = None
    
    for t in templates:
        res = cv2.matchTemplate(patch_resized, t['img'], cv2.TM_CCOEFF_NORMED)
        score = res[0][0]
        if score > best_score:
            best_score = score
            best_item = t
            
    return best_item if best_score > 0.40 else None

# Load OCR data and Hero DB
with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

hero_dict = {h['name']: str(h['id']) for h in hok_heroes}

pairs = []
i = 0
while i < len(ocr_data):
    filename = ocr_data[i]['filename']
    text_clean = ocr_data[i]['text'].replace(' ', '').replace('　', '')

    found_name = None
    found_id = None
    for hname, hid in hero_dict.items():
        if hname in text_clean:
            found_name = hname
            found_id = hid
            break

    if found_name and (i + 1) < len(ocr_data):
        pairs.append({
            "hero_name": found_name,
            "hero_id": found_id,
            "build_file": ocr_data[i + 1]['filename'],
            "build_raw": ocr_data[i + 1]['text']
        })
        i += 2
    else:
        i += 1

print(f"Processing {len(pairs)} build screenshots...")

with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    ja_skills = json.load(f)

with open('public/data/skills/en.json', 'r', encoding='utf-8') as f:
    en_skills = json.load(f)

updated_builds = 0

for p in pairs:
    hid = p['hero_id']
    build_path = os.path.join(r'C:\Users\81901\Pictures\Screenshots', p['build_file'])
    
    img = read_img_unicode(build_path)
    if img is None:
        continue
        
    h, w, _ = img.shape
    
    wins_match = re.search(r'勝利\s*:\s*(\d+)', p['build_raw'])
    wr_match = re.search(r'勝率\s*:\s*([\d\.]+)%?', p['build_raw'])
    
    wins = int(wins_match.group(1)) if wins_match else 0
    win_rate = float(wr_match.group(1)) if wr_match else 55.0

    items_b1 = []
    items_b1_en = []
    
    # 6 item slots across build preset line 1
    # Check y-offset ranges around center preset modal
    # In 1920x1080: row 1 items are located at y: 40% - 55%, x: 38% - 75%
    for slot in range(6):
        x_start = int(w * (0.39 + slot * 0.057))
        x_end = int(w * (0.39 + (slot + 0.9) * 0.057))
        
        y1_start = int(h * 0.42)
        y1_end = int(h * 0.53)
        
        patch1 = img[y1_start:y1_end, x_start:x_end]
        matched1 = match_item_patch(patch1)
        if matched1:
            items_b1.append(matched1['name'])
            items_b1_en.append(matched1['name_en'])

    if len(items_b1) >= 4:
        new_preset_ja = {
            "name": "ガチ検証・高勝率人気ビルド (Popular Preset)",
            "title": "高勝率人気ビルド",
            "wins": wins,
            "win_rate": f"{win_rate}%",
            "items": items_b1
        }
        new_preset_en = {
            "name": "Meta Popular Preset",
            "title": "Meta Popular Preset",
            "wins": wins,
            "win_rate": f"{win_rate}%",
            "items": items_b1_en
        }
        
        if hid in ja_skills:
            if 'meta' not in ja_skills[hid]:
                ja_skills[hid]['meta'] = {}
            ja_skills[hid]['meta']['recommended_items'] = items_b1
            ja_skills[hid]['meta']['build_presets'] = [new_preset_ja]

        if hid in en_skills:
            if 'meta' not in en_skills[hid]:
                en_skills[hid]['meta'] = {}
            en_skills[hid]['meta']['recommended_items'] = items_b1_en
            en_skills[hid]['meta']['build_presets'] = [new_preset_en]
            
        updated_builds += 1
        print(f"Hero ID {hid} ({p['hero_name']}): {items_b1}")

print(f"Successfully updated build presets for {updated_builds} heroes in ja.json & en.json!")

with open('public/data/skills/ja.json', 'w', encoding='utf-8') as f:
    json.dump(ja_skills, f, ensure_ascii=False, indent=2)

with open('public/data/skills/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_skills, f, ensure_ascii=False, indent=2)

print("Saved public/data/skills/ja.json and en.json successfully!")
