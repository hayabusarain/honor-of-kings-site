import json
import re

with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

hero_dict = {}
for h in hok_heroes:
    hero_dict[h['name']] = str(h['id'])

print(f"Loaded {len(ocr_data)} OCR items and {len(hero_dict)} hero DB entries.")

# Process OCR list
# Screenshots run from (3425) to (3652)
# Pattern: Hero Name screen -> Status screen
# Special override: (3430) is "アタ" (ID 620 / 556)

hero_stats_extracted = {}
current_hero = None

for i, item in enumerate(ocr_data):
    filename = item['filename']
    text = item['text']
    num_match = re.search(r'\((\d+)\)', filename)
    num = int(num_match.group(1)) if num_match else 0

    if num == 3430:
        current_hero = {"name": "アタ", "id": "620"}
    
    # Check if this item is a hero name display screen
    found_hero = None
    for hname, hid in hero_dict.items():
        if hname in text and len(hname) >= 2:
            found_hero = {"name": hname, "id": hid}
            break
            
    if found_hero and num != 3430:
        current_hero = found_hero
        continue

    # Check if this item is a status screen
    if "ステータス" in text or "最大" in text or "物理攻撃" in text or "HP" in text:
        if current_hero:
            hero_stats_extracted[current_hero['id']] = {
                "hero_name": current_hero['name'],
                "filename": filename,
                "raw_text": text[:150]
            }

print(f"Successfully paired {len(hero_stats_extracted)} heroes with status screens!")
for hid, data in list(hero_stats_extracted.items())[:20]:
    print(f"ID {hid} ({data['hero_name']}): {data['filename']}")
