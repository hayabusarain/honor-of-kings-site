import os
import re

base_folder = r'C:\Users\81901\Pictures\Screenshots'
subdirs = sorted([d for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d))])

print(f"Renaming {len(subdirs)} set folders to numbers-only format (Set_XXX_start-end)...")

renamed_count = 0

for d in subdirs:
    sd_path = os.path.join(base_folder, d)
    files = sorted([f for f in os.listdir(sd_path) if f.endswith('.png')])
    if not files:
        continue

    # Extract set number and file range
    m_set = re.search(r'Set_(\d+)', d)
    m_range = re.search(r'(\d{4}-\d{4})', d)
    
    if m_set:
        set_num = m_set.group(1)
    else:
        continue
        
    if m_range:
        range_str = m_range.group(1)
    else:
        # Generate range string from actual files inside
        m_start = re.search(r'\((\d+)\)', files[0])
        m_end = re.search(r'\((\d+)\)', files[-1])
        if m_start and m_end:
            range_str = f"{m_start.group(1)}-{m_end.group(1)}"
        else:
            range_str = "0000-0000"

    new_dir_name = f"Set_{set_num}_{range_str}"
    
    old_p = os.path.join(base_folder, d)
    new_p = os.path.join(base_folder, new_dir_name)
    
    if old_p != new_p:
        try:
            os.rename(old_p, new_p)
            renamed_count += 1
            print(f"  [{set_num}] Renamed: '{d}' -> '{new_dir_name}'")
        except Exception as ex:
            print(f"  [{set_num}] Error: {ex}")
    else:
        print(f"  [{set_num}] Kept: '{new_dir_name}'")

print(f"\nCOMPLETED! Renamed {renamed_count} set folders to numbers-only format!")
