import os
import shutil

base = r'C:\Users\81901\Pictures\Screenshots'
dirs = [d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d)) and d.startswith("Set_")]

removed = 0
for d in dirs:
    if "UNKNOWN" in d:
        p = os.path.join(base, d)
        # Check if empty or duplicate
        files = os.listdir(p)
        if not files:
            os.rmdir(p)
            removed += 1
            print(f"Removed empty directory: '{d}'")

print(f"Cleanup finished. Removed {removed} empty UNKNOWN directories.")
