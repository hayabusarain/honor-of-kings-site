import json
import re
import time
from deep_translator import GoogleTranslator

# Copy the terminology mapping from the stable script
TERMS = {
    "アレッシオ": "Alessio", "ハイノ": "Heino", "デーヴァラ": "Devara", "姫小満": "Mayene",
    "バタフライ": "Butterfly", "ルアンナ": "Luara", "ファイアホーク船長": "Captain Firehawk",
    "運命を導く者": "The Fate Guide", "武道の奇才": "Martial Arts Prodigy", "死を纏う影刃": "Shadowblade of Death",
    "ファイヤースネイク": "Fire Serpent", "マークスマン": "Marksman", "メイジ/ファイター": "Mage/Fighter",
    "メイジ": "Mage", "ファイター": "Fighter", "サポート": "Support", "タンク": "Tank", "アサシン": "Assassin",
    "阿軻": "A Ke", "アグド": "Agudo"
    # add a few more to be safe
}

def translate_text(text):
    if not text or not isinstance(text, str):
        return text
    
    # check if contains japanese
    if not re.search(r'[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]', text):
        return text

    # Pre-translation terms replace
    for jp, en in TERMS.items():
        text = text.replace(jp, en)

    try:
        translated = GoogleTranslator(source='ja', target='en').translate(text)
        time.sleep(0.5) # avoid rate limit
        return translated
    except Exception as e:
        print("Error translating:", str(e)[:50])
        return text

def process_value(val):
    if isinstance(val, str):
        return translate_text(val)
    elif isinstance(val, list):
        return [process_value(v) for v in val]
    elif isinstance(val, dict):
        return {k: process_value(v) for k, v in val.items()}
    return val

def main():
    file_path = 'public/data/skills/en.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    missing_heroes = [
        'hero_014', 'hero_015', 'hero_016', 'hero_017', 'hero_018', 'hero_019', 'hero_020', 'hero_021',
        'hero_092', 'hero_099', 'hero_100', 'hero_101', 'hero_102', 'hero_103', 'hero_104'
    ]
    
    for h_id in missing_heroes:
        if h_id in data:
            print(f"Translating {h_id}...")
            data[h_id] = process_value(data[h_id])
            
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print("Done translating missing heroes!")

if __name__ == "__main__":
    main()
