import os
import subprocess
import json
import re
from difflib import get_close_matches

base_dir = r'C:\Users\81901\Pictures\Screenshots'
exe_path = './scratch/ocr_folder.exe'
data_dir = './src/data'

with open(os.path.join(data_dir, 'hok_items.json'), 'r', encoding='utf-8') as f:
    items_data = json.load(f)
with open(os.path.join(data_dir, 'hok_arcanas.json'), 'r', encoding='utf-8') as f:
    arcanas_data = json.load(f)
with open(os.path.join(data_dir, 'hok_spells.json'), 'r', encoding='utf-8') as f:
    spells_data = json.load(f)

item_names = {item['name']: item['id'] for item in items_data}
arcana_names = [arc['name'] for arc in arcanas_data]
spell_names = [spell['japanese_name'] for spell in spells_data]

def get_best_match(query, choices, threshold=0.3):
    matches = get_close_matches(query, choices, n=1, cutoff=threshold)
    return matches[0] if matches else None

def extract_set(folder_name):
    print(f"Processing {folder_name}")
    folder_path = os.path.join(base_dir, folder_name)
    result = subprocess.run([exe_path, folder_path], capture_output=True, text=True, encoding='utf-8', errors='ignore')
    out = result.stdout

    files_data = out.split('FILE: ')
    files_data = [x for x in files_data if x.strip()]

    # Sort files by name so screenshot 1 is first, 11 is last
    files_data.sort(key=lambda x: x.split('=>')[0].strip())

    if len(files_data) < 11:
        print(f"Warning: {folder_name} has {len(files_data)} files, expected 11")

    win_rate = ""
    victories = ""
    items = []
    spell = ""
    arcanas = []

    for i, file_data in enumerate(files_data):
        lines = file_data.split('=>', 1)[1].strip() if '=>' in file_data else ''
        lines_no_space = lines.replace(' ', '').replace('　', '')
        
        if i == 0:
            m = re.search(r'勝率[:：]?\s*([\d\.]+%?)', lines_no_space)
            if m:
                win_rate = m.group(1).replace('%', '') + '%'
            else:
                win_rate = "UNKNOWN_WINRATE"
                
            m = re.search(r'勝利[:：]?\s*(\d+)', lines_no_space)
            if m:
                victories = m.group(1)
            else:
                victories = "UNKNOWN_VICTORIES"
        elif 1 <= i <= 6:
            best = None
            # Find item name directly if it exists in the string without spaces
            for it_name in item_names.keys():
                if it_name in lines_no_space:
                    best = it_name
                    break
            if not best:
                lines_clean = re.sub(r'[\d+%A-Za-z]+', '', lines_no_space)
                if len(lines_clean) > 0:
                    for l in [lines_clean[j:j+5] for j in range(len(lines_clean)-4)] + [lines_clean]:
                        best = get_best_match(l, list(item_names.keys()), 0.3)
                        if best: break

            items.append(item_names[best] if best else f"UNKNOWN_ITEM_{i}")
        elif i == 7:
            best = None
            for sp in spell_names:
                if sp in lines_no_space:
                    best = sp
                    break
            if not best:
                lines_clean = re.sub(r'[\d+%A-Za-z]+', '', lines_no_space)
                if len(lines_clean) > 0:
                    best = get_best_match(lines_clean, spell_names, 0.3)
            spell = best if best else "UNKNOWN_SPELL"
        elif 8 <= i <= 10:
            best = None
            for ar in arcana_names:
                if ar in lines_no_space:
                    best = ar
                    break
            if not best:
                lines_clean = re.sub(r'[\d+%A-Za-z]+', '', lines_no_space)
                if len(lines_clean) > 0:
                    best = get_best_match(lines_clean, arcana_names, 0.3)
            arcanas.append({"name": best if best else f"UNKNOWN_ARCANA_{i}", "count": 10})

    return {
        "folder": folder_name,
        "win_rate": win_rate,
        "victories": victories,
        "items": items,
        "spell": spell,
        "arcanas": arcanas
    }

results = []
for folder in sorted(os.listdir(base_dir)):
    if folder.startswith('Set_'):
        try:
            num = int(folder.split('_')[1])
            if 45 <= num <= 55:
                res = extract_set(folder)
                results.append(res)
        except Exception as e:
            pass

with open('./scratch/ocr_extracted_part5.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Done processing sets 045 to 055.")
