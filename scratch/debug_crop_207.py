from PIL import Image
img = Image.open('./public/images/items/raw/スクリーンショット (207).png')
cropped = img.crop((1300, 150, 1600, 450))
cropped.save('./scratch/debug_crop_207.png')
print("Saved debug_crop_207.png")
