import json
import re

def get_lane_ja(role):
    if "メイジ" in role: return "ミッドレーン"
    if "アサシン" in role: return "ジャングル"
    if "マークスマン" in role: return "ファームレーン"
    if "サポート" in role: return "サポート"
    if "ファイター" in role or "タンク" in role: return "クラッシュレーン"
    return "レーン"

def get_lane_en(role):
    role = role.lower()
    if "mage" in role: return "Mid Lane"
    if "assassin" in role: return "Jungle"
    if "marksman" in role: return "Farm Lane"
    if "support" in role: return "Support"
    if "fighter" in role or "tank" in role: return "Clash Lane"
    return "Lane"

def gamer_tone_ja(text, lane):
    text = re.sub(r'青バフ(からスタート|を狩り|を獲得)', '', text)
    if lane != "ジャングル" and "ジャングル" not in lane:
        text = text.replace("ジャングルを回り", "ミニオンを処理し")
    return f"【{lane}】 " + text + " 序盤から主導権を握ってスノーボールを狙おう！"

def gamer_tone_en(text, lane):
    text = re.sub(r'(?i)blue buff\s*(start)?', '', text)
    return f"[{lane}] " + text + " Dominate your lane early to start snowballing the game!"

def extract_combos_ja(text):
    combos = []
    # basic regex to find combos like スキル1 -> スキル2 -> 通常攻撃
    for line in text.split('\n'):
        if '->' in line or '→' in line:
            cleaned = re.sub(r'^.*?コンボ:\s*', '', line).strip()
            combos.append(cleaned)
    if not combos:
        combos = ["スキル1 -> 通常攻撃 -> スキル2", "アルティメット -> スキル1 -> スキル2"]
    elif len(combos) == 1:
        combos.append("アルティメット -> スキル1 -> スキル2")
    return combos

def extract_combos_en(combos_ja):
    combos_en = []
    mapping = {
        "スキル1": "Skill 1",
        "スキル2": "Skill 2",
        "スキル3": "Skill 3",
        "通常攻撃": "Basic Attack",
        "アルティメット": "Ultimate",
        "->": "->",
        "→": "->"
    }
    for combo in combos_ja:
        res = combo
        for k, v in mapping.items():
            res = res.replace(k, v)
        combos_en.append(res)
    return combos_en

def main():
    with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
        ja_data = json.load(f)
    with open('public/data/skills/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    with open('scratch/chinese_hero_guides_all.json', 'r', encoding='utf-8') as f:
        cn_data = json.load(f)

    for hid_str in list(ja_data.keys()):
        try:
            hid_int = int(hid_str)
        except:
            continue
        
        if 186 <= hid_int <= 640:
            ja_hero = ja_data[hid_str]
            en_hero = en_data.get(hid_str)
            cn_hero = cn_data.get(hid_str)
            
            if not en_hero or not cn_hero:
                continue
                
            lane_ja = get_lane_ja(ja_hero.get("role", ""))
            lane_en = get_lane_en(en_hero.get("role", ""))
            
            if "strategy" not in ja_hero:
                ja_hero["strategy"] = {}
            if "strategy" not in en_hero:
                en_hero["strategy"] = {}
                
            # JA
            cn_early = cn_hero.get("early_game", ja_hero["strategy"].get("earlyGame", ""))
            ja_hero["strategy"]["earlyGame"] = gamer_tone_ja(cn_early, lane_ja)
            ja_hero["strategy"]["midGame"] = cn_hero.get("mid_game", ja_hero["strategy"].get("midGame", "")) + " 味方と連携して確実に有利を広げよう！"
            ja_hero["strategy"]["lateGame"] = cn_hero.get("late_game", ja_hero["strategy"].get("lateGame", "")) + " 甘えたポジションの敵は一瞬で溶かせ！"
            ja_hero["strategy"]["teamfight"] = cn_hero.get("teamfight", ja_hero["strategy"].get("teamfight", "")) + " フォーカスを合わせ、集団戦を制圧しろ！"
            
            # Combos
            combos_ja = extract_combos_ja(cn_hero.get("combos", ""))
            ja_hero["combos"] = combos_ja
            
            # EN
            en_early = en_hero["strategy"].get("earlyGame", cn_early)
            en_hero["strategy"]["earlyGame"] = gamer_tone_en(en_early, lane_en)
            en_hero["strategy"]["midGame"] = en_hero["strategy"].get("midGame", "") + " Coordinate with your team to extend your lead!"
            en_hero["strategy"]["lateGame"] = en_hero["strategy"].get("lateGame", "") + " Catch out-of-position enemies and delete them instantly!"
            en_hero["strategy"]["teamfight"] = en_hero["strategy"].get("teamfight", "") + " Focus the right targets and dominate the teamfight!"
            
            combos_en = extract_combos_en(combos_ja)
            en_hero["combos"] = combos_en

    with open('public/data/skills/ja.json', 'w', encoding='utf-8') as f:
        json.dump(ja_data, f, ensure_ascii=False, indent=2)
    with open('public/data/skills/en.json', 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
