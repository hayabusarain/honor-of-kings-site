import json
import os
import math

def chunk_ocr_tasks():
    with open('scratch/ocr_mapping.json', 'r', encoding='utf-8') as f:
        mapping = json.load(f)
        
    num_chunks = 15
    chunk_size = math.ceil(len(mapping) / num_chunks)
    
    os.makedirs('scratch/ocr', exist_ok=True)
    
    for i in range(num_chunks):
        chunk = mapping[i*chunk_size : (i+1)*chunk_size]
        with open(f'scratch/ocr/chunk_{i+1}_meta.json', 'w', encoding='utf-8') as f:
            json.dump(chunk, f, indent=2)
        print(f"Chunk {i+1}: {len(chunk)} folders")

if __name__ == '__main__':
    chunk_ocr_tasks()
