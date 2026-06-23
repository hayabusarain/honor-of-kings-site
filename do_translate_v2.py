import json
import urllib.request, urllib.parse
import time
import re

def translate_text(text):
    url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=' + urllib.parse.quote(text)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        response = urllib.request.urlopen(req).read().decode('utf-8')
        res_json = json.loads(response)
        translated = "".join([sentence[0] for sentence in res_json[0]])
        return translated
    except Exception as e:
        print(f"Error translating: {e}")
        return text

def main():
    with open('chunk_6.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Extract all Japanese strings
    paths_and_texts = []
    def extract_strings(obj, current_path=""):
        if isinstance(obj, dict):
            for k, v in obj.items():
                extract_strings(v, current_path + "." + k)
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                extract_strings(v, current_path + f"[{i}]")
        elif isinstance(obj, str):
            if any(c >= '\u3000' for c in obj):
                paths_and_texts.append((current_path, obj))

    extract_strings(data)
    unique_texts = list(set([t for p, t in paths_and_texts]))
    
    print(f"Total unique strings to translate: {len(unique_texts)}")
    
    translated_dict = {}
    
    # Specific Mappings
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
        "最大ダメージ": "Max Damage",
    }
    
    for i, text in enumerate(unique_texts):
        if i % 10 == 0:
            print(f"Translating {i}/{len(unique_texts)}...")
            
        if text in SPECIFIC_MAPPINGS:
            translated_dict[text] = SPECIFIC_MAPPINGS[text]
            continue
            
        translated = translate_text(text)
        translated_dict[text] = translated
        time.sleep(0.3)
        
    REPLACEMENTS = [
        (r'\bLanling Wang\b', 'Prince of Lanling'),
        (r'\bKing Lanling\b', 'Prince of Lanling'),
        (r'\bLanling King\b', 'Prince of Lanling'),
        (r'\bHua Mulan\b', 'Mulan'),
        (r'\bZhang Liang\b', 'Liang'),
        (r'\bShiranui Mai\b', 'Mai Shiranui'),
        (r'\bDoria\b', 'Dolia'),
        (r'\bSun Wukong\b', 'Wukong'),
        (r'\bLapul\b', 'Lapulapu'),
        (r'\bRapul\b', 'Lapulapu'),
        (r'\bRapunzel\b', 'Lapulapu'),
        (r'\bMing Shiyin\b', 'Ming'),
        (r'\bDonghuang Taiyi\b', 'Donghuang'),
        (r'\bDamo\b', 'Dharma'),
        (r'\bZhen Ji\b', 'Lady Zhen'),
        (r'\bAh Ke\b', 'Butterfly'),
        (r'\bPhysical attack\b', 'Physical Attack'),
        (r'\bMagical attack\b', 'Magical Attack'),
        (r'\bPhysical defense\b', 'Physical Defense'),
        (r'\bMagical defense\b', 'Magical Defense'),
        (r'\bMaximum HP\b', 'Max HP'),
        (r'\bMaximum MP\b', 'Max Mana'),
        (r'\bMovement speed\b', 'Movement Speed'),
        (r'\bPhysical defense penetration\b', 'Physical Pierce'),
        (r'\bPhysical penetration\b', 'Physical Pierce'),
        (r'\bMagical penetration\b', 'Magical Pierce'),
        (r'\bAttack speed bonus\b', 'Attack Speed'),
        (r'\bCritical rate\b', 'Critical Rate'),
        (r'\bCritical effect\b', 'Critical Damage'),
        (r'\bPhysical lifesteal\b', 'Physical Lifesteal'),
        (r'\bMagical lifesteal\b', 'Magical Lifesteal'),
        (r'\bCooldown reduction\b', 'Cooldown Reduction'),
        (r'\bAttack range\b', 'Attack Range'),
        (r'\bResistance\b', 'Resistance'),
        (r'HP recovery every 5 seconds', 'HP Regen/5s'),
        (r'MP recovery every 5 seconds', 'Mana Regen/5s'),
        (r'Energy recovery every 5 seconds', 'Energy Regen/5s'),
        (r'Short distance', 'Melee'),
        (r'Long distance', 'Ranged'),
        (r'CD\s*:\s*([\d\.]+)\s*seconds', r'CD: \1s'),
        (r'CD：([\d\.]+)秒', r'CD: \1s')
    ]
    
    def fix_terminology(text):
        for pattern, replacement in REPLACEMENTS:
            text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
        return text

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
        
    print("Translation complete! Saved to chunk_6_translated.json.")

if __name__ == '__main__':
    main()
