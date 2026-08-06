import cv2
import json
import numpy as np
import os

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Desktop\おなきんあいてむ'
p_items = os.path.abspath(r'src\data\hok_items.json')

with open(p_items, 'r', encoding='utf-8') as f:
    items = json.load(f)

# Load report from verify script
with open('scratch/site_vs_screenshots_report.json', 'r', encoding='utf-8') as f:
    report = json.load(f)

discrepancies = report.get('discrepancy_list', [])

print(f"Starting precision cropping for {len(discrepancies)} items with visual discrepancies...")

changed_list = []

for d in discrepancies:
    filename = d['screenshot']
    filepath = os.path.join(folder, filename)
    img = read_img_unicode(filepath)
    if img is None:
        continue
        
    # Crop right synthesis top icon (y: 285 to 375, x: 1205 to 1295)
    icon_crop = img[285:375, 1205:1295]
    if icon_crop is None or icon_crop.shape[0] < 50 or icon_crop.shape[1] < 50:
        continue
        
    matched_id = str(d['matched_item_id'])
    matched_name = d['matched_item_name']
    site_icon_rel = d['site_icon'].lstrip('/')
    save_path = os.path.join('public', site_icon_rel)
    
    # Resize to clean 160x160 icon
    highres_crop = cv2.resize(icon_crop, (160, 160))
    cv2.imwrite(save_path, highres_crop)
    
    changed_list.append({
        "id": matched_id,
        "name": matched_name,
        "screenshot": filename,
        "icon_path": site_icon_rel,
        "old_score": d['similarity_score']
    })
    print(f"  [UPDATED] Item ID {matched_id}: {matched_name} from {filename} -> Saved to {site_icon_rel}")

print(f"\nSuccessfully replaced and updated {len(changed_list)} item icon files!")

with open('scratch/changed_items_report.json', 'w', encoding='utf-8') as f:
    json.dump(changed_list, f, ensure_ascii=False, indent=2)
