import json

with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

for item in data[:40]:
    print(f"{item['filename']}: {item['text']}")
