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
                        if name.startswith('マーキュリー ') and name != 'マーキュリー ブーツ':
                            name = name.replace('マーキュリー ', '')
                        norm = normalize_name(name)
                        base = file.replace('.png.json', '').replace('.json', '')
                        
                        raw_img_exists = os.path.exists(os.path.join(raw_dir, f"{base}.png"))
                        if not raw_img_exists:
                            continue  # Skip if physical raw screenshot doesn't exist
                            
                        # Extract screenshot number, e.g. "スクリーンショット (236)" -> 236
                        num_match = re.search(r'\((\d+)\)', base)
                        scr_num = int(num_match.group(1)) if num_match else 99999
                        
                        item_gold = data.get('gold', 0)
                        if item_gold is None:
                            item_gold = 0
                        else:
                            try:
                                item_gold = int(item_gold)
                            except:
                                item_gold = 0

                        if norm not in item_to_screenshot:
                            item_to_screenshot[norm] = {
                                'base': base,
                                'num': scr_num,
                                'gold': item_gold
                            }
                        else:
                            prev = item_to_screenshot[norm]
                            
                            # Decide whether to overwrite:
                            # 1. Prefer the one with gold > 0 if the previous one didn't have it
                            # 2. If gold status is same, prefer the LOWER screenshot number (typically 1st screenshot before scrolling)
                            if item_gold > 0 and prev['gold'] == 0:
                                overwrite = True
                            elif item_gold == 0 and prev['gold'] > 0:
                                overwrite = False
                            else:
                                # Both have gold or both do not
                                overwrite = (scr_num < prev['num'])
                                
                            if overwrite:
                                item_to_screenshot[norm] = {
                                    'base': base,
                                    'num': scr_num,
                                    'gold': item_gold
                                }
            except Exception as e:
                print(f"Error reading {file}: {e}")

    # Convert mapping to plain dict for cropping
    item_to_screenshot_plain = {norm: val['base'] for norm, val in item_to_screenshot.items()}
    
    # Load manual overrides for baseName if specified
    overrides_path = './scratch/item_override_configs.json'
    if os.path.exists(overrides_path):
        try:
            with open(overrides_path, 'r', encoding='utf-8') as f_ov:
                overrides_data = json.load(f_ov)
                for key, val in overrides_data.items():
                    if 'baseName' in val:
                        norm_key = normalize_name(key)
                        item_to_screenshot_plain[norm_key] = val['baseName']
                        print(f"Overriding screenshot base in cropper for {key} -> {val['baseName']}")
        except Exception as e:
            print(f"Error loading overrides for baseName: {e}")
            
    print(f"Found screenshot mapping for {len(item_to_screenshot_plain)} unique items.")

    # Load overrides for custom crop boxes
    overrides = {}
    overrides_path = './scratch/item_override_configs.json'
    if os.path.exists(overrides_path):
        try:
            with open(overrides_path, 'r', encoding='utf-8') as f_ov:
                raw_overrides = json.load(f_ov)
                for k, v in raw_overrides.items():
                    overrides[k] = v
                    overrides[normalize_name(k)] = v
        except Exception as e:
            print(f"Error loading overrides: {e}")

    # Crop icons for ALL items
    cropped_count = 0
    evolved_items = {'セラフ エンブレイス', 'セラフエンブレイス', 'ムラマナ', 'フィンブルウィンター', '黒き霧の大鎌', '霊峰の砦'}
    for item in items:
        name_ja = item['nameJa']
        if name_ja in evolved_items:
            print(f"Skipping crop for evolved item: {name_ja} (keeps PC icon)")
            continue
        norm = normalize_name(name_ja)
        screenshot_base = item_to_screenshot_plain.get(norm)
        
        if screenshot_base:
            raw_img_path = os.path.join(raw_dir, f"{screenshot_base}.png")
            if os.path.exists(raw_img_path):
                try:
                    img = Image.open(raw_img_path)
                    
                    # Standard or custom crop coordinates
                    crop_box = (1372, 226, 1462, 316)
                    override = overrides.get(name_ja) or overrides.get(norm)
                    if override and 'crop_box' in override:
                        crop_box = tuple(override['crop_box'])
                        print(f"Using custom crop_box {crop_box} for {name_ja}")
                        
                    cropped = img.crop(crop_box)
                    
                    # Safe file name
                    safe_name = re.sub(r'[^\w\-_]', '_', name_ja)
                    crop_img_filename = f"{safe_name}.png"
                    crop_img_path = os.path.join(crop_dir, crop_img_filename)
                    
                    cropped.save(crop_img_path)
                    print(f"Cropped icon for {name_ja} saved to {crop_img_filename}")
                    
                    # Update the item image path in JSON (relative to public/ directory for frontend loading)
                    item['image'] = f"/images/items/cropped/{crop_img_filename}"
                    cropped_count += 1
                except Exception as e:
                    print(f"Error cropping {name_ja} from {raw_img_path}: {e}")
            else:
                print(f"Warning: Raw screenshot {raw_img_path} not found.")
        else:
            print(f"Warning: No screenshot mapping found for item {name_ja}")

    # Write updated items back to physical_items_final.json
    with open(final_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
        
    print(f"Finished cropping. Updated {cropped_count} items in database.")

if __name__ == "__main__":
    main()
