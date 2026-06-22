import json
import os

base_dir = r"c:\Users\81901\Desktop\オナーオブキングスサイト"

# 1. Restore ja.json from ja.json.bak
ja_bak = os.path.join(base_dir, r"public\data\skills\ja.json.bak")
ja_path = os.path.join(base_dir, r"public\data\skills\ja.json")
en_path = os.path.join(base_dir, r"public\data\skills\en.json")

with open(ja_bak, "r", encoding="utf-8") as f:
    ja_skills = json.load(f)

# 2. Add Fatih and Lapulapu
with open(os.path.join(base_dir, r"scratch\subagent_skills.json"), "r", encoding="utf-8") as f:
    fatih_lapu = json.load(f)

ja_skills["hero_9001"] = fatih_lapu.get("hero_029", {"lore": "", "skills": []})
ja_skills["hero_9002"] = fatih_lapu.get("hero_056", {"lore": "", "skills": []})

# 3. Add duplicates (will be populated later when subagents finish)
# For now, we will just prepare the script.
try:
    with open(os.path.join(base_dir, r"scratch\subagent_skills_dups1.json"), "r", encoding="utf-8") as f:
        dups1 = json.load(f)
    with open(os.path.join(base_dir, r"scratch\subagent_skills_dups2.json"), "r", encoding="utf-8") as f:
        dups2 = json.load(f)
    
    dups = {**dups1, **dups2}
    
    # Mapping to new IDs
    dup_mapping = {
        "hero_002": ("9010", "yuanliu_mage", "元流の子（メイジ）", "Yuanliu Mage"),
        "hero_006": ("9011", "yuanliu_mm", "元流の子（マークスマン）", "Yuanliu MM"),
        "hero_064": ("9012", "cang", "蒼", "Cang"),
        "hero_092": ("9013", "dasiming", "大司命", "Dasiming"),
        "hero_104": ("9014", "harold", "ハロルド", "Harold"),
        "hero_109": ("9015", "heino", "ハイノ", "Heino"),
        "hero_018": ("9016", "ake", "阿軻", "Ake"),
        "hero_112": ("9017", "butterfly", "バタフライ", "Butterfly"),
        "hero_038": ("9018", "kongzi", "孔子", "Kongzi"),
        "hero_073": ("9019", "kongming", "孔明", "Kongming"),
    }
    
    new_heroes = []
    new_stats = []
    
    for raw_id, (new_id, en_name, ja_name, cn_name) in dup_mapping.items():
        if raw_id in dups:
            ja_skills[f"hero_{new_id}"] = dups[raw_id]
            new_heroes.append({
                "id": int(new_id),
                "nameEn": en_name,
                "nameCn": cn_name,
                "nameJa": ja_name
            })
            new_stats.append({
                "hero_name_en": en_name,
                "hero_name_ja": ja_name,
                "survivability": "50",
                "attack_damage": "50",
                "skill_effect": "50",
                "difficulty": "50"
            })
except Exception as e:
    print(f"Subagents output not found yet: {e}")

with open(ja_path, "w", encoding="utf-8") as f:
    json.dump(ja_skills, f, ensure_ascii=False, indent=2)

with open(en_path, "w", encoding="utf-8") as f:
    json.dump(ja_skills, f, ensure_ascii=False, indent=2)

print("Saved ja.json and en.json")
