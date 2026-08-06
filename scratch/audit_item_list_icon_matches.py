import json
import os
import cv2
import numpy as np

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

# Load hok_items.json
p_items = os.path.abspath(r'src\data\hok_items.json')
with open(p_items, 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Auditing total {len(items)} items in hok_items.json...")

missing_icons = []
duplicate_icons = {}
item_summary = []

for item in items:
    iid = item.get('id')
    name = item.get('name')
    name_en = item.get('name_en') or item.get('nameEn', '')
    icon = item.get('icon', '')
    
    icon_rel = icon.lstrip('/')
    icon_path = os.path.join('public', icon_rel)
    
    exists = os.path.exists(icon_path)
    
    if not exists:
        missing_icons.append((iid, name, icon))
    else:
        if icon in duplicate_icons:
            duplicate_icons[icon].append((iid, name))
        else:
            duplicate_icons[icon] = [(iid, name)]
            
    item_summary.append({
        "id": iid,
        "name": name,
        "name_en": name_en,
        "icon": icon,
        "exists": exists
    })

print(f"Missing icon files: {len(missing_icons)}")
for m in missing_icons:
    print(f"  Missing: ID {m[0]} ({m[1]}) -> {m[2]}")

print("\nIcons assigned to multiple items:")
for icon_file, item_list in duplicate_icons.items():
    if len(item_list) > 1:
        print(f"  Icon '{icon_file}' used by {len(item_list)} items:")
        for iid, iname in item_list:
            print(f"    - ID {iid}: {iname}")

# Output summary JSON for analysis
with open('scratch/item_audit_results.json', 'w', encoding='utf-8') as f:
    json.dump({
        "total": len(items),
        "missing": missing_icons,
        "duplicates": {k: v for k, v in duplicate_icons.items() if len(v) > 1},
        "items": item_summary
    }, f, ensure_ascii=False, indent=2)

print("\nSaved full audit to scratch/item_audit_results.json!")
