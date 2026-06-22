import json
import os

base_dir = r"c:\Users\81901\Desktop\オナーオブキングスサイト"

# 1. Load extracted skills
with open(os.path.join(base_dir, r"scratch\subagent_skills.json"), "r", encoding="utf-8") as f:
    new_skills = json.load(f)

# 2. Load existing skills
ja_path = os.path.join(base_dir, r"public\data\skills\ja.json")
with open(ja_path, "r", encoding="utf-8") as f:
    ja_skills = json.load(f)

# Fatih -> 9001, Lapulapu -> 9002
ja_skills["hero_9001"] = new_skills["hero_029"]
ja_skills["hero_9002"] = new_skills["hero_056"]

with open(ja_path, "w", encoding="utf-8") as f:
    json.dump(ja_skills, f, ensure_ascii=False, indent=2)

en_path = os.path.join(base_dir, r"public\data\skills\en.json")
with open(en_path, "w", encoding="utf-8") as f:
    json.dump(ja_skills, f, ensure_ascii=False, indent=2)

# 3. Add to hok_heroes.json
heroes_path = os.path.join(base_dir, r"src\data\hok_heroes.json")
with open(heroes_path, "r", encoding="utf-8") as f:
    heroes = json.load(f)

fatih = {
  "id": 9001,
  "nameEn": "fatih",
  "nameCn": "Fatih",
  "nameJa": "ファーティフ"
}

lapulapu = {
  "id": 9002,
  "nameEn": "lapulapu",
  "nameCn": "Lapulapu",
  "nameJa": "ラプール"
}

heroes.append(fatih)
heroes.append(lapulapu)

with open(heroes_path, "w", encoding="utf-8") as f:
    json.dump(heroes, f, ensure_ascii=False, indent=2)

# 4. Add to hero_stats.json
stats_path = os.path.join(base_dir, r"src\data\hero_stats.json")
with open(stats_path, "r", encoding="utf-8") as f:
    stats = json.load(f)

stats.append({
  "hero_name_en": "fatih",
  "hero_name_ja": "ファーティフ",
  "survivability": "60",
  "attack_damage": "70",
  "skill_effect": "40",
  "difficulty": "50"
})

stats.append({
  "hero_name_en": "lapulapu",
  "hero_name_ja": "ラプール",
  "survivability": "70",
  "attack_damage": "80",
  "skill_effect": "50",
  "difficulty": "60"
})

with open(stats_path, "w", encoding="utf-8") as f:
    json.dump(stats, f, ensure_ascii=False, indent=2)

print("Successfully added Fatih and Lapulapu to the official database.")
