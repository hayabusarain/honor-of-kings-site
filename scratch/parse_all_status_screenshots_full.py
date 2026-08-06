import json
import re

with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

hero_dict = {h['name']: str(h['id']) for h in hok_heroes}

with open('src/data/hero_detailed_stats.json', 'r', encoding='utf-8') as f:
    existing_stats = json.load(f)

# Identify pairs
pairs = []
i = 0
while i < len(ocr_data):
    filename = ocr_data[i]['filename']
    text_clean = ocr_data[i]['text'].replace(' ', '').replace('　', '')
    num_match = re.search(r'\((\d+)\)', filename)
    num = int(num_match.group(1)) if num_match else 0

    if num == 3430:
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

print(f"Parsing stats for {len(pairs)} heroes...")

def parse_hero_stats(raw, hid):
    stat = existing_stats.get(hid, {}).copy()

    # Move speed (e.g., 350-400)
    ms = re.search(r'\b(3[5-9]\d|4\d\d)\b', raw)
    if ms:
        stat['移動速度'] = ms.group(1)

    # HP (e.g., 3000-4500)
    hp = re.search(r'(\d{4}\s*\(\s*\d{4}\s*\+\s*\d+\s*\)|\d{4})', raw)
    if hp:
        val = hp.group(1).replace(' ', '')
        if 2800 <= int(re.sub(r'\(.*', '', val)) <= 4600:
            stat['最大HP'] = val

    # Physical Attack (e.g., 150-220)
    ad = re.search(r'(\d{3}\s*\(\s*\d{3}\s*\+\s*\d+\s*\))', raw)
    if ad:
        stat['物理攻撃'] = ad.group(1).replace(' ', '')
    else:
        # Fallback 3 digit numbers
        ad_nums = re.findall(r'\b(1[5-9]\d|2[0-1]\d)\b', raw)
        if ad_nums:
            stat['物理攻撃'] = ad_nums[0]

    # Defense & Magic Defense
    stat['物理防御'] = "150|20%"
    stat['魔法防御'] = "75|11.1%"

    return stat

updated = 0
for p in pairs:
    hid = p['hero_id']
    st = parse_hero_stats(p['status_raw'], hid)
    if st:
        existing_stats[hid] = st
        updated += 1

print(f"Updated {updated} heroes in hero_detailed_stats.json.")

with open('src/data/hero_detailed_stats.json', 'w', encoding='utf-8') as f:
    json.dump(existing_stats, f, ensure_ascii=False, indent=2)

print("Saved hero_detailed_stats.json successfully!")
