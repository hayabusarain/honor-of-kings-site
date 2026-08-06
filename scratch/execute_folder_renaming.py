import json
import os

base_folder = r'C:\Users\81901\Pictures\Screenshots'
with open('scratch/avatar_rename_plan.json', 'r', encoding='utf-8') as f:
    plan = json.load(f)

renamed_count = 0
failed_count = 0

print(f"Executing renaming for {len(plan)} set folders...")

for p in plan:
    old_dir_name = p['old_dir']
    new_dir_name = p['new_dir']
    
    old_path = os.path.join(base_folder, old_dir_name)
    new_path = os.path.join(base_folder, new_dir_name)
    
    if os.path.exists(old_path):
        try:
            os.rename(old_path, new_path)
            renamed_count += 1
            print(f"  [RENAMED] {old_dir_name} -> {new_dir_name}")
        except Exception as e:
            failed_count += 1
            print(f"  [ERROR] Could not rename {old_dir_name}: {e}")

print(f"\nExecution Summary:")
print(f"  Renamed Folders: {renamed_count}")
print(f"  Failed Folders: {failed_count}")

# List all folders in target directory to verify
current_dirs = [d for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d)) and d.startswith("Set_")]
print(f"  Total Renamed Set Subdirectories: {len(current_dirs)}")
