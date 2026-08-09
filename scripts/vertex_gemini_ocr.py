import os
import json
import base64
import time
import requests
import sys
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import datetime
from unittest.mock import patch

def get_access_token():
    key_path = 'key.json'
    if not os.path.exists(key_path):
        print("No key.json found.")
        return None
    from google.oauth2 import service_account
    creds = service_account.Credentials.from_service_account_file(
        key_path,
        scopes=['https://www.googleapis.com/auth/cloud-platform']
    )
    from google.auth.transport.requests import Request
    creds.refresh(Request())
    return creds.token

def parse_hero_group_with_gemini(group, token):
    url = "https://us-central1-aiplatform.googleapis.com/v1/projects/gen-lang-client-0899050472/locations/us-central1/publishers/google/models/gemini-1.5-pro-001:generateContent"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    base_dir = r"C:\Users\81901\Desktop\オナキンENヒーロー\Screenshots"
    images = [os.path.join(base_dir, f) for f in group['files'] if os.path.exists(os.path.join(base_dir, f))]

    if not images:
        return None

    prompt = """
You are an expert game data OCR extractor for Honor of Kings.
Read the provided screenshots of a SINGLE hero's skill screens.
Extract ONLY the exact text visible in the images. DO NOT guess or fabricate missing data.

IMPORTANT RULE: A single screenshot typically shows up to 5 skills (1 Passive + 4 Active Skills). 
If the images contain a hero with multiple forms (e.g., Mulan, Li Xin, Pei), extract ALL of their skills by combining the information from all provided screenshots for this hero.

Return ONLY a valid JSON object with the following schema:
{
  "hero_name": "Exact Hero Name visible in upper right",
  "skills": [
    {
      "skill_type": "Passive / Skill 1 / Skill 2 / Skill 3 / Skill 4",
      "skill_name": "Exact Skill Title",
      "cd": "Cooldown text (e.g. CD: 12s)",
      "mana_cost": "Mana Cost text (e.g. Mana Cost: 40)",
      "description": "Full description text matching image text exactly",
      "visible_growth_table": "Values visible in table as a JSON object, e.g. {\"Base Damage\": [\"100\", \"120\"]}"
    }
  ]
}
"""

    parts = [{"text": prompt}]
    for img_path in images:
        try:
            with open(img_path, "rb") as f:
                b64 = base64.b64encode(f.read()).decode('utf-8')
            parts.append({"inlineData": {"mimeType": "image/png", "data": b64}})
        except Exception as e:
            print(f"Error loading {img_path}: {e}")

    payload = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {"temperature": 0.0, "responseMimeType": "application/json"}
    }

    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=60)
        if resp.status_code == 200:
            res_json = resp.json()
            out_text = res_json['candidates'][0]['content']['parts'][0]['text']
            return json.loads(out_text)
        else:
            print(f"API Error ({resp.status_code}):", resp.text[:200])
            return None
    except Exception as e:
        print(f"Request exception for group {group['group_id']}:", e)
        return None

def main():
    if len(sys.argv) != 4:
        print("Usage: python vertex_gemini_ocr.py <start_idx> <end_idx> <out_file>")
        sys.exit(1)
        
    start_idx = int(sys.argv[1])
    end_idx = int(sys.argv[2])
    out_file = sys.argv[3]

    token = get_access_token()
    if not token:
        print("Aborting Gemini Vision OCR: No valid token.")
        return

    with open('scratch/ocr_v2/hero_groups.json', 'r', encoding='utf-8') as f:
        groups = json.load(f)

    print(f"Loaded {len(groups)} hero groups. Processing indices {start_idx} to {end_idx}...")

    results = {}
    batch_groups = groups[start_idx:end_idx]
    
    for idx, group in enumerate(batch_groups):
        gid = group['group_id']
        print(f"[{idx+1}/{len(batch_groups)}] Processing Hero Group {gid} ({len(group['files'])} screenshots)...")
        data = parse_hero_group_with_gemini(group, token)
        if data:
            results[f"hero_group_{gid:03d}"] = data
            print(f"Success Extracted Hero: {data.get('hero_name', 'Unknown')}".encode('ascii', 'replace').decode('ascii'))
        else:
            print(f"Failed to extract Hero Group {gid}")
        time.sleep(1)

    os.makedirs(os.path.dirname(out_file) or '.', exist_ok=True)
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"Batch processing complete. Output written to {out_file}")

if __name__ == '__main__':
    main()
