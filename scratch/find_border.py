from PIL import Image

img = Image.open('./scratch/test_crop.png')
w, h = img.size

# Find the bounding box of gold border pixels
gold_pixels = []
for y in range(h):
    for x in range(w):
        r, g, b = img.getpixel((x, y))[:3]
        # Gold/yellow-ish border detection
        if r > 120 and g > 90 and b < 60:
            gold_pixels.append((x, y))

if gold_pixels:
    min_x = min(p[0] for p in gold_pixels)
    max_x = max(p[0] for p in gold_pixels)
    min_y = min(p[1] for p in gold_pixels)
    max_y = max(p[1] for p in gold_pixels)
    print(f"Inside test_crop.png: X range: {min_x} to {max_x}, Y range: {min_y} to {max_y}")
    print(f"Absolute coordinates in 1920x1080 screenshot: X: {1350 + min_x} to {1350 + max_x}, Y: {200 + min_y} to {200 + max_y}")
else:
    print("No gold pixels found.")
