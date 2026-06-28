import json
import os
import glob

# Load ja.json
ja_json_path = 'public/data/skills/ja.json'
with open(ja_json_path, 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

# Load and merge all outputs
output_files = glob.glob('scratch/scraper/outputs/output_*.json')
merged_strategies = {}
for file in output_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            merged_strategies.update(data)
    except Exception as e:
        print(f"Error reading {file}: {e}")

count = 0
for hero_id, strategy in merged_strategies.items():
    if hero_id in ja_data:
        # Preserve existing strengths/weaknesses if they exist
        existing_strategy = ja_data[hero_id].get('strategy', {})
        if not isinstance(existing_strategy, dict):
            existing_strategy = {}
            
        new_strategy = {
            'strengths': existing_strategy.get('strengths', []),
            'weaknesses': existing_strategy.get('weaknesses', []),
            'earlyGame': strategy.get('earlyGame', ''),
            'midGame': strategy.get('midGame', ''),
            'lateGame': strategy.get('lateGame', ''),
            'teamfight': strategy.get('teamfight', ''),
            'commonMistakes': strategy.get('commonMistakes', '')
        }
        ja_data[hero_id]['strategy'] = new_strategy
        count += 1
    else:
        print(f"Warning: {hero_id} not found in ja.json")

# Write back to ja.json
with open(ja_json_path, 'w', encoding='utf-8') as f:
    json.dump(ja_data, f, ensure_ascii=False, indent=2)

print(f"Successfully updated {count} heroes in ja.json")
