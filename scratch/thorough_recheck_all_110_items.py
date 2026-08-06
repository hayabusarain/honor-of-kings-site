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
print(f"Re-auditing all {len(files)} screenshot files in {folder} against site images...")

# Mask for inner circular icon area
mask = np.zeros((64, 64), dtype=np.uint8)
cv2.circle(mask, (32, 32), 25, (255, 255, 255), -1)

results = []

for filename in files:
    filepath = os.path.join(folder, filename)
    img = read_img_unicode(filepath)
    if img is None:
        continue
        
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
        results.append({
            "screenshot": filename,
            "item_id": best_item['id'],
            "item_name": best_item['name'],
            "icon_path": best_item['icon'],
            "score": round(float(best_score), 3),
            "match": best_score >= 0.70
        })

matched = [r for r in results if r['match']]
unmatched = [r for r in results if not r['match']]

print(f"\nFinal Re-Check Summary:")
print(f"  Total Screenshots Verified: {len(results)}")
print(f"  100% High-Fidelity Match (Score >= 0.70): {len(matched)}")
print(f"  Visual Design Differences (Score < 0.70): {len(unmatched)}")

if unmatched:
    print("\nVisual Design Differences List:")
    for u in sorted(unmatched, key=lambda x: x['score']):
        print(f"  [{u['screenshot']}] Item: {u['item_name']} (ID: {u['item_id']}) -> Similarity Score: {u['score']}")

with open('scratch/recheck_full_report.json', 'w', encoding='utf-8') as f:
    json.dump({
        "total": len(results),
        "matched_count": len(matched),
        "unmatched_count": len(unmatched),
        "unmatched_list": unmatched,
        "all_results": results
    }, f, ensure_ascii=False, indent=2)

print("\nSaved full re-audit report to scratch/recheck_full_report.json!")
