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

files = [f for f in os.listdir(folder) if f.endswith('.png')]
print(f"Comparing {len(files)} screenshot item icons against site images in public/images/items/...")

# Circular mask to exclude background
mask = np.zeros((64, 64), dtype=np.uint8)
cv2.circle(mask, (32, 32), 26, (255, 255, 255), -1)

results = []
matched_items = []
discrepancies = []

for filename in files:
    filepath = os.path.join(folder, filename)
    img = read_img_unicode(filepath)
    if img is None:
        continue
        
    # Crop right synthesis top icon (y: 285 to 375, x: 1205 to 1295)
    icon_crop = img[285:375, 1205:1295]
    if icon_crop is None or icon_crop.shape[0] < 50 or icon_crop.shape[1] < 50:
        continue
        
    icon_sq = cv2.resize(icon_crop, (64, 64))
    icon_masked = cv2.bitwise_and(icon_sq, icon_sq, mask=mask)
    
    best_score = -1
    best_item = None
    
    for it in items:
        icon_path = os.path.join('public', it['icon'].lstrip('/'))
        if os.path.exists(icon_path):
            ref_img = read_img_unicode(icon_path)
            if ref_img is not None:
                ref_sq = cv2.resize(ref_img, (64, 64))
                ref_masked = cv2.bitwise_and(ref_sq, ref_sq, mask=mask)
                res = cv2.matchTemplate(icon_masked, ref_masked, cv2.TM_CCOEFF_NORMED)
                _, max_val, _, _ = cv2.minMaxLoc(res)
                if max_val > best_score:
                    best_score = max_val
                    best_item = it
                    
    if best_item:
        is_match = best_score >= 0.70
        entry = {
            "screenshot": filename,
            "matched_item_id": best_item['id'],
            "matched_item_name": best_item['name'],
            "site_icon": best_item['icon'],
            "similarity_score": round(float(best_score), 3),
            "status": "MATCH" if is_match else "DISCREPANCY"
        }
        results.append(entry)
        if is_match:
            matched_items.append(entry)
        else:
            discrepancies.append(entry)

print(f"\nAudit Summary:")
print(f"Total Screenshots Tested: {len(results)}")
print(f"100% Matching Icons (Score >= 0.70): {len(matched_items)}")
print(f"Discrepancies / Design Differences (Score < 0.70): {len(discrepancies)}")

if discrepancies:
    print("\nTop Discrepancies Found:")
    for d in sorted(discrepancies, key=lambda x: x['similarity_score'])[:15]:
        print(f"  [{d['screenshot']}] Item: {d['matched_item_name']} (ID: {d['matched_item_id']}) -> Similarity: {d['similarity_score']}")

# Save report
with open('scratch/site_vs_screenshots_report.json', 'w', encoding='utf-8') as f:
    json.dump({
        "total_tested": len(results),
        "total_matched": len(matched_items),
        "total_discrepancies": len(discrepancies),
        "discrepancy_list": discrepancies,
        "all_results": results
    }, f, ensure_ascii=False, indent=2)

print("\nSaved report to scratch/site_vs_screenshots_report.json!")
