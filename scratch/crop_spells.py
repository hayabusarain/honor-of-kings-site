import os
from PIL import Image

spells_dir = 'C:\\Users\\81901\\Pictures\\サモナースペル'
output_dir = './public/images/spells'
os.makedirs(output_dir, exist_ok=True)

# Spell mapping: (name, source_file, crop_box)
# Note: we use ghost screenshot (327) for other spells to get borderless, clean icons,
# and heal screenshot (328) for ghost itself since it's not selected there.
spells_config = [
    ('ghost', 'スクリーンショット (328).png', (100, 200, 200, 300)),
    ('heal', 'スクリーンショット (327).png', (210, 200, 310, 300)),
    ('barrier', 'スクリーンショット (327).png', (320, 200, 420, 300)),
    ('exhaust', 'スクリーンショット (327).png', (430, 200, 530, 300)),
    ('smite', 'スクリーンショット (327).png', (210, 310, 310, 410)),
    ('cleanse', 'スクリーンショット (327).png', (320, 310, 420, 410)),
    ('flash', 'スクリーンショット (327).png', (430, 310, 530, 410)),
    ('ignite', 'スクリーンショット (327).png', (210, 420, 310, 520)),
    ('teleport', 'スクリーンショット (327).png', (320, 420, 420, 520))
]

def main():
    print("Starting summoner spells icon cropping...")
    for name, filename, box in spells_config:
        src_path = os.path.join(spells_dir, filename)
        if os.path.exists(src_path):
            try:
                img = Image.open(src_path)
                cropped = img.crop(box)
                out_path = os.path.join(output_dir, f"{name}.png")
                cropped.save(out_path)
                print(f"Successfully cropped and saved {name}.png from {filename}")
            except Exception as e:
                print(f"Error cropping {name} from {filename}: {e}")
        else:
            print(f"Error: Source file not found: {src_path}")
    print("Cropping finished.")

if __name__ == '__main__':
    main()
