import json
import os
import openai
from dotenv import load_dotenv

load_dotenv('.env.local')
client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

with open('scratch/strategy_chunk_1.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

system_prompt = """You are an expert game strategy writer for Honor of Kings. Your task is to process raw strategy text for a hero and rewrite their Early Game, Mid Game, Late Game, and Teamfight strategies into HIGHLY ENGAGING, ACTIONABLE BULLET POINTS in Japanese.

STRICT CONSTRAINTS:
1. **NO EMOJIS ALLOWED**: You must absolutely NOT use any emojis.
2. **FORMAT**: Use bullet points (・) and bold text (`**text**`) to highlight key points.
3. **PUNCHY**: Avoid long boring paragraphs. Keep sentences short, punchy, and actionable. Start bullet points with the conclusion or key action.
4. **GAME TERMS**: Use appropriate terms (ブリンク, CC, ハラス, ガンク, ピール, エンゲージ etc).
5. Tone: Hardcore gamer/Top-tier MOBA player. Passionate but logical and easy to understand.

OUTPUT FORMAT:
Generate ONLY a JSON object for the given hero.
Output the fields: `earlyGame`, `midGame`, `lateGame`, `teamfight`.
Example:
{
  "earlyGame": "・**闘志の維持**: ミニオンを殴って被ダメージ軽減バフをキープ。\n・**有利なトレード**: スキル1で接近し、スキル2のシールドでダメージを吸収。",
  "midGame": "・**積極的な介入**: 小規模戦に積極的に参加し、タンクとして立ち回る。\n・**スキル3の活用**: 集団戦の起点として敵をノックアップさせる。",
  "lateGame": "...",
  "teamfight": "..."
}"""

results = {}
count = 0
for hero_id, hero_data in data.items():
    raw_text = hero_data.get('rawText', '')
    prompt = f"Rewrite the following strategy for hero {hero_id}:\n\n{raw_text}"
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        response_format={ "type": "json_object" }
    )
    
    try:
        content = response.choices[0].message.content
        parsed = json.loads(content)
        results[hero_id] = parsed
        print(f"Processed {hero_id}")
    except Exception as e:
        print(f"Failed {hero_id}: {e}")
        
    count += 1

with open('scratch/enhanced_strategy_1.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Done")
