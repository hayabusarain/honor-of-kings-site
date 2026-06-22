import os
import sys
import json
import time
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
2. 【最重要：アイコンの絶対固定翻訳ルール】テキストの中にインラインでステータスを示すアイコンが含まれている場合があります。アイコンは**以下の文字列に絶対に固定**して翻訳してください。「物理攻撃力」や「体力」など、文脈に合わせて勝手に言い換えることは固く禁じます。
   - 剣のアイコン（オレンジ/白） ＝ `[ICON_AD]`
   - 魔法陣・杖のアイコン（紫/青） ＝ `[ICON_AP]`
   - ハートのアイコン（緑/赤） ＝ `[ICON_HP]`
   - 砂時計のアイコン（黄色） ＝ `[ICON_HASTE]`
   - クリティカルアイコン（赤い星のようなマーク、爆発マーク） ＝ `[ICON_CRIT]`
   - 盾のアイコン（黄色） ＝ `[ICON_AR]`
   - 魔法の盾（青） ＝ `[ICON_MR]`
   - **【重要】上記以外の「用途不明なアイコン」や「単なるレベル変動マーク（上矢印等）」が連続して現れた場合、それらのアイコンはすべて `[ICON_LEVEL]` に変換してください。絶対にアイコンの意味を勝手に空想・推測して言葉を捏造してはいけません。**
3. 【最重要：捏造の禁止と完全文字起こし】
   - 画像内に文字として書かれていない言葉（「ボーナス」「最大」「物理攻撃力」「増加」など）を、AIの親切心で勝手に補完・捏造することを**厳重に禁止**します。画像に「増加」と書いてある場合のみ「増加[ICON_AD]」としてください。
   - 例: 画像が `(60 + 112% [剣アイコン] + 35% [魔法陣アイコン])` の場合 → 絶対に `(60 + 112%[ICON_AD] + 35%[ICON_AP])` と出力すること。「112%物理攻撃力」などとしないこと。
   - 特に `(70 + 150%増加[剣] + 15%増加[ハート])` などの長い計算式において、要素をスキップしたり結合（要約）したりすることは絶対に許されません。画像にある通り、完全に一言一句文字起こししてください。
5. 【文脈と整合性】チャンピオンの固有スキル名（例：パッシブスキルの名前など）が他のスキルの説明文に登場することがよくあります。画像から文字を起こす際、「ラプチュア」のような全く別の単語に誤認識しないよう、他のスキル名と照らし合わせて整合性を保ってください。
6. タグ（[魔法]や[自動効果]など）があれば tags 配列に入れてください。
7. クールダウンテキスト（〇秒）があれば cooldown_text に入れてください。パッシブなど存在しない場合は null にしてください。
8. テーブルデータが存在する場合は table オブジェクトを作成し、ヘッダーと各行のデータを正確に抽出してください。
9. 出力は絶対にJSON形式のみとし、Markdownの```json などのブロックは含めず、純粋なJSON文字列だけを返してください。

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
3. 計算式とアイコン表記がルールに完全に一致しているか？ `(70 + 150%増加[ICON_AD] + 15%増加[ICON_HP])` のように、アイコンは必ず `[ICON_AD]` 等の固定文字列に変換され、かつ画像に無い「ボーナス」等の言葉を捏造していないか？計算式の要素が抜け落ちていないか？また、わからないアイコンは `[ICON_LEVEL]` に変換しているか？
4. パッシブスキル等の名前が別のスキルに登場した際、「ラプチュア」等と誤字していないか？（正しくは「ラブタップ」等、他のスキル名と照合すること）

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
    
    skills = []
    
    skill_types = [
        ('P', 'passive'),
        ('Q', 'skill1'),
        ('W', 'skill2'),
        ('E', 'skill3'),
        ('R', 'ult')
    ]
    
    for skill_id, skill_name in skill_types:
        text_img_path = os.path.join(base_dir, f"{champ_prefix}_{skill_name}_text.png")
        table_img_path = os.path.join(base_dir, f"{champ_prefix}_{skill_name}_table.png")
        
        images = []
        if os.path.exists(text_img_path):
            images.append(Image.open(text_img_path))
        if os.path.exists(table_img_path):
            images.append(Image.open(table_img_path))
            
        if not images:
            print(f"No images found for {champ_prefix} {skill_id}")
            continue
            
        try:
            skill_data = parse_skill(images, skill_id)
            skills.append(skill_data)
            time.sleep(15) # 無料枠のレート制限(15RPM)回避のため、15秒と長めに待機
        except Exception as e:
            print(f"Error parsing {champ_prefix} {skill_id}: {e}")
            
    # 保存
    if skills:
        out_path = os.path.join(out_dir, f"{champ_prefix}.json")
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump({"skills": skills}, f, ensure_ascii=False, indent=2)
        print(f"✅ Successfully saved {out_path}")

if __name__ == "__main__":
    print("Starting parsing for champ_023 (Miss Fortune)...")
    process_champion('champ_023')
    print("Done!")
