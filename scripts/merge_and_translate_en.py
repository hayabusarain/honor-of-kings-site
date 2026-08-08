import json
import glob
from googletrans import Translator
import time
import re

translator = Translator()

def translate_text(text):
    if not text:
        return text
    # some known manual translations first for game terms
    manual = {
        "スキル1": "Skill 1",
        "スキル2": "Skill 2",
        "スキル3": "Skill 3",
        "スキル4": "Skill 4",
        "通常形態": "Normal Form",
        "重剣形態": "Heavy Sword Form",
        "双剣形態": "Light Sword Form",
        "統御形態": "Domination Form",
        "狂暴形態": "Revenge Form",
        "HP回復": "HP Regen",
        "移動速度": "Movement Speed",
        "攻撃速度": "Attack Speed",
        "物理防御": "Physical Defense",
        "魔法防御": "Magical Defense",
        "シールド": "Shield",
        "追加ダメージ": "Bonus Damage",
        "基本ダメージ": "Base Damage",
        "クールダウン": "Cooldown",
        "攻撃速度＆移動速度": "Attack Speed & Movement Speed",
        "通常攻撃": "Basic Attack",
        "魔法ダメージ": "Magical Damage",
        "物理ダメージ": "Physical Damage"
    }
    if text in manual:
        return manual[text]
        
    for k, v in manual.items():
        if k in text:
            text = text.replace(k, v)
    
    # Try translation
    try:
        res = translator.translate(text, src='ja', dest='en')
        return res.text
    except Exception as e:
        print(f"Error translating '{text}': {e}")
        return text

def main():
    en_file = 'public/data/skills/en.json'
    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
        
    # 1. Merge meta.synergy and meta.counters from chunk_*_done.json
    chunk_files = glob.glob('scratch/translation/chunk_*_done.json')
    merged_count = 0
    for chunk_f in chunk_files:
        with open(chunk_f, 'r', encoding='utf-8') as f:
            chunk_data = json.load(f)
            
        for hero_obj in chunk_data:
            hid = str(hero_obj.get('hero_id'))
            if hid in en_data:
                if 'meta' not in en_data[hid]:
                    en_data[hid]['meta'] = {}
                
                # Merge synergy
                if 'synergy' in hero_obj.get('meta', {}):
                    en_data[hid]['meta']['synergy'] = hero_obj['meta']['synergy']
                
                # Merge counters
                if 'counters' in hero_obj.get('meta', {}):
                    en_data[hid]['meta']['counters'] = hero_obj['meta']['counters']
                
                merged_count += 1

    print(f"Merged meta for {merged_count} heroes.")

    # 2. Translate table labels and max_skill_1/max_skill_2
    labels_translated = 0
    
    # Pre-translate unique labels to avoid redundant API calls
    unique_labels = set()
    for h in en_data.values():
        for k in ['passive', 'skill1', 'skill2', 'skill3', 'skill4']:
            s = h.get(k, {})
            for form in s.get('forms', []) + [s]:
                table = form.get('table')
                if table:
                    for r in table.get('rows', []):
                        if r and r.get('label'):
                            unique_labels.add(r.get('label'))
                            
    label_map = {}
    print(f"Translating {len(unique_labels)} unique labels...")
    for label in unique_labels:
        if not re.search(r'[ぁ-んァ-ン一-龥]', label):
            label_map[label] = label
            continue
        label_map[label] = translate_text(label)
        time.sleep(0.1)
        
    for h_id, h in en_data.items():
        # Translate meta.max_skill
        meta = h.get('meta', {})
        for sk in ['max_skill_1', 'max_skill_2']:
            if sk in meta and isinstance(meta[sk], str):
                if 'スキル' in meta[sk]:
                    meta[sk] = meta[sk].replace('スキル', 'Skill ')
        
        # Translate tables
        for k in ['passive', 'skill1', 'skill2', 'skill3', 'skill4']:
            s = h.get(k, {})
            for form in s.get('forms', []) + [s]:
                table = form.get('table')
                if table:
                    for r in table.get('rows', []):
                        if r and r.get('label'):
                            orig = r['label']
                            r['label'] = label_map.get(orig, orig)
                            labels_translated += 1
                            
    print(f"Translated {labels_translated} table labels.")
    
    with open(en_file, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
