import os
import json
import base64
import time
import requests
import sys

def get_access_token():
    key_path = 'key.json'
    if not os.path.exists(key_path):
        print('No key.json found.')
        return None
    from google.oauth2 import service_account
    creds = service_account.Credentials.from_service_account_file(
        key_path,
        scopes=['https://www.googleapis.com/auth/cloud-platform']
    )
    from google.auth.transport.requests import Request
    creds.refresh(Request())
    return creds.token

def parse_image_with_gemini(img_path, token):
    url = 'https://us-central1-aiplatform.googleapis.com/v1/projects/gen-lang-client-0899050472/locations/us-central1/publishers/google/models/gemini-1.5-pro-001:generateContent'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    prompt = '''
You are an expert OCR extractor. Look at this hero screen from Honor of Kings.
Extract the English Hero Name and their English Title (if any) located near their name.
If there is no title, leave it as null or empty.
Sometimes the title is right above or below the name, e.g. "Thunderous Deep" for a hero.
Return ONLY a valid JSON object with the schema:
{
  "hero_name": "...",
  "title": "..."
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
            return json.loads(out_text)
        else:
            print(f'API Error ({resp.status_code}):', resp.text[:200])
            return None
    except Exception as e:
        print(f'Request exception:', e)
        return None

def main():
    in_file = 'scratch/title_ocr_batch_4.json'
    out_file = 'scratch/title_ocr_result_4.json'

    token = get_access_token()
    if not token:
        print('No valid token.')
        return

    with open(in_file, 'r', encoding='utf-8') as f:
        items = json.load(f)

    results = []
    
    for idx, item in enumerate(items):
        img_path = item['image']
        print(f'[{idx+1}/{len(items)}] Processing {img_path}...')
        data = parse_image_with_gemini(img_path, token)
        if data:
            results.append(data)
            print(f'Extracted: {data}')
        else:
            results.append({'hero_name': 'Unknown', 'title': None})
            print(f'Failed to extract')
        time.sleep(1)

    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f'Done. Saved to {out_file}')

if __name__ == '__main__':
    main()
