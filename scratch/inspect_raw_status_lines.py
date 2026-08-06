import json

with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

status_files = ['スクリーンショット (3428).png', 'スクリーンショット (3430).png', 'スクリーンショット (3432).png', 'スクリーンショット (3434).png']

for item in data:
    if item['filename'] in status_files:
        print(f"=== {item['filename']} ===")
        print(repr(item['text']))
