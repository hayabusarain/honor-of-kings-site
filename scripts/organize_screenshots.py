import os
import shutil
import re
from PIL import Image, ImageChops, ImageStat

def extract_number(filename):
    match = re.search(r'\d+', filename)
    return int(match.group()) if match else 0

def organize_screenshots():
    dir_path = r'C:\Users\81901\Desktop\オナキンENヒーロー\Screenshots'
    if not os.path.exists(dir_path):
        print(f"Directory not found: {dir_path}")
        return

    files = [f for f in os.listdir(dir_path) if f.endswith('.png') or f.endswith('.jpg')]
    files.sort(key=extract_number)

    print(f"Total screenshots found: {len(files)}")

    current_group = []
    prev_hero_crop = None
    group_idx = 1

    for idx, fname in enumerate(files):
        img_path = os.path.join(dir_path, fname)
        try:
            with Image.open(img_path) as img:
                w, h = img.size
                hero_crop = img.crop((int(w * 0.60), int(h * 0.14), int(w * 0.85), int(h * 0.28))).convert('L')

                if prev_hero_crop is None:
                    current_group.append(fname)
                    prev_hero_crop = hero_crop
                else:
                    diff = ImageChops.difference(prev_hero_crop, hero_crop)
                    stat = ImageStat.Stat(diff)
                    diff_score = stat.mean[0]

                    if diff_score > 15.0:  # New hero
                        move_group(dir_path, group_idx, current_group)
                        group_idx += 1
                        current_group = [fname]
                        prev_hero_crop = hero_crop
                    else:
                        current_group.append(fname)
        except Exception as e:
            print(f"Error on {fname}: {e}")

    if current_group:
        move_group(dir_path, group_idx, current_group)

    print(f"Finished organizing into {group_idx} folders.")

def move_group(base_dir, group_idx, files):
    folder_name = f"Hero_{group_idx:03d}"
    folder_path = os.path.join(base_dir, folder_name)
    os.makedirs(folder_path, exist_ok=True)
    
    for f in files:
        src = os.path.join(base_dir, f)
        dst = os.path.join(folder_path, f)
        shutil.move(src, dst)
    print(f"Moved {len(files)} files to {folder_name}")

if __name__ == '__main__':
    organize_screenshots()
