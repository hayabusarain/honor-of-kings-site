import json
import base64
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import os
import glob
from difflib import SequenceMatcher

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

# Load data
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)
item_names = {item['name']: item['id'] for item in items}
item_names_en = {item['name_en'].lower() if item.get('name_en') else "": item['id'] for item in items}

with open('src/data/hok_arcanas.json', 'r', encoding='utf-8') as f:
    arcanas = json.load(f)
arcana_names = {a['name']: a['id'] for a in arcanas}
arcana_names_en = {a['name_en'].lower() if a.get('name_en') else "": a['id'] for a in arcanas}

with open('src/data/hok_spells.json', 'r', encoding='utf-8') as f:
    spells = json.load(f)
spell_names = {s['japanese_name']: s['id'] for s in spells}
spell_names_en = {s['english_name'].lower(): s['id'] for s in spells}

with open('camp_data.json', 'r', encoding='utf-8') as f:
    camp = json.load(f)
hero_map = {h['heroInfo']['heroName']: h['heroId'] for h in camp.get('data', {}).get('list', [])}

def get_id(name, name_map, name_en_map):
    if not name: return None
    if name in name_map:
        return name_map[name]
    if name.lower() in name_en_map:
        return name_en_map[name.lower()]
    best_match = None
    best_score = 0
    for k, v in name_map.items():
        score = similar(name, k)
        if score > best_score:
            best_score = score
            best_match = v
    if best_score > 0.4:
        return best_match
    return f"UNMATCHED: {name}"

def get_access_token():
    creds = service_account.Credentials.from_service_account_file(
        'key.json',
        scopes=['https://www.googleapis.com/auth/cloud-platform']
    )
    creds.refresh(Request())
    return creds.token

def parse_set(images, token, set_name):
    url = "https://us-central1-aiplatform.googleapis.com/v1/projects/gen-lang-client-0899050472/locations/us-central1/publishers/google/models/gemini-1.5-pro-001:generateContent"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    prompt = '''
    These 11 images represent a single recommended hero build set.
    Image 1: Hero stats. Extract Hero Name, Win Rate (percentage), and Victories (number).
    Images 2-7: Recommended Items. Extract exactly 6 item names in Japanese.
    Image 8: Summoner Spell. Extract 1 spell name in Japanese.
    Images 9-11: Arcanas. Extract exactly 3 arcana names in Japanese.
    
    Return JSON format:
    {
       "Hero Name": "...",
       "Win Rate": "...",
       "Victories": "...",
       "Items": ["...", "...", "...", "...", "...", "..."],
       "Spell": "...",
       "Arcanas": ["...", "...", "..."]
    }
    '''
    
    parts = [{"text": prompt}]
    for img_path in images:
        with open(img_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode('utf-8')
        parts.append({"inlineData": {"mimeType": "image/png", "data": b64}})
        
    payload = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {"temperature": 0.0, "responseMimeType": "application/json"}
    }
    
    resp = requests.post(url, headers=headers, json=payload)
    if resp.status_code != 200:
        print(f"Error on {set_name}:", resp.text)
        return None
    try:
        return json.loads(resp.json()['candidates'][0]['content']['parts'][0]['text'])
    except Exception as e:
        print(f"Parse error on {set_name}:", e, resp.text)
        return None

def main():
    token = get_access_token()
    base_dir = r"C:\Users\81901\Pictures\Screenshots"
    
    results = []
    
    for i in range(34, 45):
        pattern = os.path.join(base_dir, f"Set_{i:03d}_*")
        dirs = glob.glob(pattern)
        if not dirs:
            continue
        d = dirs[0]
        set_name = os.path.basename(d)
        
        images = sorted(glob.glob(os.path.join(d, "*.png")))
        if len(images) != 11:
            print(f"Warning: {set_name} has {len(images)} images instead of 11.")
            continue
            
        print(f"Processing {set_name}...")
        parsed = parse_set(images, token, set_name)
        if not parsed:
            continue
            
        hero_name = parsed.get("Hero Name", "")
        best_id = None
        best_score = 0
        for k, v in hero_map.items():
            score = similar(hero_name, k)
            if score > best_score:
                best_score = score
                best_id = v
        parsed["Hero ID"] = best_id if best_score > 0.4 else f"UNMATCHED: {hero_name}"
        
        parsed["Items_Mapped"] = [get_id(it, item_names, item_names_en) for it in parsed.get("Items", [])]
        parsed["Spell_Mapped"] = get_id(parsed.get("Spell", ""), spell_names, spell_names_en)
        parsed["Arcanas_Mapped"] = [get_id(a, arcana_names, arcana_names_en) for a in parsed.get("Arcanas", [])]
        
        parsed["Set_Folder"] = set_name
        results.append(parsed)
        
    out_path = 'scratch/ocr_extracted_part4.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
        
    print(f"Done! Saved to {out_path}")

if __name__ == "__main__":
    main()
