import json
import re

with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

print(f"Total screenshots: {len(ocr_data)}")

# Let's inspect every screenshot to see what hero names appear
found_matches = {}

for i in range(0, len(ocr_data)-1, 2):
    file1 = ocr_data[i]['filename']
    txt1 = ocr_data[i]['text']
    file2 = ocr_data[i+1]['filename']
    txt2 = ocr_data[i+1]['text']
    
    # Clean text
    clean_t1 = txt1.replace(' ', '').replace('　', '')
    
    matched_hero = None
    for h in hok_heroes:
        hname = h['name']
        hid = str(h['id'])
        # Try matching full name or parts
        if hname in clean_t1 or (len(hname) >= 3 and hname[:3] in clean_t1):
            matched_hero = h
            break
            
    if matched_hero:
        found_matches[matched_hero['id']] = {
            "name": matched_hero['name'],
            "file1": file1,
            "file2": file2,
            "text1": txt1[:60],
            "text2": txt2[:60]
        }
    else:
        print(f"Unmatched pair ({file1}, {file2}): text -> {clean_t1[:60]}")

print(f"\nMatched {len(found_matches)} / {len(hok_heroes)} heroes from screenshots!")
