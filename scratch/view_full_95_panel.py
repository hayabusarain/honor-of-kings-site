from PIL import Image
img = Image.open('./public/images/items/raw/スクリーンショット (95).png')
img.crop((1300, 100, 1600, 600)).save('./scratch/check_95_panel.png')
print("Saved check_95_panel.png")
