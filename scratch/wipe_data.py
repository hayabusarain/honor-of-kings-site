import os
import shutil

base_dir = r"c:\Users\81901\Desktop\オナーオブキングスサイト"

files_to_empty = [
    (os.path.join(base_dir, r"src\data\hok_heroes.json"), "[]"),
    (os.path.join(base_dir, r"src\data\hero_stats.json"), "[]"),
    (os.path.join(base_dir, r"public\data\skills\ja.json"), "{}"),
    (os.path.join(base_dir, r"public\data\skills\en.json"), "{}"),
    (os.path.join(base_dir, r"public\data\counters.json"), "{}")
]

for file_path, empty_content in files_to_empty:
    if os.path.exists(file_path):
        # Create backup
        backup_path = file_path + ".bak"
        shutil.copy2(file_path, backup_path)
        print(f"Backed up {file_path} to {backup_path}")
        
        # Empty the file
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(empty_content)
        print(f"Emptied {file_path}")
    else:
        # Just create the empty file if it doesn't exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(empty_content)
        print(f"Created empty {file_path}")
