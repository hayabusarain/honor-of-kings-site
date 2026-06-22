import os
import json
import time
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
        time.sleep(5)
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=contents,
        )
        return response

def parse_skill(images, skill_id):
    prompt = f"""
あなたはリーグ・オブ・レジェンド：ワイルドリフトのスキル解析専門AIです。
提供された画像（スキルのテキスト詳細画面、およびテーブル画面）を正確に読み取り、以下のJSONスキーマに従って出力してください。

【厳密なルール】
1. テキストの一言一句、数字の1の位まで絶対に間違えないこと。PC版LoLの知識は一切使わず、画像のテキスト・数値をそのまま書き写すこと。
2. HTMLタグ（<span class="...">など）は一切使用しないでください。純粋なプレーンテキストとして出力してください。
3. 【最重要：アイコンの翻訳ルール】テキストの中にインラインでステータスを示すアイコンが含まれている場合があります。これらは無視せずに必ずテキストとして補完してください。
   - 剣のアイコン（オレンジ/白） ＝ AD
   - 魔法陣・杖のアイコン（紫/青） ＝ AP
   - ハートのアイコン（緑/赤） ＝ 最大体力 / 減少体力 / 追加体力 (文脈で判断)
   - クリティカルアイコン（赤い星のようなマーク、爆発マーク） ＝ クリティカル率
   - 盾のアイコン（黄色） ＝ 物理防御 (AR)
   - 魔法の盾（青） ＝ 魔法防御 (MR)
   - 砂時計のアイコン（黄色） ＝ スキルヘイスト
   - その他、上矢印などのレベルスケールを示すアイコンは単純に無視するか、(Lv) などとしてください。
   - 例: `(60 + 112% [剣アイコン] + 35% [魔法陣アイコン])` → `(60 + 112%AD + 35%AP)`
   - 例: `(1 + 0%現在 [クリティカルアイコン])` → `(1 + 0%現在クリティカル率)`
4. パッシブ等のクールタイム（例：「〇秒ごとに発動」「脚ごとにクールダウン〇秒」など）が説明文にある場合、必ず cooldown_text に記載すること。存在しない場合は null にすること。
5. テーブルデータが存在する場合は table オブジェクトを作成し、rows は必ず `{{ "label": "...", "values": ["..."] }}` のオブジェクト形式で保存すること（配列はNG）。
6. 出力は絶対にJSON形式のみとし、Markdownの```json などのブロックは含めず、純粋なJSON文字列だけを返してください。

【JSONスキーマ】
{{
  "id": "{skill_id}",
  "name": "スキル名",
  "tags": ["タグ1", "タグ2"],
  "cooldown_text": "〇秒",
  "description": "スキルの説明文。改行は \\n を使用してください。",
  "table": {{
    "headers": ["LV 1", "LV 2", "LV 3", "LV 4"],
    "rows": [
      {{ "label": "基本ダメージ", "values": ["40", "80", "120", "160"] }}
    ]
  }}
}}
※テーブルがない場合は "table": null とすること。
"""
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
    skills = []
    skill_types = [('P', 'passive'), ('Q', 'skill1'), ('W', 'skill2'), ('E', 'skill3'), ('R', 'ult')]
    
    for skill_id, skill_name in skill_types:
        text_img_path = os.path.join(base_dir, f"{champ_prefix}_{skill_name}_text.png")
        table_img_path = os.path.join(base_dir, f"{champ_prefix}_{skill_name}_table.png")
        
        images = []
        if os.path.exists(text_img_path):
            images.append(Image.open(text_img_path))
        if os.path.exists(table_img_path):
            images.append(Image.open(table_img_path))
            
        if not images:
            continue
            
        try:
            print(f"Parsing {champ_prefix} {skill_id}...")
            skill_data = parse_skill(images, skill_id)
            skills.append(skill_data)
            time.sleep(5)
        except Exception as e:
            print(f"Error parsing {champ_prefix} {skill_id}: {e}")
    return skills

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src', 'data', 'parsed_skills_new')
    os.makedirs(out_dir, exist_ok=True)
    
    for i in range(17, 27):
        prefix = f"champ_{i:03d}"
        print(f"--- Starting {prefix} ---")
        skills = process_champion(prefix)
        if skills:
            out_path = os.path.join(out_dir, f"{prefix}.json")
            with open(out_path, 'w', encoding='utf-8') as f:
                json.dump({"skills": skills}, f, ensure_ascii=False, indent=2)
    print("DONE")
