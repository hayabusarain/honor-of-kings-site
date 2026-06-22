from PIL import Image
import os

def test_crop(base_name, override_box=None):
    raw_path = f'./public/images/items/raw/{base_name}.png'
    if not os.path.exists(raw_path):
        print(f"{raw_path} not found")
        return
        
    img = Image.open(raw_path)
    
    # 1. Default box (1372, 226, 1462, 316)
    cropped_def = img.crop((1372, 226, 1462, 316))
    cropped_def.save(f'./scratch/check_{base_name.replace("スクリーンショット (", "").replace(")", "")}_def.png')
    
    # 2. Override box if provided
    if override_box:
        cropped_ov = img.crop(tuple(override_box))
        cropped_ov.save(f'./scratch/check_{base_name.replace("スクリーンショット (", "").replace(")", "")}_ov.png')
        
    # 3. Detect best border box
    gold_pixels = []
    for y in range(200, 350):
        for x in range(1350, 1480):
            r, g, b = img.getpixel((x, y))[:3]
            if r > 120 and g > 90 and b < 60:
                gold_pixels.append((x, y))
    if gold_pixels:
        min_x = min(p[0] for p in gold_pixels)
        max_x = max(p[0] for p in gold_pixels)
        min_y = min(p[1] for p in gold_pixels)
        max_y = max(p[1] for p in gold_pixels)
        print(f"{base_name}: detected border box X: {min_x}-{max_x}, Y: {min_y}-{max_y}")
        # Crop using detected border box
        cropped_det = img.crop((min_x, min_y, max_x + 1, max_y + 1))
        # Resize to 90x90
        cropped_det_res = cropped_det.resize((90, 90))
        cropped_det_res.save(f'./scratch/check_{base_name.replace("スクリーンショット (", "").replace(")", "")}_det.png')

def main():
    os.makedirs('./scratch', exist_ok=True)
    test_crop('スクリーンショット (91)', [1372, 218, 1462, 308]) # Seraph's Embrace
    test_crop('スクリーンショット (95)', [1372, 218, 1462, 308]) # Banshee's Veil
    test_crop('スクリーンショット (109)', [1372, 218, 1462, 308]) # Hydrant Core

if __name__ == '__main__':
    main()
