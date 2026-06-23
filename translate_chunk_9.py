import json
import time
from deep_translator import GoogleTranslator

input_file = "c:/Users/81901/Desktop/オナーオブキングスサイト/chunk_9.json"
output_file = "c:/Users/81901/Desktop/オナーオブキングスサイト/chunk_9_translated.json"

with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

translator = GoogleTranslator(source='ja', target='en')

OFFICIAL_NAMES = {
    "hero_082": {
        "hero_name": "Ming",
        "hero_title": "Peony Diviner",
        "passive": "Passive: Good Omens",
        "skill1": "Skill 1: Time - Carefree",
        "skill2": "Skill 2: Mastery - Glide",
        "skill3": "Skill 3: Peace - Longevity",
    },
    "hero_083": {
        "hero_name": "Pei",
        "hero_title": "Tiger Fist",
        "passive": "Passive: Blast",
        "skill1": "Skill 1: Striker Stance",
        "skill2": "Skill 2: Guarding Stance",
        "skill3": "Skill 3: Tiger Form",
        "forms": {
            "skill1": ["Skill 1: Striker Stance", "Skill 1: Roaring Tiger Stance"],
            "skill2": ["Skill 2: Guarding Stance", "Skill 2: Leaping Tiger Stance"],
            "skill3": ["Skill 3: Tiger Form", "Skill 3: Human Form"]
        }
    },
    "hero_084": {
        "hero_name": "Biron",
        "hero_title": "Indomitable Mechanical Arm",
        "passive": "Passive: Fearless Chariot",
        "skill1": "Skill 1: Electrifying Charge",
        "skill2": "Skill 2: Storm Strike",
        "skill3": "Skill 3: Force Field Suppression"
    },
    "hero_085": {
        "hero_name": "Yaria",
        "hero_title": "Deer Spirit",
        "passive": "Passive: Deer Spirit",
        "skill1": "Skill 1: Wandering Beam",
        "skill2": "Skill 2: Accelerating Blitz",
        "skill3": "Skill 3: Verdant Protector"
    },
    "hero_086": {
        "hero_name": "Yunzhongjun",
        "hero_title": "Wings of Flowing Clouds",
        "passive": "Passive: Cloud God's Wings",
        "skill1": "Skill 1: Heavenly Rumble",
        "skill2": "Skill 2: Ruoying - Dance of Flowers",
        "skill3": "Skill 3: Wind and Thunder Guidance"
    },
    "hero_087": {
        "hero_name": "Li Xin",
        "hero_title": "Sword of the World",
        "passive": "Passive: Ashen Razor",
        "skill1": "Skill 1: Lightning Dash",
        "skill2": "Skill 2: Chaos Wave",
        "skill3": "Skill 3: Light Awakening",
        "skill4": "Skill 4: Dark Awakening",
        "forms": {
            "passive": ["Passive: Ashen Razor", "Passive: Scorched Strikes", "Passive: Void Slice"],
            "skill1": ["Skill 1: Lightning Dash", "Skill 1: Righteous Charge", "Skill 1: Righteous Fervor"],
            "skill2": ["Skill 2: Chaos Wave", "Skill 2: Blade Flurry", "Skill 2: Brutal Gouge"],
            "skill3": ["Skill 3: Light Awakening", "Skill 3: Searing Edge", "Skill 3: Shadow Seal"],
            "skill4": ["Skill 4: Dark Awakening", "Skill 4: Force Break", "Skill 4: Force Mastery"]
        }
    },
    "hero_088": {
        "hero_name": "Garo",
        "hero_title": "Demon-Piercing Arrow",
        "passive": "Passive: Piercing Arrow",
        "skill1": "Skill 1: Enchanted Arrows",
        "skill2": "Skill 2: Silent Arrow",
        "skill3": "Skill 3: Sphere of Purity"
    },
    "hero_089": {
        "hero_name": "Sun Ce",
        "hero_title": "Conqueror of the Seas",
        "passive": "Passive: Raging Tide",
        "skill1": "Skill 1: Wave Render",
        "skill2": "Skill 2: Typhoon",
        "skill3": "Skill 3: Set Sail!"
    },
    "hero_090": {
        "hero_name": "Shangguan",
        "hero_title": "The Calligrapher",
        "passive": "Passive: Piercing Brush",
        "skill1": "Skill 1: Ink Burst",
        "skill2": "Skill 2: Seething Script",
        "skill3": "Skill 3: Finishing Stroke"
    },
    "hero_091": {
        "hero_name": "Allain",
        "hero_title": "Blade of Memories",
        "passive": "Passive: Howling Blade",
        "skill1": "Skill 1: Meteor Kill",
        "skill2": "Skill 2: Moonlight Flash",
        "skill3": "Skill 3: Death at Sunset"
    },
    "hero_092": {
        "hero_name": "Augran",
        "hero_title": "The Seer",
        "passive": "Passive: Soul Resonance",
        "skill1": "Skill 1: Path of Passing",
        "skill2": "Skill 2: Death's Precipice",
        "skill3": "Skill 3: Conductor of Souls"
    },
    "hero_093": {
        "hero_name": "Loong",
        "hero_title": "Dragon of the Blue Sky",
        "passive": "Passive: Hidden Dragon",
        "skill1": "Skill 1: Flaming Palm",
        "skill2": "Skill 2: Downpour",
        "skill3": "Skill 3: Riding the Wind",
        "skill4": "Skill 4: Infinite Vastness"
    }
}

# Apply explicit overrides first
for hero_id, hero_data in data.items():
    off = OFFICIAL_NAMES.get(hero_id)
    if off:
        if 'hero_name' in off: hero_data['hero_name'] = off['hero_name']
        if 'hero_title' in off: hero_data['hero_title'] = off['hero_title']
        if 'passive' in off and 'passive' in hero_data: hero_data['passive']['name'] = off['passive']
        for i in range(1, 5):
            skey = f"skill{i}"
            if skey in off and skey in hero_data:
                hero_data[skey]['name'] = off[skey]
                
        if 'forms' in off:
            for s_key, forms_list in off['forms'].items():
                if s_key in hero_data and 'forms' in hero_data[s_key]:
                    for idx, f_name in enumerate(forms_list):
                        if idx < len(hero_data[s_key]['forms']):
                            hero_data[s_key]['forms'][idx]['name'] = f_name

def translate_text(text):
    if not isinstance(text, str) or not text.strip():
        return text
        
    if text.startswith("CD") or text.isdigit() or text.replace('.', '', 1).isdigit() or text.endswith('%'):
        if text.startswith("CD : ") or text.startswith("CD:"):
            return text.replace("秒", "s")
        if text.replace('%', '').replace('.', '').isdigit():
            return text
            
    replacements = {
        "明世隠": "Ming", "裴擒虎": "Pei", "狂鉄": "Biron", "瑶": "Yaria",
        "雲中君": "Yunzhongjun", "李信": "Li Xin", "伽羅": "Garo", "孫策": "Sun Ce",
        "上官婉児": "Shangguan", "アレン": "Allain", "大司命": "Augran", "白龍": "Loong",
        "サポート": "Support", "アサシン": "Assassin", "ファイター/タンク": "Fighter/Tank",
        "マークスマン": "Marksman", "メイジ/アサシン": "Mage/Assassin", "ファイター": "Fighter",
        "ノーマル": "Normal", "ハード": "Hard", "ベリーハード": "Very Hard",
        "基本ダメージ": "Base Damage", "クールダウン": "Cooldown", "移動速度減少": "Movement Speed Reduction"
    }
    
    for ja, en in replacements.items():
        text = text.replace(ja, en)
        
    if all(ord(c) < 128 for c in text):
        return text
        
    try:
        translated = translator.translate(text)
        time.sleep(0.1)
        return translated
    except Exception as e:
        print(f"Error translating '{text[:20]}...': {e}")
        time.sleep(1)
        try:
            return translator.translate(text)
        except:
            return text

def process_dict(d):
    for k, v in d.items():
        if isinstance(v, dict):
            process_dict(v)
        elif isinstance(v, list):
            for i in range(len(v)):
                if isinstance(v[i], dict):
                    process_dict(v[i])
                elif isinstance(v[i], str):
                    v[i] = translate_text(v[i])
        elif isinstance(v, str):
            if k in ['hero_id', 'icon', 'hero_id_ref'] or v.startswith('/images/'):
                continue
            d[k] = translate_text(v)

print("Starting translation process...")
process_dict(data)

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Translation completed successfully!")
