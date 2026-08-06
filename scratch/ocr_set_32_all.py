import os
import subprocess

base = r'C:\Users\81901\Pictures\Screenshots'
s32_dir = [d for d in os.listdir(base) if 'Set_032' in d][0]
s32_path = os.path.join(base, s32_dir)

proc = subprocess.run(['scratch\\ocr_folder.exe', os.path.abspath(s32_path)], capture_output=True, text=True, encoding='utf-8')
print("Set 032 full OCR output:")
print(proc.stdout)
