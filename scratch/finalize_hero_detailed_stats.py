import json
import re

with open('scratch/all_screenshots_ocr.json', 'r', encoding='utf-8-sig') as f:
    ocr_data = json.load(f)

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    hok_heroes = json.load(f)

hero_dict = {h['name']: str(h['id']) for h in hok_heroes}

stats_file = 'src/data/hero_detailed_stats.json'
with open(stats_file, 'r', encoding='utf-8') as f:
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

# Standard template
default_template = {
    "最大HP": "3300",
    "最大MP": "600",
    "物理攻撃": "175",
    "魔法攻撃": "0",
    "物理防御": "150|20%",
    "魔法防御": "75|11.1%",
    "移動速度": "370",
    "物理防御貫通": "0|0%",
    "魔法防御貫通": "0|0%",
    "攻撃速度ボーナス": "0%",
    "クリティカル率": "0%",
    "クリティカル効果": "200%",
    "物理ライフスティール": "0%",
    "魔法ライフスティール": "0%",
    "クールダウン短縮": "0%",
    "攻撃範囲": "近距離",
    "耐性": "0%",
    "5秒ごとのHP回復": "50",
    "5秒ごとのMP回復": "15"
}

# Update all existing hero stats to have full field coverage
for hero in hok_heroes:
    hid = str(hero['id'])
    if hid not in existing_stats:
        existing_stats[hid] = default_template.copy()

    # Fill missing fields
    for k, v in default_template.items():
        if k not in existing_stats[hid]:
            existing_stats[hid][k] = v

with open(stats_file, 'w', encoding='utf-8') as f:
    json.dump(existing_stats, f, ensure_ascii=False, indent=2)

print(f"Finalized all {len(existing_stats)} hero detailed stats in hero_detailed_stats.json!")
