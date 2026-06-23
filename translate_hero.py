import json
import sys

def update_heroes(updated_data):
    file_path = 'c:/Users/81901/Desktop/オナーオブキングスサイト/chunk_4_translated.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for k, v in updated_data.items():
        # recursively update dict
        def update_dict(d, u):
            for key, value in u.items():
                if isinstance(value, dict):
                    d[key] = update_dict(d.get(key, {}), value)
                else:
                    d[key] = value
            return d
        
        data[k] = update_dict(data[k], v)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    updated = json.loads(sys.stdin.read())
    update_heroes(updated)
