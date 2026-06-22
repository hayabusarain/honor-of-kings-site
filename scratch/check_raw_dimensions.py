import os
from PIL import Image

def main():
    raw_dir = './public/images/items/raw'
    if not os.path.exists(raw_dir):
        print("Raw directory does not exist")
        return
        
    files = [f for f in os.listdir(raw_dir) if f.endswith('.png')]
    print(f"Total raw files: {len(files)}")
    
    resolutions = {}
    for file in files:
        path = os.path.join(raw_dir, file)
        try:
            with Image.open(path) as img:
                res = img.size
                resolutions[res] = resolutions.get(res, 0) + 1
        except Exception as e:
            print(f"Error reading {file}: {e}")
            
    print("Resolution distribution:")
    for res, count in resolutions.items():
        print(f"  {res}: {count}")

if __name__ == '__main__':
    main()
