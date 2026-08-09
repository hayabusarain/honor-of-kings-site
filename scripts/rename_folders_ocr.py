import os
import json
import base64
import time
import requests
import re
import shutil
import subprocess

def get_access_token():
    try:
        token = subprocess.check_output(['gcloud', 'auth', 'print-access-token'], text=True).strip()
        return token
    except Exception as e:
        print(f'Failed to get gcloud token: {e}')
        return None

def get_hero_name_ocr(img_path, token):
    url = 'https://us-central1-aiplatform.googleapis.com/v1/projects/gen-lang-client-0899050472/locations/us-central1/publishers/google/models/gemini-1.5-flash-001:generateContent'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    prompt = '''
You are an expert OCR extractor. Look at this hero screen from Honor of Kings.
Extract the English Hero Name. It is usually the largest text on the screen, often next to a title.
Return ONLY a valid JSON object with the schema:
{
  "hero_name": "Hero Name Here"
}
'''

    try:
        with open(img_path, 'rb') as f:
            b64 = base64.b64encode(f.read()).decode('utf-8')
    except Exception as e:
        print(f'Error loading {img_path}: {e}')
        return None

    payload = {
        'contents': [{'role': 'user', 'parts': [{'text': prompt}, {'inlineData': {'mimeType': 'image/png', 'data': b64}}]}],
        'generationConfig': {'temperature': 0.0, 'responseMimeType': 'application/json'}
    }

    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=60)
        if resp.status_code == 200:
            res_json = resp.json()
            out_text = res_json['candidates'][0]['content']['parts'][0]['text']
            # Clean potential markdown from response
            out_text = out_text.replace('```json', '').replace('```', '').strip()
            return json.loads(out_text).get('hero_name', 'Unknown')
        else:
            print(f'API Error ({resp.status_code}):', resp.text[:200])
            return None
    except Exception as e:
        print(f'Request exception:', e)
        return None

def sanitize_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name).strip()

def main():
    base_dir = r'C:\Users\81901\Desktop\オナキンENヒーロー\Screenshots'
    token = get_access_token()
    if not token:
        print("Cannot proceed without token.")
        return

    folders = [f for f in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, f)) and f.startswith('Hero_')]
    folders.sort()

    print(f"Found {len(folders)} Hero folders to rename.")

    cache_file = 'scratch/ocr_rename_cache.json'
    if os.path.exists(cache_file):
        with open(cache_file, 'r', encoding='utf-8') as f:
            cache = json.load(f)
    else:
        cache = {}

    success_count = 0

    for idx, folder in enumerate(folders):
        folder_path = os.path.join(base_dir, folder)
        files = [f for f in os.listdir(folder_path) if f.endswith('.png') or f.endswith('.jpg')]
        if not files:
            print(f"[{idx+1}/{len(folders)}] Skipping {folder}: No images found.")
            continue
        
        files.sort()
        first_img = os.path.join(folder_path, files[0])
        
        if folder in cache:
            hero_name = cache[folder]
            print(f"[{idx+1}/{len(folders)}] {folder} -> (Cached) {hero_name}")
        else:
            print(f"[{idx+1}/{len(folders)}] OCR for {folder}...")
            hero_name = get_hero_name_ocr(first_img, token)
            
            if not hero_name or hero_name == "Unknown":
                print(f" -> Failed to extract name. Skipping rename.")
                continue
                
            cache[folder] = hero_name
            os.makedirs('scratch', exist_ok=True)
            with open(cache_file, 'w', encoding='utf-8') as f:
                json.dump(cache, f, ensure_ascii=False, indent=2)
                
            print(f" -> Extracted: {hero_name}")
            time.sleep(1)

        safe_name = sanitize_filename(hero_name)
        new_folder_path = os.path.join(base_dir, safe_name)
        
        if safe_name == folder:
            continue
            
        if os.path.exists(new_folder_path):
            print(f" -> Cannot rename to {safe_name}: Folder already exists! (Duplicate hero?)")
            alt_name = f"{safe_name}_{folder}"
            new_folder_path = os.path.join(base_dir, alt_name)
            
        try:
            os.rename(folder_path, new_folder_path)
            print(f" -> Renamed {folder} to: {os.path.basename(new_folder_path)}")
            success_count += 1
        except Exception as e:
            print(f" -> Failed to rename: {e}")

    print(f"Done! Renamed {success_count} folders.")

if __name__ == '__main__':
    main()
