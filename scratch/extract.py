import json

with open("c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_9.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/extract.txt", "w", encoding="utf-8") as out:
    for hero_id, hero_data in data.items():
        out.write(f"--- {hero_id} ({hero_data.get('hero_name')}) ---\n")
        strategy = hero_data.get("strategy", {})
        for key in ["earlyGame", "midGame", "lateGame", "teamfight", "commonMistakes"]:
            if key in strategy:
                out.write(f"{key}: {strategy[key]}\n")
