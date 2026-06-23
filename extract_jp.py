import json
import re

def get_jp(obj, jp):
    if isinstance(obj, dict):
        for v in obj.values():
            get_jp(v, jp)
    elif isinstance(obj, list):
        for v in obj:
            get_jp(v, jp)
    elif isinstance(obj, str) and re.search(r'[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]', obj):
        jp.add(obj)

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/chunk_1.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

jp = set()
get_jp(data, jp)

print(f'Found {len(jp)} unique Japanese strings.')
with open('c:/Users/81901/Desktop/オナーオブキングスサイト/jp_strings.json', 'w', encoding='utf-8') as out:
    json.dump(list(jp), out, ensure_ascii=False, indent=2)
