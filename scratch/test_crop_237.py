from PIL import Image

def do_crop(base, name):
    img = Image.open(f'./public/images/items/raw/{base}.png')
    cropped = img.crop((1372, 237, 1462, 327))
    cropped.save(f'./scratch/check_{name}_237.png')
    print(f"Saved check_{name}_237.png")

def main():
    do_crop('スクリーンショット (91)', 'seraph')
    do_crop('スクリーンショット (95)', 'banshee_veil')
    do_crop('スクリーンショット (109)', 'hydrant_core')

if __name__ == '__main__':
    main()
