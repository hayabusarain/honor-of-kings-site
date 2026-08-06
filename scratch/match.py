# -*- coding: utf-8 -*-
import json
import os

raw_path = r'C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\raw_extracted.json'
with open(raw_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Append 曜 manually
data.append({
  "hero": "曜",
  "win_rate": "58.79%",
  "victories": 5077,
  "items": [
    "グレートハイド",
    "抵抗の靴",
    "シャドーアックス",
    "猛攻の鎧",
    "グレートブレイカー",
    "マスターブレード"
  ],
  "spell": "スマイト",
  "arcanas": [
    "禍源",
    "変異",
    "隠匿"
  ]
})

with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_items.json', 'r', encoding='utf-8') as f:
    items_db = json.load(f)

with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_spells.json', 'r', encoding='utf-8') as f:
    spells_db = json.load(f)

with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_arcanas.json', 'r', encoding='utf-8') as f:
    arcanas_db = json.load(f)

def clean_str(s):
    return s.strip().replace('・', '').replace(' ', '').lower()

items_map = {}
for i in items_db:
    items_map[clean_str(i['name'])] = i['id']
    if 'aliases' in i:
        for a in i['aliases']:
            items_map[clean_str(a)] = i['id']

spells_map = {}
for i in spells_db:
    spells_map[clean_str(i['japanese_name'])] = i['id']

arcanas_map = {}
for i in arcanas_db:
    arcanas_map[clean_str(i['name'])] = i['id']

# Map and flag
for entry in data:
    matched_items = []
    for item in entry['items']:
        cl = clean_str(item)
        # some common fixes
        if cl == '鷹の目': cl = '鷹眼' # for arcana mostly, wait, item?
        if cl == '破魔の霊刀': cl = '破魔の霊力'
        if cl == 'グレートハイド': cl = 'グレートハイド' # Might not be in items_map
        if cl in items_map:
            matched_items.append({"name": item, "id": items_map[cl]})
        else:
            matched_items.append({"name": item, "id": "UNMATCHED"})
    entry['items_matched'] = matched_items
    
    cl_spell = clean_str(entry['spell'])
    if cl_spell in spells_map:
        entry['spell_matched'] = {"name": entry['spell'], "id": spells_map[cl_spell]}
    else:
        entry['spell_matched'] = {"name": entry['spell'], "id": "UNMATCHED"}
        
    matched_arcanas = []
    for arc in entry['arcanas']:
        cl = clean_str(arc)
        if cl == '鷹の目': cl = clean_str('鷹眼')
        if cl == '夢魘': cl = clean_str('夢魔')
        if cl in arcanas_map:
            matched_arcanas.append({"name": arc, "id": arcanas_map[cl], "count": 10})
        else:
            matched_arcanas.append({"name": arc, "id": "UNMATCHED", "count": 10})
    entry['arcanas_matched'] = matched_arcanas

out_path = r'C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_extracted_part7.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Done matching.')
