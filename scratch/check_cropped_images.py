import os
from PIL import Image

def main():
    crop_dir = './public/images/items/cropped'
    if not os.path.exists(crop_dir):
        print("Cropped directory does not exist")
        return
        
    files = os.listdir(crop_dir)
    print(f"Total files in cropped directory: {len(files)}")
    
    # Check 15 files and print their resolution and if they are blank
    count = 0
    for file in sorted(files):
        if not file.endswith('.png'):
            continue
        path = os.path.join(crop_dir, file)
        size = os.path.getsize(path)
        try:
            img = Image.open(path)
            w, h = img.size
            print(f"{file}: size={size} bytes, resolution={w}x{h}")
        except Exception as e:
            print(f"{file}: error opening: {e}")
        count += 1
        if count >= 30:
            break

if __name__ == '__main__':
    main()
