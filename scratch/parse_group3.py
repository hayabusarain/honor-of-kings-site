import json
import base64
import requests
import google.auth
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import os
import glob
import re
import time
from difflib import SequenceMatcher

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

# Load items
with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)
item_names = {item['name']: item['id'] for item in items}
item_names_en = {item['name_en'].lower() if item.get('name_en') else "": item['id'] for item in items}

def get_item_id(name):
    if not name: return None
    # exact match
    if name in item_names:
        return item_names[name]
    # lowercase en match
    if name.lower() in item_names_en:
        return item_names_en[name.lower()]
    # fuzzy match
    best_match = None
    best_score = 0
    for k, v in item_names.items():
        score = similar(name, k)
        if score > best_score:
            best_score = score
            best_match = v
    for k, v in item_names_en.items():
        score = similar(name.lower(), k)
        if score > best_score:
            best_score = score
            best_match = v
    if best_score > 0.4:
        return best_match
    return name

def get_access_token():
    creds = service_account.Credentials.from_service_account_file(
        'key.json',
        scopes=['https://www.googleapis.com/auth/cloud-platform']
    )
    creds.refresh(Request())
    return creds.token

def parse_images(images, token):
    url = "https://us-central1-aiplatform.googleapis.com/v1/projects/gen-lang-client-0899050472/locations/us-central1/publishers/google/models/gemini-1.5-pro-001:generateContent"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    parts = [{"text": '''
    These images are screenshots from a game in Japanese. Some screenshots show the hero name (usually at the top left, large font). Others show the popular builds for that hero (has item icons, arcanas, summoner spells, wins, and win rate percentages).
    Extract the following from these screenshots. 
    Group the hero name with their corresponding builds.
    For each hero, extract:
    - Hero Name
    - Popular Build 1: 6 item names (string), Arcanas (string, e.g., '10x 異変, 10x 鷹眼, 10x 狩猟'), Summoner Spell (string), Wins (number), Win Rate (string, e.g., '55.5%')
    - Popular Build 2: 6 item names (string), Arcanas (string), Summoner Spell (string), Wins (number), Win Rate (string)
    
    Return ONLY JSON with this exact format:
    [
      {
        "Hero Name": "Name",
        "Build 1": {
           "Items": ["Item1", "Item2", "Item3", "Item4", "Item5", "Item6"],
           "Arcanas": "...",
           "Spell": "...",
           "Wins": "...",
           "Win Rate": "..."
        },
        "Build 2": {
           "Items": ["Item1", "Item2", "Item3", "Item4", "Item5", "Item6"],
           "Arcanas": "...",
           "Spell": "...",
           "Wins": "...",
           "Win Rate": "..."
        }
      }
    ]
    '''}]
    
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
        print("Error:", resp.text)
        return None
    try:
        return json.loads(resp.json()['candidates'][0]['content']['parts'][0]['text'])
    except Exception as e:
        print("Parse error:", e, resp.text)
        return None

def main():
    token = get_access_token()
    
    img_dir = r"C:\Users\81901\Pictures\Screenshots"
    all_imgs = []
    for i in range(3576, 3653):
        path = os.path.join(img_dir, f"スクリーンショット ({i}).png")
        if os.path.exists(path):
            all_imgs.append(path)
            
    print(f"Found {len(all_imgs)} images.")
    
    # Process in chunks of 10 images
    chunk_size = 10
    results = []
    
    for i in range(0, len(all_imgs), chunk_size):
        chunk = all_imgs[i:i+chunk_size]
        print(f"Processing chunk {i//chunk_size + 1}/{len(all_imgs)//chunk_size + 1}...")
        parsed = parse_images(chunk, token)
        if parsed:
            results.extend(parsed)
        time.sleep(2)
        
    # Try to deduplicate if the same hero spans chunks
    hero_dict = {}
    for hero in results:
        name = hero.get("Hero Name")
        if not name: continue
        if name not in hero_dict:
            hero_dict[name] = hero
        else:
            # Merge
            if not hero_dict[name].get("Build 1") and hero.get("Build 1"):
                hero_dict[name]["Build 1"] = hero["Build 1"]
            if not hero_dict[name].get("Build 2") and hero.get("Build 2"):
                hero_dict[name]["Build 2"] = hero["Build 2"]

    final_output = []
    for hname, hero_data in hero_dict.items():
        for b in ["Build 1", "Build 2"]:
            if b in hero_data and "Items" in hero_data[b]:
                items_mapped = []
                for item in hero_data[b]["Items"]:
                    items_mapped.append(get_item_id(item))
                hero_data[b]["Items"] = items_mapped
        final_output.append(hero_data)
        
    with open('camp_data.json', 'r', encoding='utf-8') as f:
        camp = json.load(f)
    hero_map = {h['heroName']: h['heroId'] for h in camp}
    for hero in final_output:
        hname = hero.get("Hero Name", "")
        best_score = 0
        best_id = None
        for k, v in hero_map.items():
            score = similar(hname, k)
            if score > best_score:
                best_score = score
                best_id = v
        hero["Hero ID"] = best_id if best_score > 0.4 else None

    with open('scratch/screenshots_parsed_group3.json', 'w', encoding='utf-8') as f:
        json.dump(final_output, f, ensure_ascii=False, indent=2)
        
    print("Saved to scratch/screenshots_parsed_group3.json")

if __name__ == "__main__":
    main()
