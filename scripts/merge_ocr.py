import json
import os
import glob

def merge_ocr_results():
    en_path = 'public/data/skills/en.json'
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    # Find all chunk_*_result.json files across all agent brain directories
    brain_dir = r"C:\Users\81901\.gemini\antigravity\brain"
    search_pattern = os.path.join(brain_dir, "*", "scratch", "ocr", "chunk_*_result.json")
    result_files = glob.glob(search_pattern)

    # Also check local scratch if any
    local_scratch = glob.glob("scratch/ocr/chunk_*_result.json")
    result_files.extend(local_scratch)

    if not result_files:
        print("No result files found!")
        return

    merged_count = 0
    for res_file in result_files:
        try:
            with open(res_file, 'r', encoding='utf-8') as f:
                chunk_data = json.load(f)
            
            for hero_id, hero_data in chunk_data.items():
                if hero_id in en_data and 'skills' in hero_data:
                    # Keep original name, replace skills
                    en_data[hero_id]['skills'] = hero_data['skills']
                    merged_count += 1
                elif 'skills' in hero_data:
                    en_data[hero_id] = hero_data
                    merged_count += 1
        except Exception as e:
            print(f"Failed to read {res_file}: {e}")

    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

    print(f"Successfully merged {merged_count} heroes' skills into en.json.")

if __name__ == '__main__':
    merge_ocr_results()
