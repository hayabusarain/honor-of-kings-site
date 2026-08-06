import os
import json
import subprocess
import re
import difflib

# Directories
base_dir = r"C:\Users\81901\Pictures\Screenshots"
data_dir = r"C:\Users\81901\Desktop\オナーオブキングスサイト\src\data"
out_path = r"C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_extracted_part10.json"
ocr_exe = r"C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_folder.exe"

# Load JSONs
def load_json(filename):
    with open(os.path.join(data_dir, filename), 'r', encoding='utf-8') as f:
        return json.load(f)

items_data = load_json("hok_items.json")
spells_data = load_json("hok_spells.json")
arcanas_data = load_json("hok_arcanas.json")
heroes_data = load_json("hok_heroes.json")

def find_best_match(ocr_text, data_list, name_keys):
    # exact substring match priority
    for item in data_list:
        for k in name_keys:
            val = item.get(k)
            if val and isinstance(val, str) and val in ocr_text:
                return item
            if val and isinstance(val, list):
                for v in val:
                    if v in ocr_text:
                        return item
    
    # fuzzy match
    words = ocr_text.split()
    all_names = {}
    for item in data_list:
        for k in name_keys:
            val = item.get(k)
            if val and isinstance(val, str):
                all_names[val] = item
            if val and isinstance(val, list):
                for v in val:
                    all_names[v] = item
                    
    for w in words:
        matches = difflib.get_close_matches(w, all_names.keys(), n=1, cutoff=0.7)
        if matches:
            return all_names[matches[0]]
            
    # longer substring match
    for name in all_names.keys():
        if name in ocr_text.replace(" ", ""):
            return all_names[name]
            
    return None

results = []

for i in range(100, 114):
    prefix = f"Set_{i}_"
    folder_name = next((d for d in os.listdir(base_dir) if d.startswith(prefix)), None)
    if not folder_name:
        continue
        
    folder_path = os.path.join(base_dir, folder_name)
    proc = subprocess.run([ocr_exe, folder_path], capture_output=True, text=False)
    
    # decode stdout
    try:
        stdout = proc.stdout.decode('utf-8')
    except:
        stdout = proc.stdout.decode('shift-jis', errors='ignore')
        
    lines = stdout.splitlines()
    
    set_data = {
        "folder": folder_name,
        "hero_id": None,
        "hero_name": None,
        "win_rate": None,
        "victories": None,
        "items": [],
        "spell": None,
        "arcanas": []
    }
    
    # group by image
    images_text = []
    for line in lines:
        if line.startswith("FILE:"):
            parts = line.split("=>", 1)
            if len(parts) == 2:
                images_text.append(parts[1].strip())
                
    if len(images_text) < 11:
        print(f"Warning: {folder_name} has only {len(images_text)} images.")
        
    for idx, text in enumerate(images_text):
        if idx == 0:
            # Hero / Winrate / Victories
            hero = find_best_match(text, heroes_data, ["nameEn", "nameJa", "name"])
            if hero:
                set_data["hero_id"] = hero.get("id")
                set_data["hero_name"] = hero.get("nameJa") or hero.get("name")
            else:
                set_data["hero_name"] = "FLAG_HERO_NOT_FOUND"
                
            m_win = re.search(r"(\d{1,3}(?:\.\d+)?)\s*%", text)
            if m_win:
                set_data["win_rate"] = m_win.group(1) + "%"
                
            m_vic = re.search(r"(?:使用回数|回数)\s*[:：]?\s*(\d+)", text)
            if not m_vic:
                m_vic = re.search(r"(\d+)\s*(?:回|場)", text)
            if m_vic:
                set_data["victories"] = m_vic.group(1)
                
        elif 1 <= idx <= 6:
            # Items
            item = find_best_match(text, items_data, ["nameJa", "name", "name_en", "aliases"])
            if item:
                set_data["items"].append(item.get("id"))
            else:
                set_data["items"].append(f"FLAG_ITEM_NOT_FOUND_IMG_{idx+1}")
                
        elif idx == 7:
            # Spell
            spell = find_best_match(text, spells_data, ["nameJa", "name", "name_en", "aliases"])
            if spell:
                set_data["spell"] = spell.get("id")
            else:
                set_data["spell"] = "FLAG_SPELL_NOT_FOUND"
                
        elif 8 <= idx <= 10:
            # Arcanas
            arcana = find_best_match(text, arcanas_data, ["nameJa", "name", "name_en", "aliases"])
            if arcana:
                set_data["arcanas"].append({
                    "id": arcana.get("id"),
                    "count": 10
                })
            else:
                set_data["arcanas"].append({
                    "id": f"FLAG_ARCANA_NOT_FOUND_IMG_{idx+1}",
                    "count": 10
                })

    results.append(set_data)
    print(f"Processed {folder_name} - Hero: {set_data['hero_name']}")

with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Extraction complete. Saved to {out_path}")
