import os
import json

base_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills"
chunks_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/outputs"

ja_path = os.path.join(base_dir, "ja.json")
with open(ja_path, "r", encoding="utf-8") as f:
    ja_data = json.load(f)

for i in range(1, 11):
    chunk_file = os.path.join(chunks_dir, f"output_{i}.json")
    if os.path.exists(chunk_file):
        with open(chunk_file, "r", encoding="utf-8") as f:
            chunk_data = json.load(f)
            
            for hero_id, new_strategy in chunk_data.items():
                if hero_id in ja_data:
                    # Map the fields back to ja.json format
                    # Strategy
                    ja_data[hero_id]["strategy"] = {
                        "earlyGame": new_strategy.get("earlyGame", ""),
                        "midGame": new_strategy.get("midGame", ""),
                        "lateGame": new_strategy.get("lateGame", ""),
                        "teamfight": new_strategy.get("teamfight", ""),
                        "commonMistakes": new_strategy.get("commonMistakes", "")
                    }
                    
                    # Ensure strengths/weaknesses exist inside strategy or at root
                    # Previously they were at root
                    ja_data[hero_id]["strengths"] = [new_strategy.get("strengths", "")]
                    ja_data[hero_id]["weaknesses"] = [new_strategy.get("weaknesses", "")]
                    
                    # Remove the old playstyle field if it exists
                    if "playstyle" in ja_data[hero_id].get("strategy", {}):
                        del ja_data[hero_id]["strategy"]["playstyle"]

with open(ja_path, "w", encoding="utf-8") as f:
    json.dump(ja_data, f, ensure_ascii=False, indent=2)

print("Merged all new strategies into ja.json successfully.")
