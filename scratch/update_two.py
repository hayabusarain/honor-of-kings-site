import json

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/src/data/hero_stats_camp.json", "r", encoding="utf-8") as f:
    hero_stats = json.load(f)

with open("C:/Users/81901/.gemini/antigravity/brain/f96a5591-ba25-4a35-b1b0-aaa6007f2425/scratch/new_tier_data.json", "r", encoding="utf-8") as f:
    tier_data = json.load(f)

# Find Yixing and Haoyue in hero_stats
# We know Yixing is hero_079 and Haoyue is hero_094
hero_stats["hero_079"]["tier"] = tier_data["Yixing"]["tier"]
hero_stats["hero_079"]["win_rate"] = tier_data["Yixing"]["win_rate"]
hero_stats["hero_079"]["pick_rate"] = tier_data["Yixing"]["pick_rate"]
hero_stats["hero_079"]["ban_rate"] = tier_data["Yixing"]["ban_rate"]

hero_stats["hero_094"]["tier"] = tier_data["Haoyue"]["tier"]
hero_stats["hero_094"]["win_rate"] = tier_data["Haoyue"]["win_rate"]
hero_stats["hero_094"]["pick_rate"] = tier_data["Haoyue"]["pick_rate"]
hero_stats["hero_094"]["ban_rate"] = tier_data["Haoyue"]["ban_rate"]

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/src/data/hero_stats_camp.json", "w", encoding="utf-8") as f:
    json.dump(hero_stats, f, indent=2, ensure_ascii=False)

print("Updated Yixing and Haoyue.")
