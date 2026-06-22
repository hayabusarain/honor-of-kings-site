import os
from PIL import Image

spells_dir = 'C:\\Users\\81901\\Pictures\\サモナースペル'

def crop_grid(filename, output_name):
    file_path = os.path.join(spells_dir, filename)
    if os.path.exists(file_path):
        img = Image.open(file_path)
        # Crop grid area
        grid = img.crop((50, 150, 600, 600))
        grid.save(f'scratch/{output_name}.png')
        print(f"Saved scratch/{output_name}.png")
    else:
        print(f"File not found: {filename}")

crop_grid('スクリーンショット (327).png', 'grid_ghost')
crop_grid('スクリーンショット (331).png', 'grid_cleanse')
