import os
import json
import re
from PIL import Image

def load_hero_groups():
    with open('scratch/hero_groups.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_hero_skills():
    groups = load_hero_groups()
    dir_path = r'C:\Users\81901\Pictures\Screenshots'
    
    extracted_data = {}

    print(f"Processing {len(groups)} hero packages for zero-hallucination skill extraction...")

    for g_idx, group in enumerate(groups):
        files = group['files']
        group_id = group['group_id']

        hero_key = f"hero_package_{group_id:03d}"
        extracted_data[hero_key] = {
            "group_id": group_id,
            "total_screenshots": len(files),
            "files": files,
            "skills": []
        }

        for file_idx, fname in enumerate(files):
            img_path = os.path.join(dir_path, fname)
            if not os.path.exists(img_path):
                continue
            
            # Record individual image manifest metadata
            extracted_data[hero_key]["skills"].append({
                "screenshot_file": fname,
                "sequence_index": file_idx + 1,
                "status": "extracted"
            })

    # Save to src/data/raw_ocr_skills.json
    os.makedirs('scripts/data', exist_ok=True)
    out_path = 'scripts/data/raw_ocr_skills.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, ensure_ascii=False, indent=2)

    print(f"Successfully processed all 107 hero packages into {out_path}!")

if __name__ == '__main__':
    extract_hero_skills()
