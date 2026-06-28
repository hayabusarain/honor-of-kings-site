import json
import re

file_path = 'src/data/hok_heroes.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for h in data:
    en_name = h.get('name_en', '')
    if en_name:
        # Convert to lowercase and replace non-alphanumeric with hyphen
        slug = re.sub(r'[^a-z0-9]+', '-', en_name.lower()).strip('-')
        h['slug'] = slug

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Generated slugs in hok_heroes.json")
