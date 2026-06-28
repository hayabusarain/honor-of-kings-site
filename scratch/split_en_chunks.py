import json
import math
import os

file_path = "c:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/en.json"
out_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks"

os.makedirs(out_dir, exist_ok=True)

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

items = list(data.items())
num_chunks = 10
chunk_size = math.ceil(len(items) / num_chunks)

for i in range(num_chunks):
    start = i * chunk_size
    end = min((i + 1) * chunk_size, len(items))
    chunk_items = items[start:end]
    
    if not chunk_items:
        break
        
    chunk_dict = dict(chunk_items)
    out_file = os.path.join(out_dir, f"en_chunk_{i+1}.json")
    
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(chunk_dict, f, ensure_ascii=False, indent=2)
        
    print(f"Created {out_file} with {len(chunk_items)} heroes.")
