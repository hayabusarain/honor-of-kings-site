import json
from difflib import get_close_matches
with open('jp_to_eng.json', 'r', encoding='utf-8') as f:
    mapping = json.load(f)
with open('eng_names.json', 'r', encoding='utf-8') as f:
    eng_names = json.load(f)

for jp, eng in mapping.items():
    if eng not in eng_names:
        closest = get_close_matches(eng, eng_names, n=1)
        print(f"NOT FOUND: {jp} -> {eng}. Closest: {closest}")
