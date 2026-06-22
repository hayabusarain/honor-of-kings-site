from PIL import Image
img = Image.open('./public/images/items/raw/スクリーンショット (91).png')
img.crop((1300, 100, 1600, 600)).save('./scratch/check_91_panel.png')
print("Saved check_91_panel.png")
