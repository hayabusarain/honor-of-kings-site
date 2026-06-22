import os
from PIL import Image

spells_dir = 'C:\\Users\\81901\\Pictures\\サモナースペル'
file_path = os.path.join(spells_dir, 'スクリーンショット (327).png')

if os.path.exists(file_path):
    img = Image.open(file_path)
    # Crop a vertical strip on the right side
    strip = img.crop((1350, 100, 1500, 900))
    strip.save('scratch/strip.png')
    print("Saved scratch/strip.png")
else:
    print("File not found")
