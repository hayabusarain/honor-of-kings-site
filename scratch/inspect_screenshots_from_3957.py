import os
import re

folder = r'C:\Users\81901\Pictures\Screenshots'
files = os.listdir(folder)

screenshot_files = []
for f in files:
    m = re.search(r'スクリーンショット \((\d+)\)\.png', f)
    if m:
        num = int(m.group(1))
        screenshot_files.append((num, f))

screenshot_files.sort(key=lambda x: x[0])

print(f"Total screenshots found in folder: {len(screenshot_files)}")

# Filter files >= 3957
files_from_3957 = [item for item in screenshot_files if item[0] >= 3957]
print(f"Screenshots with number >= 3957: {len(files_from_3957)}")

if files_from_3957:
    print(f"First file: {files_from_3957[0][1]}")
    print(f"Last file: {files_from_3957[-1][1]}")
    print("\nSample list (first 20):")
    for num, fname in files_from_3957[:20]:
        print(f"  {num}: {fname}")
else:
    print("No screenshots with number >= 3957 found. Listing latest 20 screenshots:")
    for num, fname in screenshot_files[-20:]:
        print(f"  {num}: {fname}")
