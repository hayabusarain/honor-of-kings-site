import json
import re

with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

for i, item in enumerate(ocr_data):
    txt = item['text'].replace(' ', '').replace('　', '')
    if 'アーサー' in txt:
        print(f"Index {i}: {item['filename']} -> {txt[:100]}")
        if (i + 1) < len(ocr_data):
            print(f"  Next screenshot {ocr_data[i+1]['filename']} -> {ocr_data[i+1]['text'][:100]}")
