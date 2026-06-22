import os
import sys
import json
import time
import glob
from google import genai
from google.genai.errors import APIError
from PIL import Image

# サービスアカウントキーを設定
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"

# Vertex AIクライアントとして初期化
client = genai.Client(
    vertexai=True,
    project="gen-lang-client-0899050472",
    location="us-central1"
)

MODEL_NAME = 'gemini-2.5-flash'

def parse_item_image(image_path):
    prompt = """
あなたはリーグ・オブ・レジェンド：ワイルドリフトのアイテム解析専門AIです。
提供されたゲーム内アイテム詳細画面の画像（スクリーンショット）を正確に読み取り、以下のJSONスキーマに従って日本語の情報を出力してください。

【抽出項目と抽出のルール】
1. **item_name**: アイテムの名前。画像上部や詳細説明に太字などで表示されています。
   - 例: 「インフィニティ エッジ」「マナムネ」「ドミニク リガード」「ロング ソード」など。
   - もし画像の文字が不鮮明な場合でも、最も近いワイルドリフトの物理アイテム名を推測して正確なゲーム内の名前に補正してください。
2. **stats**: アイテムの基本ステータスを配列で抽出します。
   - 例: 「+65 攻撃力」「+20% クリティカル率」「+15 スキルヘイスト」のように、画像に書かれているステータス数値をそのまま抜き出します。
3. **passives**: アイテムが持つユニークパッシブ（自動効果）や発動効果。それぞれ名前（name）と効果説明文（description）のオブジェクトの配列として抽出します。
   - パッシブ名（例: 「起死回生」「畏怖」「ショック」「ライフライン」など）。
   - 説明文は、画像に表示されているパッシブの効果を、一言一句正確に文字起こししてください（改行や数値なども厳密に）。
   - 発動効果（アクティブ）の場合も、名前を「発動効果」や「水銀」などの名前で登録し、効果説明文を書き出してください。
   - パッシブや発動効果がないアイテム（「ロング ソード」など）の場合は、空の配列 `[]` としてください。

【厳密なルール】
- AIの想像で勝手に効果を捏造したり、PC版LoLの情報を混ぜたりしてはいけません。画像に書かれているテキストのみを出力してください。
- 出力は必ずJSON形式のみとし、Markdownの```json などのコードブロックで囲んでください。

【JSONスキーマ例】
```json
{
  "item_name": "アイテム名",
  "stats": [
    "+55 攻撃力",
    "+45 物理防御"
  ],
  "passives": [
    {
      "name": "パッシブ名",
      "description": "パッシブ効果の説明文。"
    }
  ]
}
```
"""
    try:
        img = Image.open(image_path)
        contents = [prompt, img]
        
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=contents,
        )
        
        raw_text = response.text.strip()
        
        # ```json と ``` を取り除く
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3].strip()
            
        data = json.loads(raw_text)
        return data
    except Exception as e:
        print(f"Error parsing {image_path}: {e}")
        return None

def main():
    raw_dir = "public/images/items/raw"
    out_dir = "scratch/extracted_items"
    os.makedirs(out_dir, exist_ok=True)
    
    # 物理アイテムマスターを読み込む
    master_path = "src/data/physical_items_dd.json"
    with open(master_path, "r", encoding="utf-8") as f:
        master_items = json.load(f)
        
    master_names = {item["nameJa"].replace(" ", "").lower(): item for item in master_items}

    # 全てのPNG画像を取得
    image_paths = sorted(glob.glob(os.path.join(raw_dir, "*.png")))
    total_images = len(image_paths)
    print(f"Found {total_images} screenshots to process.")

    for i, img_path in enumerate(image_paths):
        base_name = os.path.basename(img_path)
        # すでに処理済みのファイルかチェック
        out_path = os.path.join(out_dir, f"{base_name}.json")
        if os.path.exists(out_path):
            print(f"[{i+1}/{total_images}] Skip {base_name} (already processed)")
            continue

        print(f"[{i+1}/{total_images}] Processing {base_name}...")
        
        # 3回までリトライ
        result = None
        for attempt in range(3):
            result = parse_item_image(img_path)
            if result is not None and "item_name" in result:
                break
            print(f"  Attempt {attempt+1} failed, retrying in 5 seconds...")
            time.sleep(5)

        if result:
            # 抽出された結果を保存
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            print(f"  ✅ Saved: {result['item_name']}")
        else:
            print(f"  ❌ Failed: {base_name}")
            
        # 無料枠の 15RPM (1分15リクエスト) 制限を考慮し、5秒待機する
        time.sleep(5)

if __name__ == "__main__":
    main()
