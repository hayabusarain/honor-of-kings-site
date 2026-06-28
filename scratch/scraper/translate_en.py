import os
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from deep_translator import GoogleTranslator

base_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills"
ja_path = os.path.join(base_dir, "ja.json")
en_path = os.path.join(base_dir, "en.json")

with open(ja_path, "r", encoding="utf-8") as f:
    ja_data = json.load(f)

with open(en_path, "r", encoding="utf-8") as f:
    en_data = json.load(f)

translator = GoogleTranslator(source='ja', target='en')

def translate_hero(hero_id, hero_data):
    if "strategy" not in hero_data:
        return hero_id, None
    
    en_strategy = {}
    # Translate strategy fields
    for key, text in hero_data["strategy"].items():
        if text:
            try:
                en_strategy[key] = translator.translate(text)
            except Exception:
                time.sleep(1)
                try:
                    en_strategy[key] = translator.translate(text)
                except:
                    en_strategy[key] = text
        else:
            en_strategy[key] = ""
            
    # Translate strengths/weaknesses
    en_strengths = []
    for s in hero_data.get("strengths", []):
        if s:
            try:
                en_strengths.append(translator.translate(s))
            except:
                en_strengths.append(s)
                
    en_weaknesses = []
    for w in hero_data.get("weaknesses", []):
        if w:
            try:
                en_weaknesses.append(translator.translate(w))
            except:
                en_weaknesses.append(w)
                
    return hero_id, {
        "strategy": en_strategy,
        "strengths": en_strengths,
        "weaknesses": en_weaknesses
    }

print("Translating strategies for en.json...")
updates = 0
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = {executor.submit(translate_hero, h_id, h_data): h_id for h_id, h_data in ja_data.items()}
    
    for i, future in enumerate(as_completed(futures)):
        hero_id, result = future.result()
        if result and hero_id in en_data:
            en_data[hero_id]["strategy"] = result["strategy"]
            en_data[hero_id]["strengths"] = result["strengths"]
            en_data[hero_id]["weaknesses"] = result["weaknesses"]
            
            if "playstyle" in en_data[hero_id].get("strategy", {}):
                del en_data[hero_id]["strategy"]["playstyle"]
            updates += 1
        
        if (i + 1) % 10 == 0:
            print(f"Translated {i + 1} / {len(ja_data)} heroes...")

with open(en_path, "w", encoding="utf-8") as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print(f"Successfully updated en.json with {updates} translated strategies.")
