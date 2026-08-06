import os
import json
import re
import subprocess
import codecs

base_dir = r'C:\Users\81901\Pictures\Screenshots'
exe_path = r'C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_folder.exe'
data_dir = r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data'

# Load JSONs
def load_json(name):
    with codecs.open(os.path.join(data_dir, name), 'r', 'utf-8') as f:
        return json.load(f)

heroes_data = load_json('hok_heroes.json')
items_data = load_json('hok_items.json')
spells_data = load_json('hok_spells.json')
arcanas_data = load_json('hok_arcanas.json')

def normalize(text):
    if text is None: return ""
    return text.replace(' ', '').replace('　', '').replace('・', '')

# Create dictionaries mapping normalized names/aliases to IDs/Names
heroes_map = {}
for h in heroes_data:
    heroes_map[normalize(h.get('nameJa', h.get('name', '')))] = h
    for alias in h.get('aliases', []):
        heroes_map[normalize(alias)] = h

items_map = {}
for item in items_data:
    items_map[normalize(item.get('nameJa', item.get('name', '')))] = item
    for alias in item.get('aliases', []):
        items_map[normalize(alias)] = item

spells_map = {}
for spell in spells_data:
    spells_map[normalize(spell.get('nameJa', spell.get('name', '')))] = spell
    for alias in spell.get('aliases', []):
        spells_map[normalize(alias)] = spell

arcanas_map = {}
for arc in arcanas_data:
    arcanas_map[normalize(arc.get('nameJa', arc.get('name', '')))] = arc
    for alias in arc.get('aliases', []):
        arcanas_map[normalize(alias)] = arc

def find_match(text, target_map):
    norm_text = normalize(text)
    # Sort keys by length descending to match longest possible string
    for k in sorted(target_map.keys(), key=len, reverse=True):
        if k and k in norm_text:
            return target_map[k]
    return None

results = []
for folder in sorted(os.listdir(base_dir)):
    if folder.startswith('Set_'):
        try:
            num_str = folder.split('_')[1]
            num = int(num_str)
            if 23 <= num <= 33:
                folder_path = os.path.join(base_dir, folder)
                print(f'Processing {folder}...')
                
                # Run OCR
                proc = subprocess.run([exe_path, folder_path], capture_output=True)
                # Decode output
                out_text = proc.stdout.decode('utf-8', errors='ignore')
                
                lines = out_text.strip().split('\n')
                lines = [l.strip() for l in lines if l.strip()]
                
                if len(lines) < 11:
                    print(f"Warning: {folder} has only {len(lines)} lines")
                    continue
                
                # Parse hero (from line 1 or any line if not found)
                hero = find_match(lines[0], heroes_map)
                if not hero:
                    # try finding in other lines just in case
                    hero = find_match(out_text, heroes_map)
                
                # Parse win rate and victories from the whole text
                win_rate = 0.0
                victories = 0
                wr_match = re.search(r'勝率\s*[:：]\s*([\d\.]+)', out_text)
                if wr_match:
                    win_rate = float(wr_match.group(1))
                vic_match = re.search(r'勝利\s*[:：]\s*(\d+)', out_text)
                if vic_match:
                    victories = int(vic_match.group(1))
                
                # Items
                items = []
                for i in range(1, 7):
                    if i < len(lines):
                        item = find_match(lines[i], items_map)
                        if item:
                            items.append(item['id'])
                        else:
                            print(f"[{folder}] Item not matched: {lines[i]}")
                            items.append(None)
                
                # Spell
                spell_id = None
                if 7 < len(lines):
                    spell = find_match(lines[7], spells_map)
                    if spell:
                        spell_id = spell['id']
                    else:
                        print(f"[{folder}] Spell not matched: {lines[7]}")
                
                # Arcanas
                arcanas = []
                for i in range(8, 11):
                    if i < len(lines):
                        arc = find_match(lines[i], arcanas_map)
                        if arc:
                            arcanas.append({"id": arc['id'], "count": 10})
                        else:
                            print(f"[{folder}] Arcana not matched: {lines[i]}")
                            arcanas.append({"id": None, "count": 10})
                
                results.append({
                    "folder": folder,
                    "heroId": hero['id'] if hero else None,
                    "winRate": win_rate,
                    "victories": victories,
                    "items": items,
                    "spell": spell_id,
                    "arcanas": arcanas
                })
        except Exception as e:
            print(f"Error processing {folder}: {e}")

out_path = r'C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_extracted_part3.json'
with codecs.open(out_path, 'w', 'utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("Saved to", out_path)
