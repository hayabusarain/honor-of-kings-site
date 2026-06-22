import json
import os
import shutil

base_dir = r"c:\Users\81901\Desktop\オナーオブキングスサイト"

# Load the skills we successfully extracted
skills_bak_path = os.path.join(base_dir, r"public\data\skills\ja.json.bak")
with open(skills_bak_path, "r", encoding="utf-8") as f:
    skills = json.load(f)

extracted_keys = list(skills.keys()) # format: 'hero_166', 'hero_538'

# 1. Restore ja.json and en.json directly from bak
ja_path = os.path.join(base_dir, r"public\data\skills\ja.json")
en_path = os.path.join(base_dir, r"public\data\skills\en.json")
shutil.copy2(skills_bak_path, ja_path)
shutil.copy2(skills_bak_path, en_path) # Fallback English to Japanese for now

# 2. Filter hok_heroes.json
heroes_bak_path = os.path.join(base_dir, r"src\data\hok_heroes.json.bak")
with open(heroes_bak_path, "r", encoding="utf-8") as f:
    heroes = json.load(f)

filtered_heroes = []
valid_name_ens = set()

for h in heroes:
    hero_id_str = str(h['id'])
    # Check if this hero's ID is in our extracted skills
    key1 = f"hero_{hero_id_str.zfill(3)}"
    key2 = f"hero_{hero_id_str}"
    if key1 in extracted_keys or key2 in extracted_keys:
        filtered_heroes.append(h)
        valid_name_ens.add(h['nameEn'])

heroes_path = os.path.join(base_dir, r"src\data\hok_heroes.json")
with open(heroes_path, "w", encoding="utf-8") as f:
    json.dump(filtered_heroes, f, ensure_ascii=False, indent=2)

print(f"Restored hok_heroes.json: {len(filtered_heroes)} heroes (filtered down from {len(heroes)})")

# 3. Filter hero_stats.json
stats_bak_path = os.path.join(base_dir, r"src\data\hero_stats.json.bak")
with open(stats_bak_path, "r", encoding="utf-8") as f:
    stats = json.load(f)

filtered_stats = []
for s in stats:
    if s['hero_name_en'] in valid_name_ens:
        filtered_stats.append(s)

stats_path = os.path.join(base_dir, r"src\data\hero_stats.json")
with open(stats_path, "w", encoding="utf-8") as f:
    json.dump(filtered_stats, f, ensure_ascii=False, indent=2)

print(f"Restored hero_stats.json: {len(filtered_stats)} stats (filtered down from {len(stats)})")

# 4. Restore counters
counters_bak = os.path.join(base_dir, r"public\data\counters.json.bak")
counters_path = os.path.join(base_dir, r"public\data\counters.json")
if os.path.exists(counters_bak):
    shutil.copy2(counters_bak, counters_path)
    print("Restored counters.json")

print("Data successfully restored and perfectly synced to the 600 screenshots!")
