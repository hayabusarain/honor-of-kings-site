import json
import re
from deep_translator import GoogleTranslator
import time

def translate_texts():
    with open('chunk_6.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Extract all Japanese strings
    texts_to_translate = []
    
    def extract_strings(obj, paths, current_path=""):
        if isinstance(obj, dict):
            for k, v in obj.items():
                extract_strings(v, paths, current_path + "." + k)
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                extract_strings(v, paths, current_path + f"[{i}]")
        elif isinstance(obj, str):
            if any(c >= '\u3000' for c in obj):
                paths.append((current_path, obj))

    paths_and_texts = []
    extract_strings(data, paths_and_texts)
    
    # Get unique texts
    unique_texts = list(set([text for path, text in paths_and_texts]))
    
    # 2. Translate in chunks using translate_batch
    translator = GoogleTranslator(source='ja', target='en')
    translated_dict = {}
    
    print(f"Total unique strings to translate: {len(unique_texts)}")
    
    chunk_size = 40
    for i in range(0, len(unique_texts), chunk_size):
        chunk = unique_texts[i:i+chunk_size]
        print(f"Translating chunk {i//chunk_size + 1}/{len(unique_texts)//chunk_size + 1}...")
        try:
            res = translator.translate_batch(chunk)
            for j, translated_text in enumerate(res):
                translated_dict[chunk[j]] = translated_text
            time.sleep(1)
        except Exception as e:
            print(f"Error translating chunk: {e}")
            # fallback to individual translation
            for text in chunk:
                try:
                    translated_dict[text] = translator.translate(text)
                except Exception as e2:
                    print(f"Failed to translate: {text}, Error: {e2}")
                    translated_dict[text] = text

    # 3. Terminology Replacements
    REPLACEMENTS = {
        r'\bLanling Wang\b': 'Prince of Lanling',
        r'\bKing Lanling\b': 'Prince of Lanling',
        r'\bLanling King\b': 'Prince of Lanling',
        r'\bHua Mulan\b': 'Mulan',
        r'\bZhang Liang\b': 'Liang',
        r'\bShiranui Mai\b': 'Mai Shiranui',
        r'\bDoria\b': 'Dolia',
        r'\bSun Wukong\b': 'Wukong',
        r'\bLapul\b': 'Lapulapu',
        r'\bRapul\b': 'Lapulapu',
        r'\bRapunzel\b': 'Lapulapu',
        r'\bMing Shiyin\b': 'Ming',
        r'\bDonghuang Taiyi\b': 'Donghuang',
        r'\bDamo\b': 'Dharma',
        r'\bZhen Ji\b': 'Lady Zhen',
        r'Physical Attack': 'Physical Attack',
        r'Magical Attack': 'Magical Attack',
        r'Physical Defense': 'Physical Defense',
        r'Magical Defense': 'Magical Defense',
        r'Max HP': 'Max HP',
        r'Max MP': 'Max Mana',
        r'Movement Speed': 'Movement Speed',
        r'Physical Pierce': 'Physical Pierce',
        r'Magical Pierce': 'Magical Pierce',
        r'Attack Speed Bonus': 'Attack Speed',
        r'Critical Rate': 'Critical Rate',
        r'Critical Effect': 'Critical Damage',
        r'Physical Lifesteal': 'Physical Lifesteal',
        r'Magical Lifesteal': 'Magical Lifesteal',
        r'Cooldown Reduction': 'Cooldown Reduction',
        r'Attack Range': 'Attack Range',
        r'Resistance': 'Resistance',
        r'HP recovery every 5 seconds': 'HP Regen/5s',
        r'MP recovery every 5 seconds': 'Mana Regen/5s',
        r'Energy recovery every 5 seconds': 'Energy Regen/5s',
        r'Short range': 'Melee',
        r'Long distance': 'Ranged',
        r'Assassin': 'Assassin',
        r'Mage': 'Mage',
        r'Marksman': 'Marksman',
        r'Support': 'Support',
        r'Tank': 'Tank',
        r'Fighter': 'Fighter',
        r'Easy': 'Easy',
        r'Normal': 'Normal',
        r'Hard': 'Hard',
        r'Very Hard': 'Very Hard',
        r'Damage': 'Damage',
        r'Movement speed increase': 'Speed Up',
        r'Movement speed decrease': 'Slow',
        r'Recovery': 'Recovery',
        r'Movement': 'Mobility'
    }
    
    # Additional specific mappings based on JSON fields:
    SPECIFIC_MAPPINGS = {
        "蘭陵王": "Prince of Lanling",
        "花木蘭": "Mulan",
        "エリン": "Erin",
        "張良": "Liang",
        "不知火舞": "Mai Shiranui",
        "ドリア": "Dolia",
        "ナコルル": "Nakoruru",
        "橘右京": "Ukyo Tachibana",
        "アーサー": "Arthur",
        "孫悟空": "Wukong",
        "ラプール": "Lapulapu",
        "劉備": "Liu Bei",
        "アサシン": "Assassin",
        "メイジ": "Mage",
        "マークスマン": "Marksman",
        "サポート": "Support",
        "タンク": "Tank",
        "ファイター": "Fighter",
        "ノーマル": "Normal",
        "ハード": "Hard",
        "ベリーハード": "Very Hard",
        "イージー": "Easy",
        "ダメージ": "Damage",
        "移動速度増加": "Speed Up",
        "移動速度減少": "Slow",
        "回復": "Recovery",
        "移動": "Mobility",
        "シールド": "Shield",
        "無効化": "Immunity",
        "制圧": "Suppression",
        "沈黙": "Silence",
        "物理攻撃": "Physical Attack",
        "魔法攻撃": "Magical Attack",
        "物理防御": "Physical Defense",
        "魔法防御": "Magical Defense",
        "クールダウン": "Cooldown",
        "基本ダメージ": "Base Damage",
    }
    
    def fix_terminology(text):
        if text in SPECIFIC_MAPPINGS:
            return SPECIFIC_MAPPINGS[text]
            
        for pattern, replacement in REPLACEMENTS.items():
            text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
        
        # specific fix for "XX seconds" in Cooldown
        text = re.sub(r'CD\s*:\s*([\d\.]+) seconds', r'CD: \1s', text, flags=re.IGNORECASE)
        text = re.sub(r'CD：([\d\.]+)秒', r'CD: \1s', text)
        
        return text

    # Apply translations to object
    def apply_translations(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                obj[k] = apply_translations(v)
            return obj
        elif isinstance(obj, list):
            return [apply_translations(v) for v in obj]
        elif isinstance(obj, str):
            if any(c >= '\u3000' for c in obj):
                translated = translated_dict.get(obj, obj)
                return fix_terminology(translated)
            return obj
        return obj

    translated_data = apply_translations(data)

    with open('chunk_6_translated.json', 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
        
    print("Translation complete. Saved to chunk_6_translated.json")

if __name__ == '__main__':
    translate_texts()
