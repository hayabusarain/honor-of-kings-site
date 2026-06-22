import os
import json
import re
from PIL import Image

def normalize_name(name):
    if not name:
        return ""
    name = re.sub(r'\s+', '', name)
    name = re.sub(r'[・＝\-\[\]\.]', '', name)
    name = re.sub(r'[ー]', '', name)
    return name.lower().strip()

def main():
    final_path = './src/data/physical_items_final.json'
    ext_dir = './scratch/extracted_items'
    raw_dir = './public/images/items/raw'
    crop_dir = './public/images/items/cropped'
    
    os.makedirs(crop_dir, exist_ok=True)
    
    if not os.path.exists(final_path):
        print(f"Error: {final_path} not found.")
        return
        
    with open(final_path, 'r', encoding='utf-8') as f:
        items = json.load(f)
        
    # Map normalized item names to their source screenshots by reading extracted JSONs
    item_to_screenshot = {}
    if os.path.exists(ext_dir):
        json_files = [f for f in os.listdir(ext_dir) if f.endswith('.json') and not f.endswith('.metadata.json')]
        for file in json_files:
            try:
                with open(os.path.join(ext_dir, file), 'r', encoding='utf-8') as f_in:
                    data = json.load(f_in)
                    name = data.get('item_name')
                    if name and name != 'null' and name != 'N/A' and name.strip() != '':
                        norm = normalize_name(name)
                        base = file.replace('.png.json', '').replace('.json', '')
                        
                        # We prefer the one that has gold price if multiple exist
                        item_gold = data.get('gold', 0)
                        if norm not in item_to_screenshot or item_gold > 0:
                            item_to_screenshot[norm] = base
            except Exception as e:
                print(f"Error reading {file}: {e}")

    print(f"Found screenshot mapping for {len(item_to_screenshot)} unique items.")

    # Helper function to check if item is boot
    def is_boot(name):
        return 'ブーツ' in name or 'スチールキャップ' in name or 'マーキュリー' in name or name == 'プロトベルト' or name == 'ステイシス'

    # Filter completed basic items
    cropped_count = 0
    for item in items:
        name_ja = item['nameJa']
        gold = item['gold']
        
        # Determine if basic item (Gold <= 500 and not a boot)
        if gold <= 500 and not is_boot(name_ja):
            norm = normalize_name(name_ja)
            screenshot_base = item_to_screenshot.get(norm)
            
            if screenshot_base:
                raw_img_path = os.path.join(raw_dir, f"{screenshot_base}.png")
                if os.path.exists(raw_img_path):
                    try:
                        img = Image.open(raw_img_path)
                        # Crop tight square of 90x90
                        # Coordinates: (1372, 226, 1462, 316)
                        cropped = img.crop((1372, 226, 1462, 316))
                        
                        # Safe file name
                        safe_name = re.sub(r'[^\w\-_]', '_', name_ja)
                        crop_img_filename = f"{safe_name}.png"
                        crop_img_path = os.path.join(crop_dir, crop_img_filename)
                        
                        cropped.save(crop_img_path)
                        print(f"Cropped icon for {name_ja} saved to {crop_img_path}")
                        
                        # Update the item image path in JSON (relative to public/ directory for frontend loading)
                        item['image'] = f"/images/items/cropped/{crop_img_filename}"
                        cropped_count += 1
                    except Exception as e:
                        print(f"Error cropping {name_ja} from {raw_img_path}: {e}")
                else:
                    print(f"Warning: Raw screenshot {raw_img_path} not found.")
            else:
                print(f"Warning: No screenshot mapping found for basic item {name_ja}")

    # Write updated items back to physical_items_final.json
    with open(final_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
        
    print(f"Finished cropping. Updated {cropped_count} basic items in database.")

if __name__ == "__main__":
    main()
