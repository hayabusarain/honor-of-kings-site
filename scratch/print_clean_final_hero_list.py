import os
import re

base_folder = r'C:\Users\81901\Pictures\Screenshots'
dirs = sorted([d for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d)) and d.startswith("Set_")])

print(f"Total Hero Set Folders: {len(dirs)}")
for d in dirs[:40]:
    m = re.search(r'Set_(\d+)_(.*)_(\d+-\d+)', d)
    if m:
        set_num = m.group(1)
        hero_str = m.group(2)
        range_str = m.group(3)
        print(f"  Set {set_num}: {hero_str} ({range_str})")
    else:
        print(f"  {d}")
