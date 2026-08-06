import json
import os
import re

json_path = r'C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_extracted_part7.json'

def load_data():
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except:
                return []
    return []

def save_data(data):
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def add_entry(entry):
    data = load_data()
    # Check if already exists by hero name to prevent duplicates if retried
    for i, d in enumerate(data):
        if d.get('hero') == entry.get('hero'):
            data[i] = entry
            save_data(data)
            return
    data.append(entry)
    save_data(data)

if __name__ == '__main__':
    print('Ready')
