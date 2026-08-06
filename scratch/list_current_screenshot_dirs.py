import json
import os

base_folder = r'C:\Users\81901\Pictures\Screenshots'
dirs = sorted(os.listdir(base_folder))

with open('scratch/all_hero_folder_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

print(f"Total items in Screenshots folder: {len(dirs)}")
print("\nFirst 15 current directory names:")
for d in dirs[:15]:
    print(f"  '{d}'")

renamed = 0
for idx, d in enumerate(dirs):
    if not os.path.isdir(os.path.join(base_folder, d)):
        continue
    ocr_entry = ocr_data[idx] if idx < len(ocr_data) else None
    ocr_text = ocr_entry['text'] if ocr_entry else ""
    
    matched_hero = None
    if ocr_text:
        for h in heroes:
            hname = h['name']
            hname_en = h.get('name_en', '')
            if hname in ocr_text or (hname_en and len(hname_en) >= 3 and hname_en.lower() in ocr_text.lower()):
                matched_hero = hname
                break
                
        if not matched_hero:
            for h in heroes:
                hname = h['name']
                if len(hname) >= 2 and hname[:2] in ocr_text:
                    matched_hero = hname
                    break
                    
    if matched_hero:
        # Rebuild clean folder name
        # e.g. Set_001_アーサー_3957-3967
        parts = d.split('_')
        set_num = parts[1] if len(parts) > 1 else f"{idx+1:03d}"
        range_str = parts[-1] if len(parts) > 2 else ""
        
        new_name = f"Set_{set_num}_{matched_hero}_{range_str}"
        old_p = os.path.join(base_folder, d)
        new_p = os.path.join(base_folder, new_name)
        if old_p != new_p:
            os.rename(old_p, new_p)
            renamed += 1
            print(f"  [{set_num}] Renamed '{d}' -> '{new_name}'")

print(f"\nSuccessfully renamed {renamed} folders to their exact Japanese hero names!")
