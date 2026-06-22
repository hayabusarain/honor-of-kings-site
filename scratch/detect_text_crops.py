import os
import json
from PIL import Image

def analyze_crop(img_path):
    try:
        img = Image.open(img_path)
        img = img.convert('RGB')
        w, h = img.size
        
        # Count bright pixels (R > 180, G > 180, B > 180) in the right-middle area (where description text starts if cropped wrongly)
        bright_count = 0
        total_pixels = w * h
        for y in range(h):
            for x in range(w):
                r, g, b = img.getpixel((x, y))
                if r > 180 and g > 180 and b > 180:
                    bright_count += 1
                    
        ratio = bright_count / total_pixels
        return ratio
    except Exception as e:
        print(f"Error analyzing {img_path}: {e}")
        return 0.0

def main():
    crop_dir = './public/images/items/cropped'
    files = sorted([f for f in os.listdir(crop_dir) if f.endswith('.png')])
    
    suspicious = []
    for file in files:
        path = os.path.join(crop_dir, file)
        ratio = analyze_crop(path)
        if ratio > 0.03: # More than 3% bright white pixels usually indicates text inside the 90x90 box
            suspicious.append((file, ratio))
            
    print(f"Detected {len(suspicious)} suspicious crops:")
    for file, ratio in sorted(suspicious, key=lambda x: x[1], reverse=True):
        print(f"  {file}: white pixel ratio = {ratio:.4f}")

if __name__ == '__main__':
    main()
