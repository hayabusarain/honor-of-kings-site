import json
import re

def extract(log_file, out_file):
    with open(log_file, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Reverse find the last ```json block
    matches = list(re.finditer(r'```json\n(.*?)\n```', text, re.DOTALL))
    if matches:
        last_match = matches[-1].group(1)
        with open(out_file, 'w', encoding='utf-8') as out:
            out.write(last_match)
        print(f"Extracted to {out_file}")
    else:
        print(f"No json block found in {log_file}")

extract('C:/Users/81901/.gemini/antigravity/brain/d745e045-9ee1-4d1c-86bf-ad83cf405d3e/.system_generated/logs/transcript_full.jsonl', 'scratch/subagent_skills_dups1.json')
extract('C:/Users/81901/.gemini/antigravity/brain/2c933c59-5f96-4802-ac3c-8d39df9e37d8/.system_generated/logs/transcript_full.jsonl', 'scratch/subagent_skills_dups2.json')
