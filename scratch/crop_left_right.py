import os
from PIL import Image

spells_dir = 'C:\\Users\\81901\\Pictures\\サモナースペル'
file_path = os.path.join(spells_dir, 'スクリーンショット (327).png')

if os.path.exists(file_path):
    img = Image.open(file_path)
    left = img.crop((0, 0, 960, 1080))
    right = img.crop((960, 0, 1920, 1080))
    left.save('scratch/left.png')
    right.save('scratch/right.png')
    print("Saved scratch/left.png and scratch/right.png")
else:
    print("File not found")
