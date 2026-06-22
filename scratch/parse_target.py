import os
import sys
import json
import time
import glob
from google import genai
from PIL import Image

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"

client = genai.Client(
    vertexai=True,
    project="gen-lang-client-0899050472",
    location="us-central1"
)

MODEL_NAME = 'gemini-2.5-flash'

def extract_with_retry(contents):
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=contents,
        )
        return response
    except Exception as e:
        print(f"RAW ERROR: {e}")
        raise e

def parse_skill(images, skill_id):
    prompt = f"""
あなたはOCRシステムです。提供された画像（スキルのテキスト詳細画面、およびテーブル画面）を正確に読み取り、以下のJSONスキーマに従って出力してください。

【厳守ルール】
1. パッシブスキルのクールタイム等が存在する場合は、必ず `cooldown_text` に記載すること。存在しない場合は null。
2. 画像のテキスト・数値をそのまま書き写すこと（PC版知識に基づく補完や変更は絶対にNG）。画像に書かれている通りに抽出してください。
3. `table.rows` は `{{ "label": "...", "values": ["..."] }}` の形式で保存すること。
4. 出力は絶対にJSON形式のみとし、Markdownの ```json などのブロックは含めず、純粋なJSON文字列だけを返してください。

【JSONスキーマ】
{{
  "id": "{skill_id}",
  "name": "スキル名",
  "tags": ["タグ1", "タグ2"],
  "cooldown_text": "〇秒",
  "description": "スキルの説明文。<br>で改行すること。",
  "table": {{
    "headers": ["LV 1", "LV 2", "LV 3", "LV 4"],
    "rows": [
      {{ "label": "基本ダメージ", "values": ["40", "80", "120", "160"] }}
    ]
  }}
}}
※テーブルがない場合は "table": null とすること。
"""
    
    print(f"[{skill_id}] Extracting...")
    contents = [prompt] + images
    response = extract_with_retry(contents)
    raw_json = response.text.strip()
    
    if raw_json.startswith("```json"):
        raw_json = raw_json[7:-3].strip()
    elif raw_json.startswith("```"):
        raw_json = raw_json[3:-3].strip()
        
    return json.loads(raw_json)

def process_champion(champ_prefix):
    base_dir = os.path.join(os.path.dirname(__file__), 'screenshots')
    out_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src', 'data', 'parsed_skills')
    os.makedirs(out_dir, exist_ok=True)
    
    out_path = os.path.join(out_dir, f"{champ_prefix}.json")
    skills = []
    
    skill_types = [
        ('P', 'passive'),
        ('Q', 'skill1'),
        ('W', 'skill2'),
        ('E', 'skill3'),
        ('R', 'ult')
    ]
    
    found_any = False
    for skill_id, skill_name in skill_types:
        text_img_path = os.path.join(base_dir, f"{champ_prefix}_{skill_name}_text.png")
        table_img_path = os.path.join(base_dir, f"{champ_prefix}_{skill_name}_table.png")
        
        images = []
        if os.path.exists(text_img_path):
            images.append(Image.open(text_img_path))
        if os.path.exists(table_img_path):
            images.append(Image.open(table_img_path))
            
        if not images:
            print(f"[{champ_prefix}] No images found for {skill_id}")
            continue
            
        found_any = True
        try:
            skill_data = parse_skill(images, skill_id)
            skills.append(skill_data)
            time.sleep(4) 
        except Exception as e:
            print(f"Error parsing {champ_prefix} {skill_id}: {e}")
            return False
            
    if skills and found_any:
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump({"skills": skills}, f, ensure_ascii=False, indent=2)
        print(f"Successfully saved {out_path}")
    return True

if __name__ == "__main__":
    targets = [f"champ_{i}" for i in range(127, 139)]
    for prefix in targets:
        print(f"--- Starting parsing for {prefix} ---")
        process_champion(prefix)
    print("All processing done!")
