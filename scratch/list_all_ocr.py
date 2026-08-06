import json

with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('scratch/all_screenshots_list.txt', 'w', encoding='utf-8') as f:
    for item in ocr_data:
        f.write(f"=== {item['filename']} ===\n")
        f.write(item['text'] + "\n\n")

print(f"Wrote OCR text of all {len(ocr_data)} screenshots to scratch/all_screenshots_list.txt!")
