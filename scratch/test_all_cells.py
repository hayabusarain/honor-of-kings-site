import os
from PIL import Image

spells_dir = 'C:\\Users\\81901\\Pictures\\サモナースペル'
file_path = os.path.join(spells_dir, 'スクリーンショット (327).png')

if os.path.exists(file_path):
    img = Image.open(file_path)
    os.makedirs('scratch/spells_grid_test', exist_ok=True)
    
    # 3 rows, 4 columns candidate grid
    col_starts = [100, 210, 320, 430]
    row_starts = [200, 310, 420]
    
    for r_idx, r in enumerate(row_starts):
        for c_idx, c in enumerate(col_starts):
            box = (c, r, c + 100, r + 100)
            cropped = img.crop(box)
            cropped.save(f'scratch/spells_grid_test/r{r_idx+1}_c{c_idx+1}.png')
            print(f"Saved r{r_idx+1}_c{c_idx+1}.png: {box}")
else:
    print("File not found")
