import json
import urllib.request
import urllib.parse
import os
import glob
import time

def translate(text, source='zh-CN', target='ja'):
    if not text.strip():
        return text
    # Use Google Translate free API endpoint
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl={source}&tl={target}&dt=t&q={urllib.parse.quote(text)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return "".join([x[0] for x in result[0]])
    except Exception as e:
        print(f"Error translating '{text[:10]}...': {e}")
        return text

def process_files():
    directory = 'c:/Users/81901/Desktop/オナーオブキングスサイト/src/data/parsed_skills/'
    files = glob.glob(os.path.join(directory, 'champ_*.json'))
    count = 0
    
    print(f"Found {len(files)} files to check.")
    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                continue
        
        # Only process files that have the 'zh' and 'ja' arrays
        if 'zh' in data and 'ja' in data:
            print(f"Translating {os.path.basename(file)}...")
            changed = False
            for i in range(len(data['zh'])):
                zh_item = data['zh'][i]
                
                # Make sure ja array has the same structure
                if i >= len(data['ja']):
                    data['ja'].append(zh_item.copy())
                
                ja_item = data['ja'][i]
                
                if zh_item.get('name') and ja_item.get('name') == zh_item.get('name'):
                    ja_item['name'] = translate(zh_item['name'])
                    changed = True
                
                if zh_item.get('description') and ja_item.get('description') == zh_item.get('description'):
                    ja_item['description'] = translate(zh_item['description'])
                    changed = True
                    
            if changed:
                with open(file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                time.sleep(1.5)  # Sleep to prevent rate limiting
                count += 1
                
    print(f"Translation complete. Processed {count} files.")

if __name__ == '__main__':
    process_files()
