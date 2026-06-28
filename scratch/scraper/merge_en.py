import os
import json

base_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト"
en_path = os.path.join(base_dir, "public/data/skills/en.json")
with open(en_path, "r", encoding="utf-8") as f:
    en_data = json.load(f)

for i in range(1, 11):
    output_path = os.path.join(base_dir, f"scratch/scraper/en_outputs/en_output_{i}.json")
    if not os.path.exists(output_path):
        continue
    
    with open(output_path, "r", encoding="utf-8") as f:
        new_strategies = json.load(f)
        
    for hero_id, new_strategy in new_strategies.items():
        if hero_id in en_data:
            # Strip old playstyle if it exists
            if "playstyle" in en_data[hero_id]:
                del en_data[hero_id]["playstyle"]
            en_data[hero_id]["strategy"] = new_strategy

with open(en_path, "w", encoding="utf-8") as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Merged all English strategies into en.json successfully.")
