import json
import os
import math

def create_chunks():
    en_path = 'public/data/skills/en.json'
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    # Filter heroes that have meta with synergy or counters
    heroes_to_translate = []
    for hid, hdata in en_data.items():
        if isinstance(hdata, dict) and 'meta' in hdata:
            meta = hdata['meta']
            needs_translation = False
            if 'synergy' in meta and isinstance(meta['synergy'], list):
                needs_translation = True
            if 'counters' in meta and isinstance(meta['counters'], list):
                needs_translation = True
            
            if needs_translation:
                # We only need to provide the hero ID, name (for context), and the meta arrays
                heroes_to_translate.append({
                    'hero_id': hid,
                    'hero_name': hdata.get('name', f'Hero {hid}'),
                    'meta': {
                        'synergy': meta.get('synergy', []),
                        'counters': meta.get('counters', [])
                    }
                })

    # Divide into 4 chunks
    num_chunks = 4
    chunk_size = math.ceil(len(heroes_to_translate) / num_chunks)
    
    os.makedirs('scratch/translation', exist_ok=True)
    
    for i in range(num_chunks):
        chunk = heroes_to_translate[i*chunk_size : (i+1)*chunk_size]
        with open(f'scratch/translation/chunk_{i+1}.json', 'w', encoding='utf-8') as f:
            json.dump(chunk, f, ensure_ascii=False, indent=2)
        print(f"Chunk {i+1}: {len(chunk)} heroes")

if __name__ == '__main__':
    create_chunks()
