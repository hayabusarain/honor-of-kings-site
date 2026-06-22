import os
from PIL import Image

screenshot_path = 'C:\\Users\\81901\\Pictures\\ルーン\\スクリーンショット (354).png'
if os.path.exists(screenshot_path):
    img = Image.open(screenshot_path)
    print(f"Image size: {img.size}")
else:
    print("Screenshot not found")
