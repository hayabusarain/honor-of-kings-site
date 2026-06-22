import json

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/src/data/hero_stats_camp.json", "r", encoding="utf-8") as f:
    hero_stats = json.load(f)

with open("C:/Users/81901/.gemini/antigravity/brain/f96a5591-ba25-4a35-b1b0-aaa6007f2425/scratch/new_tier_data.json", "r", encoding="utf-8") as f:
    tier_data = json.load(f)

if "Feyd" in tier_data:
    hero_stats["hero_029"]["tier"] = tier_data["Feyd"]["tier"]
    hero_stats["hero_029"]["win_rate"] = tier_data["Feyd"]["win_rate"]
    hero_stats["hero_029"]["pick_rate"] = tier_data["Feyd"]["pick_rate"]
    hero_stats["hero_029"]["ban_rate"] = tier_data["Feyd"]["ban_rate"]

# Also double check Loong
if "Loong" in tier_data:
    # If Loong is actually Luanna?
    # Wait, Luanna is hero_106
    # Let's see if Luanna is Loong. In Chinese, Loong is Ao'yin. But Ao'yin is already hero_093. 
    # Is there another Loong?
    pass

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/src/data/hero_stats_camp.json", "w", encoding="utf-8") as f:
    json.dump(hero_stats, f, indent=2, ensure_ascii=False)

print("Updated Feyd.")
