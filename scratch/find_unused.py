import json

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/src/data/hero_stats_camp.json", "r", encoding="utf-8") as f:
    hero_stats = json.load(f)

with open("C:/Users/81901/.gemini/antigravity/brain/f96a5591-ba25-4a35-b1b0-aaa6007f2425/scratch/new_tier_data.json", "r", encoding="utf-8") as f:
    tier_data = json.load(f)

used_en_names = set()

for hero_id, stats in hero_stats.items():
    if isinstance(stats["win_rate"], float) and round(stats["win_rate"], 1) == stats["win_rate"]:
        # Find which one it matched
        for en_name, t_stats in tier_data.items():
            if en_name in used_en_names:
                continue
            if t_stats["win_rate"] == stats["win_rate"] and t_stats["pick_rate"] == stats["pick_rate"] and t_stats["ban_rate"] == stats["ban_rate"]:
                used_en_names.add(en_name)
                break

not_used = set(tier_data.keys()) - used_en_names
print("Unused in new_tier_data.json:", not_used)
