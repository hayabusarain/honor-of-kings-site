import os
import json
import sys

def synthesize(hero_id):
    raw_path = f"c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/data/{hero_id}_raw.txt"
    if not os.path.exists(raw_path):
        print(f"Error: {raw_path} not found.")
        return
    
    with open(raw_path, "r", encoding="utf-8") as f:
        raw_text = f.read()

    # Create prompt
    prompt = f"""
以下のテキストは、指定されたヒーローについて外部サイト（Fandom, HoKStats, Liquipedia）からスクレイピングした生のデータです。
この情報を元にして、以下の5つの項目に関する解説文を生成してください。
【条件】
- 必ずこの生データに含まれる事実（スキル効果、適正レーン、メタ、カウンターなど）のみを根拠にすること。
- AI自身の独自解釈や勝手な仕様の捏造（自動発動スキルを手動と言い換えるなど）は絶対にしないこと。
- 文字数は各項目とも日本語で100〜200文字程度で、分かりやすく簡潔にまとめること。
- 初心者向けの有益な情報を含めること。

【生データ】
{raw_text[:10000]} # Limit size if needed

【出力形式（JSON）】
{{
  "earlyGame": "...",
  "midGame": "...",
  "lateGame": "...",
  "teamfight": "...",
  "commonMistakes": "..."
}}
"""

    out_prompt_path = f"c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/data/{hero_id}_prompt.txt"
    with open(out_prompt_path, "w", encoding="utf-8") as f:
        f.write(prompt)
        
    print(f"Prompt generated at {out_prompt_path}. Ready to send to subagent.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        synthesize(sys.argv[1])
    else:
        synthesize("hero_059")
