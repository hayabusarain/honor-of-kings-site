import os
from PIL import Image

spells_dir = 'C:\\Users\\81901\\Pictures\\サモナースペル'
file_path = os.path.join(spells_dir, 'スクリーンショット (327).png')

if os.path.exists(file_path):
    img = Image.open(file_path)
    print(f"Dimensions: {img.size}")
    
    # Try cropping Row 1 Col 1 candidate box
    box = (100, 200, 200, 300)
    cropped = img.crop(box)
    cropped.save('scratch/test_spell_crop.png')
    print("Cropped test_spell_crop.png saved to scratch/")
else:
    print("File not found:", file_path)
