import os
import json
import re
import subprocess
import sys

# Paths
base_dir = r"C:\Users\81901\Pictures\Screenshots"
proj_dir = r"C:\Users\81901\Desktop\オナーオブキングスサイト"
scratch_dir = os.path.join(proj_dir, "scratch")

with open(os.path.join(proj_dir, "src/data/hok_heroes.json"), "r", encoding="utf-8") as f:
    heroes = json.load(f)
with open(os.path.join(proj_dir, "src/data/hok_items.json"), "r", encoding="utf-8") as f:
    items = json.load(f)
with open(os.path.join(proj_dir, "src/data/hok_spells.json"), "r", encoding="utf-8") as f:
    spells = json.load(f)
with open(os.path.join(proj_dir, "src/data/hok_arcanas.json"), "r", encoding="utf-8") as f:
    arcanas = json.load(f)

items_sorted = sorted(items, key=lambda x: len(x['name']), reverse=True)
arcanas_sorted = sorted(arcanas, key=lambda x: len(x['name']), reverse=True)
spells_sorted = sorted(spells, key=lambda x: len(x['name']), reverse=True)
heroes_sorted = sorted(heroes, key=lambda x: len(x['name']), reverse=True)

results = []

def clean_text(t):
    return t.replace(' ', '').replace('　', '').replace('\u200b', '')

for set_num in range(89, 100):
    folder_prefix = f"Set_{set_num:03d}"
    found_folder = None
    for d in os.listdir(base_dir):
        if d.startswith(folder_prefix):
            found_folder = os.path.join(base_dir, d)
            break
            
    if not found_folder:
        print(f"Folder {folder_prefix} not found.")
        continue
        
    print(f"Processing {found_folder}...")
    
    exe_path = os.path.join(scratch_dir, "ocr_folder.exe")
    proc = subprocess.run([exe_path, found_folder], capture_output=True, text=True, encoding='utf-8', errors='ignore')
    
    lines = proc.stdout.split('\n')
    
    file_ocr = []
    for line in lines:
        if line.startswith("FILE: "):
            parts = line.split("=>")
            if len(parts) >= 2:
                file_name = parts[0].replace("FILE:", "").strip()
                text = "=>".join(parts[1:]).strip()
                file_ocr.append((file_name, clean_text(text)))
    
    file_ocr.sort(key=lambda x: x[0])
    
    if len(file_ocr) < 11:
        print(f"Warning: {folder_prefix} only has {len(file_ocr)} images")
        
    res = {
        "folder": os.path.basename(found_folder),
        "hero_name": None,
        "hero_id": None,
        "win_rate": None,
        "wins": None,
        "items": [],
        "spell": None,
        "arcanas": [],
        "flags": []
    }
    
    full_text = "".join([x[1] for x in file_ocr])
    
    for h in heroes_sorted:
        if h['name'] in full_text:
            res['hero_name'] = h['name']
            res['hero_id'] = h['id']
            break
                
    if not res['hero_name']:
        res['flags'].append("hero_not_found")
        
    wr_match = re.search(r'勝率:?([\d\.]+)%?', full_text)
    win_match = re.search(r'勝利:?(\d+)', full_text)
    
    if wr_match:
        res['win_rate'] = f"{wr_match.group(1)}%"
    if win_match:
        res['wins'] = int(win_match.group(1))
        
    for i in range(1, min(7, len(file_ocr))):
        text = file_ocr[i][1]
        matched = False
        for it in items_sorted:
            if it['name'] in text:
                res['items'].append({"name": it['name'], "id": it['id']})
                matched = True
                break
        if not matched:
            res['flags'].append(f"item_not_found_img{i+1}")
            
    if len(file_ocr) >= 8:
        text = file_ocr[7][1]
        matched = False
        for sp in spells_sorted:
            if sp['name'] in text:
                res['spell'] = {"name": sp['name'], "id": sp['id']}
                matched = True
                break
        if not matched:
            res['flags'].append("spell_not_found")
            
    for i in range(8, min(11, len(file_ocr))):
        text = file_ocr[i][1]
        matched = False
        for arc in arcanas_sorted:
            if arc['name'] in text:
                res['arcanas'].append({"name": arc['name'], "id": arc['id'], "count": 10})
                matched = True
                break
        if not matched:
            res['flags'].append(f"arcana_not_found_img{i+1}")
            
    results.append(res)

with open(os.path.join(scratch_dir, "ocr_extracted_part9.json"), "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("DONE")
