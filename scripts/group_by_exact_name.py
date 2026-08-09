import os
import json
import re
from PIL import Image, ImageChops, ImageStat, ImageOps

def extract_number(filename):
    match = re.search(r'\d+', filename)
    return int(match.group()) if match else 0

def group_by_exact_hero_name():
    dir_path = r'C:\Users\81901\Pictures\Screenshots'
    files = [f for f in os.listdir(dir_path) if f.endswith('.png')]
    files.sort(key=extract_number)

    print(f"Total screenshots found: {len(files)}")

    groups = []
    current_group = []
    prev_hero_binary = None

    for idx, fname in enumerate(files):
        img_path = os.path.join(dir_path, fname)
        try:
            with Image.open(img_path) as img:
                w, h = img.size
                # Tight crop specifically on the white Hero Name text (x: 62%~78%, y: 16%~22%)
                crop = img.crop((int(w * 0.62), int(h * 0.16), int(w * 0.78), int(h * 0.22))).convert('L')
                
                # Binarize threshold to isolate pure white hero name text from background effects
                binary_crop = crop.point(lambda p: 255 if p > 200 else 0)

                if prev_hero_binary is None:
                    current_group.append(fname)
                    prev_hero_binary = binary_crop
                else:
                    diff = ImageChops.difference(prev_hero_binary, binary_crop)
                    stat = ImageStat.Stat(diff)
                    diff_score = stat.mean[0]

                    # Threshold for text shape change (higher threshold means only real name change)
                    if diff_score > 8.0:
                        groups.append({
                            "group_id": len(groups) + 1,
                            "count": len(current_group),
                            "files": current_group
                        })
                        current_group = [fname]
                        prev_hero_binary = binary_crop
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

    print(f"Refined hero grouping: {len(groups)} distinct heroes detected!")

    os.makedirs('scratch', exist_ok=True)
    with open('scratch/hero_groups.json', 'w', encoding='utf-8') as f:
        json.dump(groups, f, ensure_ascii=False, indent=2)

    print("Hero groups updated in scratch/hero_groups.json")

if __name__ == '__main__':
    group_by_exact_hero_name()
