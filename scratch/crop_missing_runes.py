import os
from PIL import Image

screenshot_path = 'C:\\Users\\81901\\Pictures\\ルーン\\スクリーンショット (355).png'
output_dir = './public/images/runes'
os.makedirs(output_dir, exist_ok=True)

crops = [
    {
        'name': 'chain_assault.png',
        'box': (530, 265, 640, 375)  # slot1
    },
    {
        'name': 'tyrant.png',
        'box': (530, 483, 640, 593)  # slot2
    }
]

if os.path.exists(screenshot_path):
    img = Image.open(screenshot_path)
    for crop in crops:
        cropped = img.crop(crop['box'])
        dest_path = os.path.join(output_dir, crop['name'])
        cropped.save(dest_path)
        print(f"Successfully cropped {crop['name']} to {dest_path}")
else:
    print(f"Error: Screenshot not found: {screenshot_path}")
