import os
import json
import re
import subprocess

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

items = load_json(r"C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_items.json")
spells = load_json(r"C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_spells.json")
arcanas = load_json(r"C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_arcanas.json")
heroes = load_json(r"C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_heroes.json")

def normalize_text(t):
    return re.sub(r'\s+', '', t)

def find_match(text, candidates):
    norm_text = normalize_text(text)
    for c in sorted(candidates, key=len, reverse=True):
        if c in norm_text:
            return c
    return None

item_names = {item.get('nameJa', item.get('name', '')): item['id'] for item in items}
spell_names = {spell.get('japanese_name', spell.get('name', '')): spell['id'] for spell in spells}
arcana_names = {arcana.get('name', ''): arcana['id'] for arcana in arcanas}
hero_names = {hero.get('japanese_name', hero.get('name', '')): hero.get('id', '') for hero in heroes}

def extract_all():
    base_dir = r"C:\Users\81901\Pictures\Screenshots"
    exe_path = r"C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_folder.exe"
    
    out_data = []
    
    for i in range(78, 89):
        folder_prefix = f"Set_{i:03d}"
        folder_name = next((f for f in os.listdir(base_dir) if f.startswith(folder_prefix) and os.path.isdir(os.path.join(base_dir, f))), None)
        if not folder_name:
            print(f"Folder for {folder_prefix} not found.")
            continue
            
        folder_path = os.path.join(base_dir, folder_name)
        print(f"Processing {folder_name}...")
        result = subprocess.run([exe_path, folder_path], capture_output=True, text=True, encoding='utf-8', errors='ignore')
        out = result.stdout
        
        files_data = []
        current_file = None
        current_text = []
        
        for line in out.splitlines():
            if line.startswith("FILE:"):
                if current_file:
                    files_data.append((current_file, '\n'.join(current_text)))
                parts = line.split("=>", 1)
                current_file = parts[0].replace("FILE:", "").strip()
                current_text = [parts[1]] if len(parts) > 1 else []
            else:
                current_text.append(line)
        if current_file:
            files_data.append((current_file, '\n'.join(current_text)))
            
        if len(files_data) != 11:
            print(f"Warning: {folder_name} has {len(files_data)} files instead of 11.")
            continue
            
        text1 = normalize_text(files_data[0][1])
        hero_match = find_match(text1, list(hero_names.keys()))
        hero_id = hero_names[hero_match] if hero_match else "UNKNOWN_HERO_ID"
        hero_name = hero_match if hero_match else "UNKNOWN_HERO"
        
        win_rate = "UNKNOWN"
        m_win = re.search(r'勝率:([\d\.]+%)', text1)
        if m_win:
            win_rate = m_win.group(1)
            
        victories = "UNKNOWN"
        m_vic = re.search(r'勝利:(\d+)', text1)
        if m_vic:
            victories = m_vic.group(1)
            
        items_extracted = []
        for j in range(1, 7):
            text_item = normalize_text(files_data[j][1])
            item_match = find_match(text_item, list(item_names.keys()))
            items_extracted.append({
                "name": item_match if item_match else "UNKNOWN_ITEM",
                "id": item_names[item_match] if item_match else "UNKNOWN_ITEM_ID"
            })
            
        text_spell = normalize_text(files_data[7][1])
        spell_match = find_match(text_spell, list(spell_names.keys()))
        spell_extracted = {
            "name": spell_match if spell_match else "UNKNOWN_SPELL",
            "id": spell_names[spell_match] if spell_match else "UNKNOWN_SPELL_ID"
        }
        
        arcanas_extracted = []
        for j in range(8, 11):
            text_arcana = normalize_text(files_data[j][1])
            arcana_match = find_match(text_arcana, list(arcana_names.keys()))
            arcanas_extracted.append({
                "name": arcana_match if arcana_match else "UNKNOWN_ARCANA",
                "id": arcana_names[arcana_match] if arcana_match else "UNKNOWN_ARCANA_ID",
                "count": 10
            })
            
        out_data.append({
            "set_folder": folder_name,
            "hero_name": hero_name,
            "hero_id": hero_id,
            "win_rate": win_rate,
            "victories": victories,
            "items": items_extracted,
            "spell": spell_extracted,
            "arcanas": arcanas_extracted
        })
        
    out_file = r"C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_extracted_part8.json"
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(out_data, f, ensure_ascii=False, indent=2)
    print("Done! Saved to", out_file)

if __name__ == "__main__":
    extract_all()
