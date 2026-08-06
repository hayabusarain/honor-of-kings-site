import cv2
import json
import numpy as np
import os
import subprocess

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# 1. Revert all public/images/items/ files using git checkout
print("Reverting all public/images/items/ files back to git HEAD...")
subprocess.run(['git', 'checkout', 'HEAD', '--', 'public/images/items/'], check=True)

# 2. Re-apply ONLY the 21 discrepancy item crops
folder = r'C:\Users\81901\Desktop\おなきんあいてむ'
with open('scratch/changed_items_report.json', 'r', encoding='utf-8') as f:
    discrepancies = json.load(f)

print(f"Re-applying ONLY the {len(discrepancies)} discrepancy item crops...")

reapplied_count = 0

for d in discrepancies:
    filename = d['screenshot']
    filepath = os.path.join(folder, filename)
    img = read_img_unicode(filepath)
    if img is None:
        continue
        
    icon_crop = img[285:375, 1205:1295]
    if icon_crop is None or icon_crop.shape[0] < 50 or icon_crop.shape[1] < 50:
        continue
        
    save_path = os.path.join('public', d['icon_path'])
    highres_crop = cv2.resize(icon_crop, (160, 160))
    cv2.imwrite(save_path, highres_crop)
    reapplied_count += 1
    print(f"  [RE-APPLIED] {d['name']} (ID {d['id']}) -> {d['icon_path']}")

print(f"\nDone! Reverted all items EXCEPT the {reapplied_count} requested discrepancy items.")
