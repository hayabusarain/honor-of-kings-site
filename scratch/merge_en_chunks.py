import json
import os

target_file = "c:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/en.json"
chunks_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks"

with open(target_file, "r", encoding="utf-8") as f:
    merged_data = json.load(f)

for i in range(1, 11):
    chunk_path = os.path.join(chunks_dir, f"en_chunk_{i}_done.json")
    if os.path.exists(chunk_path):
        with open(chunk_path, "r", encoding="utf-8") as f:
            chunk_data = json.load(f)
            for hero_key, hero_data in chunk_data.items():
                if "strategy" in hero_data:
                    if "strategy" not in merged_data[hero_key]:
                        merged_data[hero_key]["strategy"] = {}
                    
                    # Update fields
                    for field in ["earlyGame", "midGame", "lateGame", "teamfight", "commonMistakes"]:
                        if field in hero_data["strategy"]:
                            merged_data[hero_key]["strategy"][field] = hero_data["strategy"][field]

with open(target_file, "w", encoding="utf-8") as f:
    json.dump(merged_data, f, ensure_ascii=False, indent=2)

print("Merged all translated chunks successfully into en.json")
