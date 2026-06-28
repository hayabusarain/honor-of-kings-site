import os
import json

base_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト"
tasks_dir = os.path.join(base_dir, "scratch/scraper/en_tasks")
os.makedirs(tasks_dir, exist_ok=True)

for i in range(1, 11):
    output_path = os.path.join(base_dir, f"scratch/scraper/outputs/output_{i}.json")
    if not os.path.exists(output_path): continue
    
    with open(output_path, "r", encoding="utf-8") as f:
        ja_strategy = json.load(f)
        
    prompt_content = f"""You are a professional translator for the game Honor of Kings.
Translate the following Japanese strategy texts into English. Use standard HoK terminology (e.g., Ultimate, Skill 1, Skill 2, Passive, CC, burst damage).
Keep the exact same JSON structure, just translate the string values into English.

Save the resulting JSON to `c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/en_outputs/en_output_{i}.json` using UTF-8 encoding.

=== Japanese JSON ===
{json.dumps(ja_strategy, ensure_ascii=False, indent=2)}
"""
    
    out_path = os.path.join(tasks_dir, f"en_task_{i}.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(prompt_content)

os.makedirs(os.path.join(base_dir, "scratch/scraper/en_outputs"), exist_ok=True)
print("Prepared 10 English translation tasks.")
