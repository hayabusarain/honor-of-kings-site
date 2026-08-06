import cv2
import json
import glob
import os
import re

# Load all 110 items from src/data/hok_items.json
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    hok_items = json.load(f)

print(f"Loaded {len(hok_items)} items for template matching.")

# Load template item icons into memory
templates = []
for item in hok_items:
    icon_rel = item['icon'].lstrip('/')
    icon_path = os.path.join('public', icon_rel)
    if os.path.exists(icon_path):
        img = cv2.imread(icon_path)
        if img is not None:
            templates.append({
                "id": item['id'],
                "name": item['name'],
                "img": img
            })

print(f"Successfully loaded {len(templates)} item icon templates!")

# Load OCR data
with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

# Load Hok Heroes DB
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

hero_dict = {h['name']: str(h['id']) for h in hok_heroes}

# Identify pairs
pairs = []
i = 0
while i < len(ocr_data):
    filename = ocr_data[i]['filename']
    text_clean = ocr_data[i]['text'].replace(' ', '').replace('　', '')
    num_match = re.search(r'\((\d+)\)', filename)
    num = int(num_match.group(1)) if num_match else 0

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
            "name_file": filename,
            "build_file": ocr_data[i + 1]['filename'],
            "build_raw": ocr_data[i + 1]['text']
        })
        i += 2
    else:
        i += 1

print(f"Identified {len(pairs)} hero build pairs!")
for p in pairs[:10]:
    print(f"({p['name_file']} -> {p['build_file']}): {p['hero_name']} (ID: {p['hero_id']})")
