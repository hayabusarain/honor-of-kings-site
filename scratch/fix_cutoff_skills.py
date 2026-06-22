import os
import sys
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

def extract_cutoff(images, current_data):
    prompt = """
あなたはリーグ・オブ・レジェンド：ワイルドリフト/Honor of Kingsのスキル解析専門AIです。
以下のJSONは、あるヒーローの現在のスキルデータです。
__CURRENT_DATA__

提供された画像は、このヒーローのいずれかのスキル画面の下部（見切れていた部分）のスクリーンショットです。
これらの画像から、不足しているテキスト（またはテーブル）を完全に抽出し、どのスキル（"passive", "skill1", "skill2", "skill3", "skill4"）の続きであるかを特定してください。

【厳密なルール】
1. テキストの一言一句、数字の1の位まで絶対に間違えないこと。
2. アイコンは既存のルールに従い `[ICON_AD]`, `[ICON_AP]`, `[ICON_HP]`, `[ICON_LEVEL]` などに変換すること。
3. 抽出結果はJSON配列のみを出力し、Markdownブロックを含めないでください。
4. "appended_text" には見切れていた続きの文章を入れます（続きがない場合は空文字）。
5. "appended_table" には見切れていたテーブルを入れます（ない場合はnull）。既存のテーブルに完全に追加される形になるよう構築してください。

【出力JSONスキーマ（配列）】
[
  {
    "skill_key": "特定したスキルキー（例: passive, skill1, skill2...）",
    "appended_text": "ここに追加のテキスト",
    "appended_table": {
      "headers": ["レベル", "ダメージ"],
      "rows": [["1", "100"], ["2", "200"]]
    }
  }
]
""".replace("__CURRENT_DATA__", json.dumps(current_data, ensure_ascii=False, indent=2))
    contents = [prompt] + images
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=contents,
        )
        return response.text
    except Exception as e:
        print(f"RAW ERROR: {e}")
        return None

def main():
    base_dir = r"C:\Users\81901\Desktop\スキル見切れヒーロー"
    json_path = r"C:\Users\81901\Desktop\オナーオブキングスサイト\public\data\skills\ja.json"
    
    with open(json_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)
        
    folders = [f for f in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, f))]
    
    for folder in folders:
        # Match hero
        matched_hero_id = None
        search_name = folder
        if folder == "バイロン":
            search_name = "狂鉄"
        elif folder == "小司縁":
            search_name = "少司縁"
            
        for k, v in ja_data.items():
            if v.get("hero_name") and search_name in v.get("hero_name"):
                matched_hero_id = k
                break
                
        if not matched_hero_id:
            print(f"Could not match folder {folder} to a hero.")
            continue
            
        print(f"Processing folder: {folder} -> {matched_hero_id}")
        current_data = ja_data[matched_hero_id]
        
        folder_path = os.path.join(base_dir, folder)
        image_files = sorted([f for f in os.listdir(folder_path) if f.endswith('.png')])
        if not image_files:
            print(f"No images in {folder_path}")
            continue
            
        images = []
        for img_file in image_files:
            img_path = os.path.join(folder_path, img_file)
            images.append(Image.open(img_path))
            
        result_text = extract_cutoff(images, current_data)
        if not result_text:
            continue
            
        try:
            clean_json = result_text.replace('```json', '').replace('```', '').strip()
            updates = json.loads(clean_json)
            
            for update in updates:
                sk = update["skill_key"]
                app_text = update.get("appended_text", "")
                app_table = update.get("appended_table", None)
                
                if sk in ja_data[matched_hero_id]:
                    if app_text:
                        ja_data[matched_hero_id][sk]["description"] += "\n" + app_text
                    if app_table:
                        if "table" not in ja_data[matched_hero_id][sk] or not ja_data[matched_hero_id][sk]["table"]:
                            ja_data[matched_hero_id][sk]["table"] = app_table
                        else:
                            ja_data[matched_hero_id][sk]["table"]["rows"].extend(app_table.get("rows", []))
                    print(f"Updated {sk} for {matched_hero_id}")
                else:
                    print(f"Skill {sk} not found for {matched_hero_id}")
                    
        except Exception as e:
            print(f"Failed to parse or apply JSON for {folder}: {e}\nRaw Output: {result_text}")
            
        time.sleep(3)

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(ja_data, f, ensure_ascii=False, indent=4)
    print("Done! Saved ja.json.")

if __name__ == "__main__":
    main()
