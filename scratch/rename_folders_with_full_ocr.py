import json
import os
import re

base_folder = r'C:\Users\81901\Pictures\Screenshots'
with open('scratch/all_hero_folder_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

print(f"Processing OCR text for {len(ocr_data)} folders against {len(heroes)} heroes...")

rename_map = []

for item in ocr_data:
    current_dir = item['dir']
    ocr_text = item['text']
    
    # Extract set number and range string
    m = re.search(r'Set_(\d+)_(?:.*_)?(\d+-\d+)', current_dir)
    if not m:
        m = re.search(r'Set_(\d+)_(\d+-\d+)', current_dir)
        
    if m:
        set_num = m.group(1)
        range_str = m.group(2)
    else:
        continue
        
    matched_hero = None
    if ocr_text:
        # Match hero name in text
        for h in heroes:
            hname = h['name']
            hname_en = h.get('name_en', '')
            if hname in ocr_text or (hname_en and len(hname_en) >= 3 and hname_en.lower() in ocr_text.lower()):
                matched_hero = hname
                break
                
        if not matched_hero:
            # Match 2-char substring
            for h in heroes:
                hname = h['name']
                if len(hname) >= 2 and hname[:2] in ocr_text:
                    matched_hero = hname
                    break
                    
    final_name = matched_hero if matched_hero else "UNKNOWN"
    new_dir_name = f"Set_{set_num}_{final_name}_{range_str}"
    
    rename_map.append({
        "old_dir": current_dir,
        "new_dir": new_dir_name,
        "hero_name": final_name
    })

# Execute folder renames on disk
renamed_count = 0
for r in rename_map:
    old_p = os.path.join(base_folder, r['old_dir'])
    new_p = os.path.join(base_folder, r['new_dir'])
    if os.path.exists(old_p) and old_p != new_p:
        os.rename(old_p, new_p)
        renamed_count += 1
        print(f"  [FIXED] {r['old_dir']} -> {r['new_dir']}")

print(f"\nFinal Folder Renaming Execution Summary:")
print(f"  Successfully Renamed: {renamed_count} folders")

with open('scratch/final_folder_rename_report.json', 'w', encoding='utf-8') as f:
    json.dump(rename_map, f, ensure_ascii=False, indent=2)

print("Saved final folder rename report to scratch/final_folder_rename_report.json!")
