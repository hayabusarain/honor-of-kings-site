from PIL import Image

def find_border_in_screenshot(img_path):
    img = Image.open(img_path)
    w, h = img.size
    
    # We inspect the region around X=1350 to 1480, Y=200 to 350
    gold_pixels = []
    for y in range(200, 350):
        for x in range(1350, 1480):
            r, g, b = img.getpixel((x, y))[:3]
            # Gold border detection
            if r > 120 and g > 90 and b < 60:
                gold_pixels.append((x, y))
                
    if gold_pixels:
        min_x = min(p[0] for p in gold_pixels)
        max_x = max(p[0] for p in gold_pixels)
        min_y = min(p[1] for p in gold_pixels)
        max_y = max(p[1] for p in gold_pixels)
        print(f"{img_path}: X range: {min_x} to {max_x}, Y range: {min_y} to {max_y}")
    else:
        print(f"{img_path}: No gold pixels found.")

def main():
    find_border_in_screenshot('./public/images/items/raw/スクリーンショット (109).png')
    find_border_in_screenshot('./public/images/items/raw/スクリーンショット (95).png')
    find_border_in_screenshot('./public/images/items/raw/スクリーンショット (91).png')
    find_border_in_screenshot('./public/images/items/raw/スクリーンショット (207).png') # Trinity Force
    find_border_in_screenshot('./public/images/items/raw/スクリーンショット (193).png') # Nashor's Tooth
    find_border_in_screenshot('./public/images/items/raw/スクリーンショット (142).png') # Sunfire Aegis

if __name__ == '__main__':
    main()
