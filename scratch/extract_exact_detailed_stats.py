import json
import re

# Load OCR data and Hero DB
with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

hero_dict = {h['name']: str(h['id']) for h in hok_heroes}

# Load current detailed stats
stats_file = 'src/data/hero_detailed_stats.json'
with open(stats_file, 'r', encoding='utf-8') as f:
    existing_stats = json.load(f)

print(f"Loaded {len(ocr_data)} OCR items, {len(hero_dict)} hero DB entries, {len(existing_stats)} existing stats.")

# Identify pairs
pairs = []
i = 0
while i < len(ocr_data):
    filename = ocr_data[i]['filename']
    text_clean = ocr_data[i]['text'].replace(' ', '').replace('　', '')
    num_match = re.search(r'\((\d+)\)', filename)
    num = int(num_match.group(1)) if num_match else 0

    if num == 3430:
        # Special case for Ata (3430)
        pairs.append({
            "hero_name": "アタ",
            "hero_id": "620",
            "status_file": filename,
            "status_raw": ocr_data[i]['text']
        })
        i += 1
        continue

    found_name = None
    found_id = None
    for hname, hid in hero_dict.items():
        if hname in text_clean:
            found_name = hname
            found_id = hid
            break

    if found_name and (i + 1) < len(ocr_data):
        pairs.append({
            "hero_name": found_name,
            "hero_id": found_id,
            "status_file": ocr_data[i + 1]['filename'],
            "status_raw": ocr_data[i + 1]['text']
        })
        i += 2
    else:
        i += 1

print(f"Identified {len(pairs)} pairs for status parsing.")

# Helper to extract regex patterns from raw OCR text
def parse_stats_from_text(raw_text, hero_id):
    # Retrieve current stats template
    base = existing_stats.get(hero_id, {}).copy()
    
    # 1. HP (e.g. "3820 ( 3700 + 120 )" or "3280")
    hp_match = re.search(r'HP\s*(\d+(?:\s*\(\s*\d+\s*\+\s*\d+\s*\))?)', raw_text, re.IGNORECASE)
    if hp_match:
        val = hp_match.group(1).replace(' ', '')
        base['最大HP'] = val

    # 2. MP (e.g. "600" or "580")
    mp_match = re.search(r'MP\s*(\d+)', raw_text, re.IGNORECASE)
    if mp_match:
        base['最大MP'] = mp_match.group(1)

    # 3. 物理攻撃 (e.g. "186 ( 176 + 10 )" or "191")
    ad_match = re.search(r'物理攻撃\s*(\d+(?:\s*\(\s*\d+\s*\+\s*\d+\s*\))?)', raw_text)
    if ad_match:
        base['物理攻撃'] = ad_match.group(1).replace(' ', '')

    # 4. 魔法攻撃 (e.g. "10 ( 0 + 10 )" or "0")
    ap_match = re.search(r'魔法攻撃\s*(\d+(?:\s*\(\s*\d+\s*\+\s*\d+\s*\))?)', raw_text)
    if ap_match:
        base['魔法攻撃'] = ap_match.group(1).replace(' ', '')

    # 5. 移動速度 (e.g. "390", "375", "365")
    ms_match = re.search(r'移動速度\s*(\d+)', raw_text)
    if ms_match:
        base['移動速度'] = ms_match.group(1)

    # 6. 物理防御 (e.g. "150|20%" or "150 20%")
    def_match = re.search(r'物理防御\s*(\d+[\s\|]+[\d\.]+\%)', raw_text)
    if def_match:
        base['物理防御'] = def_match.group(1).replace(' ', '').replace('|', '|')

    # 7. 魔法防御 (e.g. "75|11.1%" or "75 11.1%")
    mdef_match = re.search(r'魔法防御\s*(\d+[\s\|]+[\d\.]+\%)', raw_text)
    if mdef_match:
        base['魔法防御'] = mdef_match.group(1).replace(' ', '').replace('|', '|')

    return base

updated_count = 0
for p in pairs:
    hid = p['hero_id']
    new_stat = parse_stats_from_text(p['status_raw'], hid)
    if new_stat:
        existing_stats[hid] = new_stat
        updated_count += 1

print(f"Updated {updated_count} heroes in detailed stats dictionary.")

with open(stats_file, 'w', encoding='utf-8') as f:
    json.dump(existing_stats, f, ensure_ascii=False, indent=2)

print("Saved updated hero_detailed_stats.json successfully!")
