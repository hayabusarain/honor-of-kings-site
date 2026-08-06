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
# Special override: (3430) is "アタ" (ID 620)

pairs = []
i = 0
while i < len(ocr_data):
    filename = ocr_data[i]['filename']
    text = ocr_data[i]['text'].replace(' ', '').replace('　', '')
    num_match = re.search(r'\((\d+)\)', filename)
    num = int(num_match.group(1)) if num_match else 0

    if num == 3430:
        # Special case for Ata (3430)
        status_file = filename
        status_text = ocr_data[i]['text']
        pairs.append({
            "hero_name": "アタ",
            "hero_id": "620",
            "name_file": "Missing (3429)",
            "status_file": status_file,
            "status_text": status_text
        })
        i += 1
        continue

    # Search for hero name in text
    found_hero_name = None
    found_hero_id = None

    for hname, hid in hero_dict.items():
        if hname in text:
            found_hero_name = hname
            found_hero_id = hid
            break

    if found_hero_name and (i + 1) < len(ocr_data):
        next_file = ocr_data[i + 1]['filename']
        next_text = ocr_data[i + 1]['text']
        pairs.append({
            "hero_name": found_hero_name,
            "hero_id": found_hero_id,
            "name_file": filename,
            "status_file": next_file,
            "status_text": next_text
        })
        i += 2
    else:
        i += 1

print(f"Successfully identified {len(pairs)} hero pairs!")
for p in pairs[:25]:
    print(f"({p['name_file']} -> {p['status_file']}): {p['hero_name']} (ID: {p['hero_id']})")
