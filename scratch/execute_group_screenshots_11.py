import os
import re
import shutil

folder = r'C:\Users\81901\Pictures\Screenshots'
files = os.listdir(folder)

screenshot_files = []
for f in files:
    m = re.search(r'スクリーンショット \((\d+)\)\.png', f)
    if m:
        num = int(m.group(1))
        if num >= 3957:
            screenshot_files.append((num, f))

screenshot_files.sort(key=lambda x: x[0])

print(f"Total target screenshots starting from 3957: {len(screenshot_files)}")

step = 11
total_files = len(screenshot_files)
created_folders = 0
moved_files = 0

for i in range(0, total_files, step):
    group = screenshot_files[i:i+step]
    if not group:
        continue
        
    start_num = group[0][0]
    end_num = group[-1][0]
    folder_idx = (i // step) + 1
    
    subfolder_name = f"Set_{folder_idx:03d}_{start_num}-{end_num}"
    subfolder_path = os.path.join(folder, subfolder_name)
    
    os.makedirs(subfolder_path, exist_ok=True)
    created_folders += 1
    
    for num, fname in group:
        src = os.path.join(folder, fname)
        dst = os.path.join(subfolder_path, fname)
        shutil.move(src, dst)
        moved_files += 1

print(f"\nExecution Summary:")
print(f"  Created Folders: {created_folders}")
print(f"  Total Moved Files: {moved_files}")

# Verify folder integrity
subdirs = [os.path.join(folder, d) for d in os.listdir(folder) if os.path.isdir(os.path.join(folder, d)) and d.startswith("Set_")]
print(f"  Total Set Subdirectories Verified: {len(subdirs)}")

mismatched = []
for sd in subdirs:
    contents = os.listdir(sd)
    if len(contents) != 11:
        mismatched.append((os.path.basename(sd), len(contents)))

if mismatched:
    print(f"  WARNING: Found {len(mismatched)} folders with count != 11:")
    for name, cnt in mismatched:
        print(f"    {name}: {cnt} files")
else:
    print(f"  SUCCESS! All {len(subdirs)} folders contain EXACTLY 11 screenshot files!")

report = {
    "created_folders": created_folders,
    "moved_files": moved_files,
    "mismatched_folders": mismatched
}

with open('scratch/folder_grouping_report.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print("\nSaved execution report to scratch/folder_grouping_report.json!")
