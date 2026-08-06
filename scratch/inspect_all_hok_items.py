import json

with open('src/data/hok_items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Total items in hok_items.json: {len(items)}")

for it in items:
    name_ja = it.get('name', '')
    name_en = it.get('name_en', '')
    name_cn = it.get('name_cn', '')
    iid = str(it.get('id', ''))
    icon = it.get('icon', '')
    print(f"ID: {iid:6s} | JA: {name_ja:20s} | EN: {name_en:25s} | ICON: {icon}")
