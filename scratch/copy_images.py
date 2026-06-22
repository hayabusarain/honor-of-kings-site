import os
import shutil
from PIL import Image

src_dir = 'c:/Users/81901/Desktop/screenshots'
dest_dir = 'public/images/heroes'
os.makedirs(dest_dir, exist_ok=True)

for i in range(1, 113):
    hero_id = f"hero_{i:03d}"
    status_img = os.path.join(src_dir, f"{hero_id}_status.png")
    initial_img = os.path.join(src_dir, f"{hero_id}_initial.png")
    
    dest_path = os.path.join(dest_dir, f"{hero_id}.jpg")
    
    img_to_use = status_img if os.path.exists(status_img) else initial_img
    if os.path.exists(img_to_use):
        try:
            with Image.open(img_to_use) as img:
                rgb_im = img.convert('RGB')
                rgb_im.save(dest_path)
            print(f"Saved {dest_path}")
        except Exception as e:
            print(f"Failed to convert {img_to_use}: {e}")
            
