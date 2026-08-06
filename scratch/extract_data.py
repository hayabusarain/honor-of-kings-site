import os
import json
import re
import difflib
import sys

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r'C:\Users\81901\Pictures\Screenshots'
data_dir = r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data'

with open(os.path.join(data_dir, 'hok_items.json'), 'r', encoding='utf-8') as f:
    items = json.load(f)
with open(os.path.join(data_dir, 'hok_arcanas.json'), 'r', encoding='utf-8') as f:
    arcanas = json.load(f)
with open(os.path.join(data_dir, 'hok_spells.json'), 'r', encoding='utf-8') as f:
    spells = json.load(f)
with open(os.path.join(data_dir, 'hok_heroes.json'), 'r', encoding='utf-8') as f:
    heroes = json.load(f)

item_names = {}
for item in items:
    if 'nameJa' in item: item_names[item['nameJa']] = item['id']
    if 'name' in item: item_names[item['name']] = item['id']
    if 'aliases' in item:
        for a in item['aliases']: item_names[a] = item['id']

arcana_names = {a['name']: a['id'] for a in arcanas}
spell_names = {s['japanese_name']: s['english_name'] for s in spells}
hero_names = {h['name']: h['id'] for h in heroes}
if 'search_alias' in heroes[0]:
    for h in heroes:
        if h.get('search_alias'):
            for a in h['search_alias'].split(','):
                hero_names[a.strip()] = h['id']

results = []

for num in range(12, 23):
    folder_prefix = f'Set_{num:03d}'
    txt_file = None
    for f in os.listdir(base_dir):
        if f.startswith(folder_prefix) and f.endswith('_ocr.txt'):
            txt_file = f
            break
    
    if not txt_file:
        print(f"Skipping {folder_prefix}, txt not found")
        continue

    with open(os.path.join(base_dir, txt_file), 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = content.split('FILE: ')
    blocks = [b for b in blocks if b.strip()]
    
    hero_id = "UNKNOWN"
    hero_name = "UNKNOWN"
    win_rate = "UNKNOWN"
    victories = "UNKNOWN"
    
    all_items = []
    all_spells = []
    all_arcanas = []
    
    # Sort dictionaries by length descending to match longest first
    sorted_items = sorted(item_names.keys(), key=len, reverse=True)
    sorted_spells = sorted(spell_names.keys(), key=len, reverse=True)
    sorted_arcanas = sorted(arcana_names.keys(), key=len, reverse=True)

    for idx, block in enumerate(blocks):
        text = block.split('=>', 1)[-1].replace('\n', ' ').strip()
        text_no_spaces = text.replace(' ', '')
        
        if idx == 0:
            wr_match = re.search(r'勝率[:：\s]*([\d\.]+)%', text_no_spaces)
            if wr_match: win_rate = wr_match.group(1) + '%'
            v_match = re.search(r'勝利(?:数)?[:：\s]*(\d+)', text_no_spaces)
            if v_match: victories = v_match.group(1)
            
            best_hero = None
            for h_name in sorted(hero_names.keys(), key=len, reverse=True):
                if len(h_name) > 1 and h_name in text_no_spaces:
                    best_hero = h_name
                    break
            
            if best_hero:
                hero_name = best_hero
                hero_id = hero_names[best_hero]
        else:
            # We are in items, spell, or arcanas
            # Try to find exactly what it is based on screenshot index if 11 images
            if len(blocks) == 11 or len(blocks) == 12: # sometimes 12
                # For items (typically block 1 to 6)
                best_item = None
                for i_name in sorted_items:
                    if len(i_name) > 1 and i_name.replace(' ', '') in text_no_spaces:
                        best_item = i_name
                        break
                
                # For spells (typically block 7)
                best_spell = None
                for s_name in sorted_spells:
                    if len(s_name) > 1 and s_name.replace(' ', '') in text_no_spaces:
                        best_spell = s_name
                        break
                        
                # For arcanas (typically block 8 to 10)
                best_arcana = None
                for a_name in sorted_arcanas:
                    if len(a_name) > 1 and a_name.replace(' ', '') in text_no_spaces:
                        best_arcana = a_name
                        break
                
                if 1 <= idx <= 6:
                    if best_item:
                        all_items.append(item_names[best_item])
                    else:
                        all_items.append("UNMATCHED")
                elif idx == 7:
                    if best_spell:
                        all_spells.append(spell_names[best_spell])
                    else:
                        if best_item: # sometimes OCR shifted
                            all_spells.append("UNMATCHED")
                        else:
                            all_spells.append("UNMATCHED")
                elif 8 <= idx <= 11:
                    if best_arcana:
                        all_arcanas.append({"id": arcana_names[best_arcana], "count": 10})
                    else:
                        all_arcanas.append({"id": "UNMATCHED", "count": 10})

    results.append({
        "set": folder_prefix,
        "hero_id": hero_id,
        "hero_name": hero_name,
        "win_rate": win_rate,
        "victories": victories,
        "items": all_items[:6] if all_items else ["UNMATCHED"]*6,
        "spell": all_spells[0] if all_spells else "UNMATCHED",
        "arcanas": all_arcanas[:3] if all_arcanas else [{"id": "UNMATCHED", "count": 10}]*3
    })

out_path = r'C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_extracted_part2.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Saved to", out_path)
