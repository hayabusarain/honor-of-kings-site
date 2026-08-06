import json
with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)
with open(r'C:\Users\81901\Pictures\Screenshots\Set_083_UNKNOWN_4859-4869_ocr.txt', 'r', encoding='utf-8') as f:
    txt = f.read().replace(' ', '').replace('\n', '')

for h in heroes:
    furi = h.get('search_alias', '')
    if not furi: continue
    for word in furi.split('・'):
        if len(word) >= 2 and word in txt:
            print(f"Match: {word} -> {h['name'].encode('utf-8')}")
