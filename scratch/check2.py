import json
import os

with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

for set_num in ['067', '083']:
    ocr_file = f'C:\\Users\\81901\\Pictures\\Screenshots\\Set_{set_num}_UNKNOWN_4{set_num if set_num=="083" else "683"}{"59-4869" if set_num=="083" else "-4693"}_ocr.txt'
    # Wait the file name for 083 is Set_083_UNKNOWN_4859-4869_ocr.txt
    if set_num == '067': ocr_file = r'C:\Users\81901\Pictures\Screenshots\Set_067_UNKNOWN_4683-4693_ocr.txt'
    elif set_num == '083': ocr_file = r'C:\Users\81901\Pictures\Screenshots\Set_083_UNKNOWN_4859-4869_ocr.txt'
    
    with open(ocr_file, 'r', encoding='utf-8') as f:
        txt = f.read().replace(' ', '').replace('\n', '')
    
    matched = None
    for h in heroes:
        name = h['name']
        alias = h.get('search_alias', '')
        if name in txt or (alias and alias in txt):
            matched = name
            break
    
    if not matched:
        # let's try some partial
        for h in heroes:
            for al in h.get('search_alias', '').split('・'):
                if len(al) > 2 and al in txt:
                    matched = h['name']
                    break
            if matched: break
            
    print(f'Set {set_num} matched: {matched.encode("utf-8") if matched else "None"}')
