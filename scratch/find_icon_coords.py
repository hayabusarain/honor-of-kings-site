import os
import json
from google import genai
from google.genai.errors import APIError
from PIL import Image

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"

client = genai.Client(
    vertexai=True,
    project="gen-lang-client-0899050472",
    location="us-central1"
)

MODEL_NAME = 'gemini-2.5-flash'

def find_coords(image_path):
    img = Image.open(image_path)
    prompt = """
あなたは画像解析の専門家です。
この画像はゲームのスキル詳細画面のスクリーンショット（1920x1080）です。
画面内のどこかに、このスキルの「アイコン（正方形に近い四角形の画像）」が表示されています。
スキル名のすぐ左、あるいはポップアップの左上付近にあることが多いです。
このスキルアイコンの座標（x, y）とサイズ（width, height）を推測し、以下のJSON形式のみで出力してください。

```json
{
  "x": 500,
  "y": 400,
  "width": 100,
  "height": 100
}
```
Markdownや他のテキストは一切不要です。JSONのみ出力してください。
"""
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[prompt, img],
        )
        print("Response:")
        print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_coords(r"C:\Users\81901\Desktop\screenshots\hero_059_passive.png")
