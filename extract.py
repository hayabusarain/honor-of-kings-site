import json

def extract(obj, strings):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ['hero_id', 'icon', 'values']: continue
            extract(v, strings)
    elif isinstance(obj, list):
        for i in obj:
            extract(i, strings)
    elif isinstance(obj, str):
        if not obj.startswith('/images') and not obj.replace('.', '').replace('%', '').replace('-', '').isdigit():
            strings.add(obj)

data = json.load(open('c:/Users/81901/Desktop/オナーオブキングスサイト/chunk_4.json', encoding='utf-8'))
strings = set()
extract(data, strings)
with open('c:/Users/81901/Desktop/オナーオブキングスサイト/strings.json', 'w', encoding='utf-8') as f:
    json.dump(list(strings), f, ensure_ascii=False, indent=2)
