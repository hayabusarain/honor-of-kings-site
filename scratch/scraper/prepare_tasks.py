import os
import json

base_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト"
tasks_dir = os.path.join(base_dir, "scratch/scraper/tasks")
os.makedirs(tasks_dir, exist_ok=True)

with open(os.path.join(base_dir, "public/data/skills/ja.json"), "r", encoding="utf-8") as f:
    ja_data = json.load(f)

for i in range(1, 11):
    chunk_path = os.path.join(base_dir, f"scratch/scraper/chunks/chunk_{i}.json")
    if not os.path.exists(chunk_path): continue
    
    with open(chunk_path, "r", encoding="utf-8") as f:
        chunk = json.load(f)
        
    prompt_content = """あなたはHonor of Kingsのプロアナリストです。以下のヒーローのスキル説明（事実データ）を読み、それぞれのヒーローについて指定された7つの項目（earlyGame, midGame, lateGame, teamfight, commonMistakes, strengths, weaknesses）を100〜200文字の日本語で生成してください。
絶対にスキルに書かれていない仕様（ハルシネーション）を含めないでください。

出力は以下のJSON形式のみとし、マークダウンブロック等を含めず直接ファイルに書き出せる形にしてください（あなたがツールで出力ファイルを作成してください）。
{
  "hero_XXX": {
    "earlyGame": "...",
    "midGame": "...",
    "lateGame": "...",
    "teamfight": "...",
    "commonMistakes": "...",
    "strengths": "...",
    "weaknesses": "..."
  },
  ...
}

=== ヒーローのデータ ===
"""
    
    for h_id in chunk.keys():
        h_data = ja_data.get(h_id, {})
        prompt_content += f"\n\nID: {h_id}\n名前: {h_data.get('hero_name')}\n"
        prompt_content += f"パッシブ: {h_data.get('passive', {}).get('description', '')}\n"
        prompt_content += f"スキル1: {h_data.get('skill1', {}).get('description', '')}\n"
        prompt_content += f"スキル2: {h_data.get('skill2', {}).get('description', '')}\n"
        prompt_content += f"スキル3: {h_data.get('skill3', {}).get('description', '')}\n"
        
    out_path = os.path.join(tasks_dir, f"task_{i}.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(prompt_content)
        
print("Prepared 10 task files.")
