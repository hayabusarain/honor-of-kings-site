import json

with open("C:/Users/81901/Desktop/オナーオブキングスサイト/src/data/hero_stats_camp.json", "r", encoding="utf-8") as f:
    hero_stats = json.load(f)

# Find any hero that looks like it wasn't updated.
# We can tell it wasn't updated if its pick_rate and win_rate are unchanged?
# Wait, actually let's just see which ones have a fractional pick_rate with many decimals?
# Or better, let's just print all JP names and their English names to see if we missed any.

# Just print all jpNames in hero_stats that we didn't map
# Wait, I didn't keep track of what I mapped in this script. Let's do it simply:
with open("C:/Users/81901/.gemini/antigravity/brain/f96a5591-ba25-4a35-b1b0-aaa6007f2425/scratch/new_tier_data.json", "r", encoding="utf-8") as f:
    tier_data = json.load(f)

# Let's see what values are in hero_stats_camp.json
# new_tier_data.json has 1 decimal place (e.g. 52.1, 14.1)
# hero_stats originally had 2 decimal places (e.g. 48.38, 1.18)
# So if a hero has 2 decimal places, it was probably NOT updated!

unupdated = []
for hero_id, data in hero_stats.items():
    if isinstance(data["win_rate"], float) and round(data["win_rate"], 1) != data["win_rate"]:
        unupdated.append(data["jpName"])

print(unupdated)

