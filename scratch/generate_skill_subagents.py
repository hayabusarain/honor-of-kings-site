import json
import math

total_heroes = 112
batch_size = 4
num_batches = math.ceil(total_heroes / batch_size)

subagents = []
for i in range(num_batches):
    start = i * batch_size + 1
    end = min((i + 1) * batch_size, total_heroes)
    
    prompt = f"""あなたは指定されたヒーローのスキル画像群を読み取り、スキルと背景設定のJSONを生成するデータ抽出アシスタントです。
担当範囲: hero_{start:03d} から hero_{end:03d} まで
画像フォルダ: 'c:\\Users\\81901\\Desktop\\screenshots'

各ヒーローについて、以下の画像ファイルを確認してください（存在するもののみ）：
- hero_XXX_initial.png （背景設定・ストーリーや肩書きなどのテキストがあれば lore として抽出。もし何もなければ空文字）
- hero_XXX_passive.png （パッシブスキル）
- hero_XXX_skill1.png （スキル1）
- hero_XXX_skill2.png （スキル2）
- hero_XXX_skill3.png （スキル3）
- hero_XXX_skill4.png （もしあれば スキル4）

以下のJSONフォーマットに厳密に従って抽出してください：

```json
{{
  "hero_{start:03d}": {{
    "lore": "背景設定やストーリーのテキスト（画像から読み取れる範囲で。なければ空文字）",
    "skills": [
      {{
        "id": "P",
        "name": "パッシブスキルの名前",
        "tags": ["物理", "制御" などのタグがあれば。なければ空配列],
        "cooldown_text": "クールダウンや消費MPの記載（あれば。なければ null）",
        "description": "スキルの説明文を完全に文字起こししてください。",
        "table": null
      }},
      {{
        "id": "skill1",
        "name": "スキル1の名前",
        "tags": ["魔法"],
        "cooldown_text": "5秒",
        "description": "スキルの説明文。",
        "table": {{
          "headers": ["LV 1", "LV 2", "LV 3", "LV 4", "LV 5", "LV 6"],
          "rows": [
            {{"label": "基礎ダメージ", "values": ["100", "150", "200", "250", "300", "350"]}}
          ]
        }}
      }}
    ]
  }}
}}
```

必ず ```json と ``` で囲んだJSONのみを出力してください。途中で文章が途切れないよう、確実に全ての担当ヒーローのスキル情報を漏れなく出力してください。"""

    subagents.append({
        "TypeName": "vision_extractor",
        "Role": f"Skill Extractor {i+1}",
        "Prompt": prompt
    })

payload = {"Subagents": subagents}
with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/skill_extractors_payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)

print(f'Generated {len(subagents)} subagents in scratch/skill_extractors_payload.json')
