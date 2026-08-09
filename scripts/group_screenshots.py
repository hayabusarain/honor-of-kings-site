import os
import json
import re
from PIL import Image, ImageChops, ImageStat

def extract_number(filename):
    match = re.search(r'\d+', filename)
    return int(match.group()) if match else 0

def group_screenshots():
    dir_path = r'C:\Users\81901\Desktop\オナキンENヒーロー\Screenshots'
    files = [f for f in os.listdir(dir_path) if f.endswith('.png') or f.endswith('.jpg')]
    files.sort(key=extract_number)

    print(f"Total screenshots found: {len(files)}")

    groups = []
    current_group = []
    prev_hero_crop = None

    # Threshold for hero name region visual difference
    # Hero name is in upper right (x: 60%~85%, y: 14%~28%)
    for idx, fname in enumerate(files):
        img_path = os.path.join(dir_path, fname)
        try:
            with Image.open(img_path) as img:
                w, h = img.size
                # Crop hero name area
                hero_crop = img.crop((int(w * 0.60), int(h * 0.14), int(w * 0.85), int(h * 0.28))).convert('L')

                if prev_hero_crop is None:
                    current_group.append(fname)
                    prev_hero_crop = hero_crop
                else:
                    # Compare diff
                    diff = ImageChops.difference(prev_hero_crop, hero_crop)
                    stat = ImageStat.Stat(diff)
                    diff_score = stat.mean[0]

                    # If difference is high, hero changed!
                    if diff_score > 15.0:  # New hero boundary detected
                        groups.append({
                            "group_id": len(groups) + 1,
                            "count": len(current_group),
                            "files": current_group
                        })
                        current_group = [fname]
                        prev_hero_crop = hero_crop
                    else:
                        current_group.append(fname)
        except Exception as e:
            print(f"Error on {fname}: {e}")

    if current_group:
        groups.append({
            "group_id": len(groups) + 1,
            "count": len(current_group),
            "files": current_group
        })

    print(f"Successfully grouped into {len(groups)} distinct hero screenshot packages!")

    os.makedirs('scratch/ocr_v2', exist_ok=True)
    with open('scratch/ocr_v2/hero_groups.json', 'w', encoding='utf-8') as f:
        json.dump(groups, f, ensure_ascii=False, indent=2)

    print("Hero groups written to scratch/hero_groups.json")

if __name__ == '__main__':
    group_screenshots()
