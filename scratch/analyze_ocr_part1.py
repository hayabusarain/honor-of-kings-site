import os
import json
import re
from difflib import SequenceMatcher

base_dir = r'C:\Users\81901\Pictures\Screenshots'
out_file = r'C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_extracted_part1.json'
json_dir = r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data'

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

with open(os.path.join(json_dir, 'hok_items.json'), encoding='utf-8') as f:
    items_data = json.load(f)
with open(os.path.join(json_dir, 'hok_arcanas.json'), encoding='utf-8') as f:
    arcanas_data = json.load(f)
with open(os.path.join(json_dir, 'hok_spells.json'), encoding='utf-8') as f:
    spells_data = json.load(f)

hero_map = {
    1: 'アーサー',
    2: 'アテナ',
    3: 'アタ',
    4: 'アンジェラ',
    5: 'ウーイェン',
    6: '雲中君',
    7: 'エリン',
    8: '王昭君',
    9: '海月',
    10: '海諾',
    11: '戈婭'
}

results = []
folders = [f for f in sorted(os.listdir(base_dir)) if f.startswith('Set_') and int(f.split('_')[1]) <= 11]

for folder in folders:
    num = int(folder.split('_')[1])
    ocr_file = os.path.join(base_dir, f'{folder}_ocr.txt')
    if not os.path.exists(ocr_file): continue
    with open(ocr_file, encoding='utf-8') as f:
        content = f.read()

    sections = content.split('FILE: ')
    
    hero_name = hero_map.get(num, "UNKNOWN_HERO")
    win_rate = "UNKNOWN_WINRATE"
    victories = "UNKNOWN_VICTORIES"
    
    items = []
    spell = "UNKNOWN_SPELL"
    arcanas = []

    win_matches = re.findall(r'勝\s*利\s*:\s*(\d+)\s*勝\s*率\s*:\s*([\d\.]+)\s*%', content)
    if win_matches:
        # Take the maximum victories one, since '一括使用' can be the popular one
        best_win = max(win_matches, key=lambda x: int(x[0]))
        victories = best_win[0]
        win_rate = best_win[1] + "%"
        
    for i in range(1, len(sections)):
        sec_text = sections[i].replace(' ', '').replace('・', '').replace('\n', '')
        
        # We find the best fuzzy match
        def find_best(data, name_field, return_field):
            best = None
            best_score = 0
            for item in data:
                c_clean = item[name_field].replace(' ', '')
                # Substring match
                if c_clean in sec_text:
                    if len(c_clean) > best_score:
                        best = item[return_field]
                        best_score = len(c_clean)
                else:
                    # check fuzzy match
                    # sliding window over sec_text
                    window = len(c_clean)
                    for j in range(len(sec_text) - window + 1):
                        sub = sec_text[j:j+window]
                        score = similar(c_clean, sub)
                        if score > 0.8 and score > best_score / 100.0:  # use a hack for score tracking
                            # we treat score as less than length match, but > 0.8 is good
                            pseudo_score = len(c_clean) * score
                            if pseudo_score > best_score:
                                best = item[return_field]
                                best_score = pseudo_score
            return best

        if 1 <= i <= 6:
            res = find_best(items_data, 'name', 'id')
            items.append(res if res else f"UNKNOWN_ITEM_{i}")
            
        elif i == 7:
            res = find_best(spells_data, 'japanese_name', 'id')
            spell = res if res else "UNKNOWN_SPELL"
            
        elif 8 <= i <= 10:
            res = find_best(arcanas_data, 'name', 'name')
            arcanas.append(res if res else f"UNKNOWN_ARCANA_{i}")

    results.append({
        "folder": folder,
        "hero": hero_name,
        "win_rate": win_rate,
        "victories": int(victories) if victories != "UNKNOWN_VICTORIES" else victories,
        "items": items,
        "spell": spell,
        "arcanas": [{"name": a, "count": 10} for a in arcanas]
    })

with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Extraction saved to {out_file}")
