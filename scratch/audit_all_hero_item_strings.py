import json
import os

p_ja = os.path.abspath(r'public\data\skills\ja.json')
p_items = os.path.abspath(r'src\data\hok_items.json')

with open(p_ja, 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

with open(p_items, 'r', encoding='utf-8') as f:
    hok_items = json.load(f)

# Master set of valid item names in hok_items.json
valid_item_names_ja = set()
valid_item_names_en = set()
valid_item_names_lower = set()

for it in hok_items:
    if it.get('name'):
        valid_item_names_ja.add(it['name'])
        valid_item_names_lower.add(it['name'].lower())
    if it.get('name_en'):
        valid_item_names_en.add(it['name_en'])
        valid_item_names_lower.add(it['name_en'].lower())
    if it.get('nameJa'):
        valid_item_names_ja.add(it['nameJa'])
        valid_item_names_lower.add(it['nameJa'].lower())

print(f"Loaded {len(valid_item_names_ja)} valid Japanese item names from hok_items.json.")

# Collect all unique item names used across all heroes
used_item_names = set()
unmatched_item_names = set()

for hid, hdata in ja_data.items():
    meta = hdata.get('meta', {})
    rec = meta.get('recommended_items', [])
    presets = meta.get('build_presets', [])
    
    all_hero_items = list(rec)
    for p in presets:
        all_hero_items.extend(p.get('items', []))
        
    for item_name in all_hero_items:
        used_item_names.add(item_name)
        if item_name not in valid_item_names_ja and item_name.lower() not in valid_item_names_lower:
            unmatched_item_names.add(item_name)

print(f"\nTotal unique item names used across heroes: {len(used_item_names)}")
print(f"Unmatched item names: {len(unmatched_item_names)}")

for un in sorted(unmatched_item_names):
    # Try finding close matches
    matches = [v for v in valid_item_names_ja if un[:2] in v or v[:2] in un]
    print(f"  Unmatched: '{un}' -> Candidates in hok_items.json: {matches}")
