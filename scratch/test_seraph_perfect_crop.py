from PIL import Image
img = Image.open('./public/images/items/raw/スクリーンショット (91).png')
cropped = img.crop((1372, 237, 1462, 327))
cropped.save('./scratch/check_seraph_perfect.png')
print("Saved check_seraph_perfect.png")
