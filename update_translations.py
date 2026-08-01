import os
import json
import google.generativeai as genai

# Configure API
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    # Try reading from .env if needed, but assuming process env has it
    import dotenv
    dotenv.load_dotenv('.env.local')
    api_key = os.environ.get("GEMINI_API_KEY")

genai.configure(api_key=api_key)

with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    ja_data = json.load(f)
with open('public/data/skills/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

target_ids = ['166', '107', '519', '131', '178', '184', '117', '126', '113']

model = genai.GenerativeModel('gemini-1.5-flash')

for hid in target_ids:
    print(f"Translating updated skills for hero {hid}...")
    
    ja_hero = ja_data.get(hid)
    if not ja_hero:
        continue
    
    prompt = f"""
    You are an expert MOBA translator for Honor of Kings. Translate the following Japanese JSON object containing hero skills into highly accurate and natural English MOBA terminology.
    Preserve all JSON structure, keys, HTML tags, and numerical values exactly.
    Output ONLY valid JSON.
    
    Hero data to translate:
    {json.dumps(ja_hero, ensure_ascii=False, indent=2)}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
            
        translated_json = json.loads(text.strip())
        en_data[hid] = translated_json
        print(f"Successfully translated hero {hid}")
    except Exception as e:
        print(f"Failed to translate hero {hid}: {e}")

with open('public/data/skills/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Updated en.json with latest English translations!")
