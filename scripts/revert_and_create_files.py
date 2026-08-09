import os
import shutil
import json
import re

def sanitize_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name).strip()

def main():
    # 1. Delete the wrong 'files' directory
    wrong_dir = r'C:\Users\81901\Desktop\オナキンENヒーロー\Empty_Hero_Files'
    if os.path.exists(wrong_dir):
        shutil.rmtree(wrong_dir)
        print(f"Deleted {wrong_dir}")

    # 2. Create the folders inside Screenshots for easy sorting
    heroes_json_path = 'src/data/hok_heroes.json'
    target_dir = r'C:\Users\81901\Desktop\オナキンENヒーロー\Screenshots'
    
    if not os.path.exists(target_dir):
        print(f"Target directory not found: {target_dir}")
        return

    with open(heroes_json_path, 'r', encoding='utf-8') as f:
        heroes = json.load(f)

    folder_count = 0
    for hero in heroes:
        hero_name = hero.get('name_en', 'Unknown')
        safe_name = sanitize_filename(hero_name)
        folder_path = os.path.join(target_dir, safe_name)
        
        # Create empty folder
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            folder_count += 1

    print(f"Created {folder_count} empty folders in {target_dir}")

if __name__ == '__main__':
    main()
