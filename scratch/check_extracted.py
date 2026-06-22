import os
import json

base_dir = r"c:\Users\81901\Desktop\ワイリフサイト\scratch\extracted_items"
for i in range(46, 76):
    filename = f"スクリーンショット ({i}).json"
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            print(f"{i}: {data.get('item_name')} - {data.get('gold')} gold")
    else:
        print(f"{i}: File not found")
