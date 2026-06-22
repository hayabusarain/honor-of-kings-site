import os
import sys
import json
import time
import glob
from google import genai
from google.genai.errors import APIError
from PIL import Image
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# サービスアカウントキーを設定
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"

# Vertex AIクライアントとして初期化
client = genai.Client(
    vertexai=True,
    project="gen-lang-client-0899050472",
    location="us-central1"
)

# 無料枠・現行APIで利用可能な最新モデル
MODEL_NAME = 'gemini-2.5-flash'

def extract_with_retry(contents, step_name=""):
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
あなたはリーグ・オブ・レジェンド：ワイルドリフトのスキル解析専門AIです。
提供された画像（スキルのテキスト詳細画面、およびテーブル画面）を正確に読み取り、以下のJSONスキーマに従って出力してください。

【厳密なルール】
1. テキストの一言一句、数字の1の位まで絶対に間違えないこと。
2. 説明文（description）の中で強調されているテキスト（オレンジ、紫、緑、黄色、白などの色付きテキスト）は、Tailwind CSS の span タグを使って表現してください。
   例: <span class="text-orange-500 font-bold">66の物理ダメージ</span>
   例: <span class="text-purple-500 font-bold">強化</span>
   例: <span class="text-emerald-500 font-bold">減少体力の1.2%</span>
3. 【重要：アイコンの翻訳】テキストの中にインラインでステータスを示すアイコンが含まれている場合があります。これらは無視せずに必ずテキストとして補完してください。
   - 剣のアイコン（オレンジ/白） ＝ AD または 攻撃力
   - 魔法陣・杖のアイコン（紫/青） ＝ AP または 魔力
   - クリティカルアイコン（赤い星のようなマーク、爆発マーク） ＝ クリティカル率
   - ハートのアイコン（緑/赤） ＝ HP または 体力（「最大HP」「減少体力」などは文脈から判断すること）
   - 盾のアイコン（黄色） ＝ 物理防御 (AR)
   - 魔法の盾（青） ＝ 魔法防御 (MR)
   - 例: 画像が `(60 + 112% [剣アイコン] + 35% [魔法陣アイコン])` の場合 → `(60 + 112%AD + 35%AP)`
   - 例: 画像が `(1 + 0%現在 [クリティカルアイコン])` の場合 → `(1 + 0%現在のクリティカル率)`
4. 【重要：文脈と整合性】チャンピオンの固有スキル名（例：パッシブスキルの名前など）が他のスキルの説明文に登場することがよくあります（例：「ラブタップ」など）。画像から文字を起こす際、「ラプチュア」のような全く別の単語に誤認識しないよう、他のスキルの文脈と照らし合わせて整合性を保ってください。不自然な日本語（例「0%現在」など）になった場合は、文脈から正しい単語（例「0%現在のクリティカル率」）を推測して補完してください。
5. タグ（[魔法]や[自動効果]など）があれば tags 配列に入れてください。
6. クールダウンテキスト（〇秒）があれば cooldown_text に入れてください。パッシブなど存在しない場合は null にしてください。
7. テーブルデータが存在する場合は table オブジェクトを作成し、ヘッダーと各行のデータを正確に抽出してください。
8. 出力は絶対にJSON形式のみとし、Markdownの```json などのブロックは含めず、純粋なJSON文字列だけを返してください。

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
    
    # 抽出リクエスト
    print(f"[{skill_id}] Extracting...")
    contents = [prompt] + images
    response = extract_with_retry(contents, "Extract")
    raw_json = response.text.strip()
    
    if raw_json.startswith("```json"):
        raw_json = raw_json[7:-3].strip()
    elif raw_json.startswith("```"):
        raw_json = raw_json[3:-3].strip()
        
    # ダブルチェックフェーズ
    verify_prompt = f"""
先ほど、以下のJSONを抽出しました。
{raw_json}

しかし、一言一句の誤りも許されません。
もう一度画像とこのJSONを照らし合わせ、以下の点を「厳格に監査」し、修正した最終的な完璧なJSONを出力してください。
1. 日本語の誤字脱字、てにをはのミスはないか？
2. ダメージ数値、パーセンテージ、プラスマイナスの記号は画像と完全に一致しているか？
3. (10+20%AD) などの括弧の中の計算式は完全に一致しているか？特に、ゲーム内のステータスアイコン（剣、魔法陣、クリティカルマーク、ハートなど）を無視して `(60 + 112% + 35%)` や `(1 + 0%現在)` のように書き漏らし・言葉足らずになっていないか？文脈から「AD」「AP」「現在のクリティカル率」などを補完すること。
4. 色付きテキストの span タグ付けに漏れはないか？
5. パッシブスキル等の名前が別のスキルに登場した際、「ラプチュア」等と誤字していないか？（正しくは「ラブタップ」等、他のスキル名と照合すること）
6. 不自然な日本語の切れ端（「0%現在」など）が残っていないか？意味が通じるようにアイコンや記号をテキストに翻訳すること。

修正後の「完璧なJSONのみ」を出力してください。Markdownブロックは不要です。
"""
    print(f"[{skill_id}] Double checking...")
    verify_contents = [verify_prompt] + images
    verify_response = extract_with_retry(verify_contents, "Verify")
    final_json = verify_response.text.strip()
    
    if final_json.startswith("```json"):
        final_json = final_json[7:-3].strip()
    elif final_json.startswith("```"):
        final_json = final_json[3:-3].strip()
        
    return json.loads(final_json)

def process_champion(champ_prefix):
    base_dir = os.path.join(os.path.dirname(__file__), 'screenshots')
    out_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src', 'data', 'parsed_skills')
    os.makedirs(out_dir, exist_ok=True)
    
    out_path = os.path.join(out_dir, f"{champ_prefix}.json")
    if os.path.exists(out_path):
        print(f"[{champ_prefix}] Already parsed. Skipping.")
        return True

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
            time.sleep(15) # 安全なレート制限のため
        except Exception as e:
            print(f"Error parsing {champ_prefix} {skill_id}: {e}")
            return False # エラーが出たら中断
            
    # 保存
    if skills and found_any:
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump({"skills": skills}, f, ensure_ascii=False, indent=2)
        print(f"✅ Successfully saved {out_path}")
    return True

if __name__ == "__main__":
    base_dir = os.path.join(os.path.dirname(__file__), 'screenshots')
    
    # screenshotsフォルダの中の全ての champ_XXX のプレフィックスを取得
    all_files = glob.glob(os.path.join(base_dir, "champ_*_*.png"))
    prefixes = sorted(list(set([os.path.basename(f).split('_')[0] + "_" + os.path.basename(f).split('_')[1] for f in all_files])))
    
    print(f"Found {len(prefixes)} champions to parse.")
    
    for prefix in prefixes:
        print(f"--- Starting parsing for {prefix} ---")
        success = process_champion(prefix)
        if not success:
            print(f"Failed to process {prefix}. Stopping.")
            break
            
    print("All processing done!")
