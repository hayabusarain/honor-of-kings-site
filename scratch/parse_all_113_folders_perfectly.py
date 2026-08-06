import cv2
import json
import numpy as np
import os
import re
import subprocess

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

base_folder = r'C:\Users\81901\Pictures\Screenshots'
subdirs = sorted([d for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d))])

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

print(f"Loaded {len(heroes)} heroes. Parsing {len(subdirs)} set folders...")

rename_map = []

for idx, sd in enumerate(subdirs):
    sd_path = os.path.join(base_folder, sd)
    files = sorted([f for f in os.listdir(sd_path) if f.endswith('.png')])
    if not files:
        continue
        
    m = re.search(r'Set_(\d+)_(?:.*_)?(\d+-\d+)', sd)
    if not m:
        m = re.search(r'Set_(\d+)_(\d+-\d+)', sd)
    if not m:
        continue
        
    set_num = m.group(1)
    range_str = m.group(2)
    
    # 1. First test top header image crop (title text in image 1)
    first_path = os.path.join(sd_path, files[0])
    img = read_img_unicode(first_path)
    matched_hero = None
    
    if img is not None:
        h, w, _ = img.shape
        if w != 1920 or h != 1080:
            img = cv2.resize(img, (1920, 1080))
        # Crop title region (y: 140 to 230, x: 1100 to 1450)
        title_crop = img[140:230, 1100:1450]
        tmp_p = os.path.abspath(os.path.join('scratch', 'temp_header.png'))
        cv2.imwrite(tmp_p, title_crop)
        
        # Run winocr.exe on temp_header.png
        try:
            proc = subprocess.run(['scratch\\winocr.exe', tmp_p], capture_output=True, text=True, encoding='utf-8')
            header_txt = proc.stdout.strip().replace(" ", "").replace("\n", "").replace("\r", "")
        except Exception as e:
            header_txt = ""
            
        if header_txt:
            for h_item in heroes:
                hn = h_item['name']
                hne = h_item.get('name_en', '')
                if hn in header_txt or (hne and len(hne) >= 3 and hne.lower() in header_txt.lower()):
                    matched_hero = hn
                    break
                    
    # 2. If not matched, run ocr_folder.exe on full folder and parse victory count / full text
    full_ocr_text = ""
    if not matched_hero:
        try:
            proc2 = subprocess.run(['scratch\\ocr_folder.exe', os.path.abspath(sd_path)], capture_output=True, text=True, encoding='utf-8')
            full_ocr_text = proc2.stdout.strip().replace(" ", "").replace("\n", "").replace("\r", "")
        except Exception as e:
            full_ocr_text = ""
            
        if full_ocr_text:
            for h_item in heroes:
                hn = h_item['name']
                hne = h_item.get('name_en', '')
                if hn in full_ocr_text or (hne and len(hne) >= 3 and hne.lower() in full_ocr_text.lower()):
                    matched_hero = hn
                    break
                    
            if not matched_hero:
                for h_item in heroes:
                    hn = h_item['name']
                    if len(hn) >= 2 and hn[:2] in full_ocr_text:
                        matched_hero = hn
                        break

    final_name = matched_hero if matched_hero else "UNKNOWN"
    new_dir = f"Set_{set_num}_{final_name}_{range_str}"
    
    rename_map.append({
        "set_num": set_num,
        "old_dir": sd,
        "new_dir": new_dir,
        "hero_name": final_name
    })
    print(f"[{set_num}] {sd} -> {new_dir} (Hero: {final_name})")

# Execute rename on disk
renamed_count = 0
for r in rename_map:
    old_p = os.path.join(base_folder, r['old_dir'])
    new_p = os.path.join(base_folder, r['new_dir'])
    if os.path.exists(old_p) and old_p != new_p:
        try:
            os.rename(old_p, new_p)
            renamed_count += 1
        except Exception as e:
            print(f"Rename error {r['old_dir']}: {e}")

print(f"\nCOMPLETED! Renamed {renamed_count} set folders to exact Japanese hero names!")

with open('scratch/perfect_hero_folders_report.json', 'w', encoding='utf-8') as f:
    json.dump(rename_map, f, ensure_ascii=False, indent=2)
