import json

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/src/data/hero_stats_camp.json", "r", encoding="utf-8") as f:
    hero_stats = json.load(f)

with open("C:/Users/81901/.gemini/antigravity/brain/f96a5591-ba25-4a35-b1b0-aaa6007f2425/scratch/new_tier_data.json", "r", encoding="utf-8") as f:
    tier_data = json.load(f)

mapped_count = 0
for hero_id, stats in hero_stats.items():
    # If win_rate is a round number (1 decimal place) it's likely updated
    if isinstance(stats["win_rate"], float) and round(stats["win_rate"], 1) == stats["win_rate"]:
        # double check if it matches ANY tier_data
        matched = False
        for en_name, t_stats in tier_data.items():
            if t_stats["win_rate"] == stats["win_rate"] and t_stats["pick_rate"] == stats["pick_rate"] and t_stats["ban_rate"] == stats["ban_rate"]:
                matched = True
                break
        if matched:
            mapped_count += 1

print(f"Total mapped and updated heroes: {mapped_count} out of {len(hero_stats)} in DB.")
