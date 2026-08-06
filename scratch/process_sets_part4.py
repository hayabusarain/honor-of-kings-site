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

# Load heroes
with open('./camp_data.json', 'r', encoding='utf-8') as f:
    camp_data = json.load(f)
heroes_list = camp_data.get('data', {}).get('list', [])
hero_names = {h['heroInfo']['heroName']: h['heroId'] for h in heroes_list if 'heroInfo' in h}

item_names = {item['name']: item['id'] for item in items_data}
arcana_names = [arc['name'] for arc in arcanas_data]
spell_names = [spell['japanese_name'] for spell in spells_data]

def get_best_match(query, choices, threshold=0.4):
    matches = get_close_matches(query, choices, n=1, cutoff=threshold)
    return matches[0] if matches else f"UNKNOWN({query})"

def extract_set(folder_name):
    print(f"Processing {folder_name}")
    folder_path = os.path.join(base_dir, folder_name)
    result = subprocess.run([exe_path, folder_path], capture_output=True, text=True, encoding='utf-8', errors='ignore')
    out = result.stdout
    if not out.strip():
        print(f"ERROR executing {folder_path}: stdout is empty. stderr: {result.stderr}")

    files_data = out.split('FILE: ')
    files_data = [x for x in files_data if x.strip()]
    files_data.sort(key=lambda x: x.split('=>')[0].strip())

    if len(files_data) < 11:
        print(f"Warning: {folder_name} has {len(files_data)} files, expected 11")

    hero_name = "UNMATCHED_HERO"
    hero_id = None
    win_rate = "UNMATCHED_WINRATE"
    victories = "UNMATCHED_VICTORIES"
    items = []
    spell = "UNMATCHED_SPELL"
    arcanas = []

    for i, file_data in enumerate(files_data):
        lines = file_data.split('=>', 1)[1].strip() if '=>' in file_data else ''
        lines = lines.replace(' ', '').replace('　', '')
        m = re.search(r'勝率[:：]?\s*([\d\.]+%?)', lines)
        if m and win_rate == "UNMATCHED_WINRATE": win_rate = m.group(1).replace('%', '') + '%'
        m = re.search(r'勝利[:：]?\s*(\d+)', lines)
        if m and victories == "UNMATCHED_VICTORIES": victories = m.group(1)
        elif '勝' in lines and victories == "UNMATCHED_VICTORIES":
            m2 = re.search(r'(\d+)\s*勝', lines)
            if m2: victories = m2.group(1)
            
        if i == 0:
            # Hero name
            best_hero = None
            for hn in hero_names.keys():
                if hn in lines:
                    best_hero = hn
                    break
            if not best_hero:
                # regex around 【オナーオブキングス】 ... の評価
                mh = re.search(r'】(.*?)[の評価]', lines)
                if mh:
                    hn_cand = mh.group(1).strip()
                    m = get_close_matches(hn_cand, hero_names.keys(), n=1, cutoff=0.3)
                    if m: best_hero = m[0]
            if not best_hero:
                words = [w for w in re.sub(r'[\d+%A-Za-z]+', ' ', lines).split() if len(w) > 1]
                for w in words:
                    m = get_close_matches(w, hero_names.keys(), n=1, cutoff=0.5)
                    if m:
                        best_hero = m[0]
                        break
            if best_hero:
                hero_name = best_hero
                hero_id = hero_names[best_hero]
        elif 1 <= i <= 6:
            best = None
            for it_name in item_names.keys():
                if it_name in lines:
                    best = it_name
                    break
            if not best:
                lines_clean = re.sub(r'[\d+%A-Za-z]+', ' ', lines).strip()
                words = [w for w in lines_clean.split() if len(w) > 1]
                for w in words:
                    m = get_close_matches(w, item_names.keys(), n=1, cutoff=0.5)
                    if m:
                        best = m[0]
                        break
            items.append(item_names[best] if best else f"UNMATCHED_ITEM_{i}")
        elif i == 7:
            best = None
            for sp in spell_names:
                if sp in lines:
                    best = sp
                    break
            if not best:
                lines_clean = re.sub(r'[\d+%A-Za-z]+', ' ', lines).strip()
                words = [w for w in lines_clean.split() if len(w) > 1]
                for w in words:
                    m = get_close_matches(w, spell_names, n=1, cutoff=0.5)
                    if m:
                        best = m[0]
                        break
            spell = best if best else "UNMATCHED_SPELL"
        elif 8 <= i <= 10:
            best = None
            for ar in arcanas_data:
                if ar['name'] in lines:
                    best = ar['name']
                    break
            if not best:
                for ar in arcanas_data:
                    # Strip spaces and symbols from stats for loose matching
                    stat_clean = re.sub(r'[^\w\+]', '', ar.get('stats', ''))
                    line_clean2 = re.sub(r'[^\w\+]', '', lines)
                    if stat_clean and stat_clean in line_clean2:
                        best = ar['name']
                        break
            if not best:
                lines_clean = re.sub(r'[\d+%A-Za-z]+', ' ', lines).strip()
                words = [w for w in lines_clean.split() if len(w) > 1]
                for w in words:
                    m = get_close_matches(w, arcana_names, n=1, cutoff=0.5)
                    if m:
                        best = m[0]
                        break
            arcanas.append({"name": best if best else f"UNMATCHED_ARCANA_{i}", "count": 10})

    return {
        "folder": folder_name,
        "hero_name": hero_name,
        "hero_id": hero_id,
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
            if 34 <= num <= 44:
                res = extract_set(folder)
                results.append(res)
        except Exception as e:
            print("Error parsing", folder, e)

with open('./scratch/ocr_extracted_part4.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Done processing sets 034 to 044.")
