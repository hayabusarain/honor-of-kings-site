import json
import os

base = r'C:\Users\81901\Pictures\Screenshots'
dirs = sorted([d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d)) and d.startswith("Set_")])

report = []
for d in dirs:
    sd_p = os.path.join(base, d)
    files = sorted([f for f in os.listdir(sd_p) if f.endswith('.png')])
    range_str = f"{files[0]} - {files[-1]}" if files else "EMPTY"
    report.append({
        "folder_name": d,
        "first_file": files[0] if files else "",
        "file_count": len(files)
    })

print(f"Total directories: {len(report)}")
for r in report[:30]:
    print(f"  Folder: '{r['folder_name']}' | First File: '{r['first_file']}' ({r['file_count']} files)")

with open('scratch/current_folders_inspection.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)
