import json
import os
import subprocess

base_folder = r'C:\Users\81901\Pictures\Screenshots'
arthur_dir = None

for d in os.listdir(base_folder):
    if d.startswith("Set_001_"):
        arthur_dir = os.path.join(base_folder, d)
        break

print(f"Arthur Set Directory: {arthur_dir}")

if arthur_dir and os.path.exists(arthur_dir):
    files = sorted([f for f in os.listdir(arthur_dir) if f.endswith('.png')])
    print(f"Files inside Arthur set ({len(files)} files):")
    for f in files:
        fpath = os.path.join(arthur_dir, f)
        # Run ocr_folder.exe single file test
        proc = subprocess.run(['scratch\\winocr.exe', os.path.abspath(fpath)], capture_output=True, text=True, encoding='utf-8')
        out_text = proc.stdout.strip().replace("\n", " ").replace("\r", " ")
        print(f"  {f} => {out_text[:100]}...")
