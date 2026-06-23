import json
import urllib.request
import urllib.parse
import re

exact_map = {
    # Hero Names
    "アタ": "Ata",
    "影": "Umbrosa",
    "少司縁": "Shao Siyuan",
    "元流の子（タンク）": "Flowborn (Tank)",
    "元流の子（メイジ）": "Flowborn (Mage)",
    "后羿": "Hou Yi",
    "廉頗": "Lian Po",
    "ミレディ": "Milady",
    "元流の子（マークスマン）": "Flowborn (Marksman)",
    "カルラ": "Garuda",
    "妲己": "Daji",
    "魯班7号": "Luban No.7",
    
    # Hero Titles
    "ホワイトアンカー": "White Anchor",
    "深淵の東君": "Dongjun of the Abyss",
    "願いの紡ぎ手": "Weaver of Wishes",
    "守護の道": "Path of Guardian",
    "万象の心": "Heart of All",
    "太陽を射抜く者": "Sun Shooter",
    "アースシェイカー": "Earthshaker",
    "築城者": "Builder",
    "不屈の意志": "Unyielding Will",
    "慈愛の守護者": "Guardian of Compassion",
    "魅惑の狐": "Charming Fox",
    "機械兵器": "Machine Weapon",
    
    # Roles & Subroles
    "タンク": "Tank",
    "先鋒型タンク": "Vanguard Tank",
    "ファイター": "Fighter",
    "突撃型ファイター": "Charge Fighter",
    "メイジ": "Mage",
    "砲台型メイジ": "Artillery Mage",
    "範囲攻撃型メイジ": "AoE Mage",
    "マークスマン": "Marksman",
    "連射型マークスマン": "Rapid-fire Marksman",
    "俊敏型マークスマン": "Agile Marksman",
    "サポート": "Support",
    "バフ系サポート": "Buff Support",
    "サポート/メイジ": "Support/Mage",
    
    # Difficulty
    "イージー": "Easy",
    "ノーマル": "Normal",
    "ハード": "Hard",
    
    # Tags
    "ダメージ": "Damage",
    "CC": "CC",
    "移動速度減少": "Slow",
    "移動速度増加": "Speed Up",
    "移動": "Dash",
    "回復": "Recovery",
    "治療": "Heal",
    "シールド": "Shield",
    "地形": "Terrain",
    "視界": "Vision",
    "召喚": "Summon",
    "強化": "Enhance",
    "スーパーアーマー": "Iron Body",
    "不屈": "Unyielding",
    "ノックバック": "Knockback",
    "ウィークネス": "Weakness",
    
    # Spells
    "閃現": "Flash",
    "処刑": "Execute",
    "懲撃": "Smite",
    "治療": "Heal",
    "気絶": "Stun",
    "浄化": "Purify",

    # Hero Synergies / Counters
    "貂蝉": "Diaochan",
    "小喬": "Xiao Qiao",
    "百里守約": "Shouyue",
    "孫尚香": "Sun Shangxiang",
    "ヤリア": "Yaria",
    "荘周": "Zhuangzi",
    "狄仁傑": "Di Renjie",
    "孫臏": "Sun Bin",
    "鏡": "Jing",
    "蘭陵王": "Prince of Lanling",
    "張良": "Zhang Liang",
    "諸葛亮": "Zhuge Liang",
    "マルコポーロ": "Marco Polo",
    "呂布": "Lu Bu",
    "張飛": "Zhang Fei",
    "アレシオ": "Alessio",
    "公孫離": "Gongsun Li",
    "不知火舞": "Mai Shiranui",
    "子牙": "Ziya",
    "蔡文姫": "Cai Yan",
    "孫悟空": "Sun Wukong",
    "阿軻": "Ake",
    "花木蘭": "Mulan",
    "韓信": "Han Xin",
    "雲中君": "Yunzhongjun",
    
    # Skills - Ata
    "パイレーツマインド": "Child of the Sea",
    "ウェーブ・ウォーク": "Wavewalking",
    "シー・アンカー": "Sea Anchor",
    "ゴーストシップ": "Ghost Ship",
    
    # Skills - Umbrosa
    "マッドネスフェザー": "Whirling Featherblades",
    "インサニティステップ": "Feverish Dance",
    "フェザーストーム": "Feathered Tempest",
    "ラストダンス": "Final Frenzy",
    
    # Skills - Shao Siyuan
    "吟行": "Journey of the Bard",
    "心を一つに": "United Hearts",
    "縁の仲立ち": "Matchmaker",
    "めぐり逢わせ": "Fateful Encounter",

    # Skills - Flowborn (Tank/Mage/Marksman)
    "万物の流れ": "Flow of the World",
    "パッシブスキル：万物の流れ": "Flow of the World",
    "流結の儀": "Convergence",
    "スキル1：流結の儀": "Convergence",
    "内なる力": "Power From Within",
    "傾注の一撃": "Devoted Strike",
    "引流の陣": "Flowing Array",
    "スキル2：引流の陣": "Flowing Array",
    "万象の法": "Law of All Things",
    "スキル3：万象の法": "Law of All Things",
    "破釜の矢": "Arrow of No Retreat",
    "スキル2：破釜の矢": "Arrow of No Retreat",
    "万矢の嵐": "Arrowstorm",
    "スキル3：万矢の嵐": "Arrowstorm",

    # Skills - Hou Yi
    "裁きの矢": "Chastising Shot",
    "乱れ矢雨": "Arrow Volley",
    "日没の残光": "Afterglow",
    "灼熱の矢": "Burning Sun Arrow",

    # Skills - Lian Po
    "勇士の魂": "Warrior's Soul",
    "パッシブスキル：勇士の魂": "Warrior's Soul",
    "爆裂アタック": "Burst Ram",
    "スキル1：爆裂アタック": "Burst Ram",
    "溶岩重撃": "Magma Slam",
    "スキル2：溶岩重撃": "Magma Slam",
    "天地崩壊": "Tremor Smash",
    "スキル3：天地崩壊": "Tremor Smash",

    # Skills - Milady
    "ロボット": "Mechanical Minions",
    "戦闘機爆撃": "Air Superiority",
    "強制進撃": "Forced Invasion",
    "磁場の刻印": "Chaos Field",

    # Skills - Garuda
    "鋭羽": "Sharp Feather",
    "黄金の羽矢": "Golden Feather Arrow",
    "金翅の加護": "Protection of Golden Wings",
    "審判の翼": "Wings of Judgment",

    # Skills - Daji
    "ロストマインド": "Captivate",
    "ソウルショック": "Soul Impact",
    "アイドルチャーム": "Strike a Pose",
    "ハートブレイカー": "Heartbreaker",

    # Skills - Luban No.7
    "火力制圧": "Suppressive Fire",
    "フグ爆弾": "Blowfish Grenade",
    "シャークキャノン": "Shark Cannon",
    "空中支援": "Air Support",

    # Skills arrays replacements (wrong data from other heroes)
    "龍の咆哮": "Dragon's Roar",
    "驚雷の龍": "Thunder Dragon",
    "破雲の龍": "Cloud-Piercing Dragon",
    "天翔の龍": "Sky-Soaring Dragon",
    "兼愛非攻": "Universal Love",
    "和平遊歩": "Peaceful Walk",
    "機械式重砲": "Mechanical Heavy Cannon",
    "墨守成規": "Strict Defense",
    "活力爆発": "Vitality Burst",
    "全力突撃": "Rolling Assault",
    "紅蓮爆弾": "Red Lotus Bomb",
    "究極弩砲": "Ultimate Crossbow"
}

table_labels = {
    "追加ダメージ": "Extra Damage",
    "クールダウン": "Cooldown",
    "基本ダメージ": "Base Damage",
    "衝突ダメージ": "Collision Damage",
    "移動速度減少": "Movement Speed Reduction",
    "移動速度増加": "Movement Speed Increase",
    "攻撃速度増加": "Attack Speed Increase",
    "飛刃ダメージ": "Featherblade Damage",
    "自己回復": "Self Heal",
    "刻印ダメージ": "Mark Damage",
    "HP回復": "HP Regen",
    "通常攻撃ダメージ": "Basic Attack Damage",
    "基本回復": "Base Heal",
    "祝福回復": "Blessing Heal",
    "秒間ダメージ": "Damage per Second",
    "発動ダメージ": "Activation Damage",
    "持続ダメージ": "Continuous Damage",
    "追加回復": "Extra Heal",
    "強化通常攻撃ダメージ": "Enhanced Attack Damage",
    "命中時回復": "Heal on Hit",
    "ノックバックダメージ": "Knockback Damage",
    "斬撃ダメージ": "Slash Damage",
    "基本シールド": "Base Shield",
    "範囲ダメージ": "Area Damage",
    "攻撃速度": "Attack Speed",
    "スタック時間": "Stack Time",
    "分裂ダメージ": "Split Damage",
    "最大HP": "Max HP",
    "物理攻撃": "Physical Attack",
    "移動速度": "Movement Speed",
    "クールダウン短縮": "Cooldown Reduction",
    "シールド増加": "Shield Increase",
    "パッシブ移動速度": "Passive Movement Speed",
    "ロストマインド効果": "Captivate Effect",
    "ヒーローへのダメージ": "Damage to Heroes",
    "非ヒーローへのダメージ": "Damage to Non-Heroes",
    "失ったHP": "Lost HP",
    "矢の数": "Number of Arrows"
}
exact_map.update(table_labels)

cache = {}

def term_replacement(text):
    text = text.replace("アタ", "Ata")
    text = text.replace("少司縁", "Shao Siyuan")
    text = text.replace("后羿", "Hou Yi")
    text = text.replace("廉頗", "Lian Po")
    text = text.replace("ミレディ", "Milady")
    text = text.replace("カルラ", "Garuda")
    text = text.replace("妲己", "Daji")
    text = text.replace("魯班7号", "Luban No.7")
    text = text.replace("元流の子", "Flowborn")
    
    text = text.replace("通常攻撃", "basic attack")
    text = text.replace("物理ダメージ", "physical damage")
    text = text.replace("魔法ダメージ", "magical damage")
    text = text.replace("確定ダメージ", "true damage")
    text = text.replace("物理攻撃力", "physical attack")
    text = text.replace("魔法攻撃力", "magical attack")
    text = text.replace("物理攻撃", "physical attack")
    text = text.replace("魔法攻撃", "magical attack")
    text = text.replace("最大HP", "max health")
    text = text.replace("追加HP", "extra health")
    text = text.replace("追加物理攻撃", "extra physical attack")
    text = text.replace("移動速度", "movement speed")
    text = text.replace("攻撃速度", "attack speed")
    text = text.replace("クールダウン", "cooldown")
    text = text.replace("シールド", "shield")
    text = text.replace("ノックアップ", "knock up")
    text = text.replace("スタン", "stun")
    text = text.replace("スネア", "root")
    text = text.replace("ノックバック", "knockback")
    text = text.replace("スーパーアーマー", "iron body")
    text = text.replace("タワー", "tower")
    text = text.replace("クリスタル", "crystal")
    text = text.replace("ミニオン", "minion")
    text = text.replace("ヒーロー", "hero")
    
    return text

def api_translate(text):
    if not text.strip(): return text
    if text in cache: return cache[text]
    
    if text in exact_map:
        cache[text] = exact_map[text]
        return exact_map[text]
        
    url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=' + urllib.parse.quote(text)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        res = ''.join([sentence[0] for sentence in data[0] if sentence[0]])
        res = term_replacement(res)
        cache[text] = res
        return res
    except Exception as e:
        print("API error:", e)
        return text

def translate_node(d):
    if isinstance(d, dict):
        new_d = {}
        for k, v in d.items():
            if k == 'status_text' and isinstance(v, str):
                new_d[k] = translate_status(v)
            else:
                new_d[k] = translate_node(v)
        return new_d
    elif isinstance(d, list):
        return [translate_node(x) for x in d]
    elif isinstance(d, str):
        if any(ord(c) > 127 for c in d):
            return api_translate(d)
        else:
            return d
    else:
        return d

def translate_status(text):
    if not text: return ''
    mapping = {
        '基本ステータス': 'Basic Attributes',
        '最大HP': 'Max HP',
        '最大MP': 'Max Mana',
        'エネルギー': 'Energy',
        '物理攻撃': 'Physical Attack',
        '魔法攻撃': 'Magical Attack',
        '物理防御': 'Physical Defense',
        '魔法防御': 'Magical Defense',
        '攻撃ステータス': 'Attack Attributes',
        '移動速度': 'Movement Speed',
        '物理防御貫通': 'Physical Pierce',
        '魔法防御貫通': 'Magical Pierce',
        '攻撃速度ボーナス': 'Attack Speed Bonus',
        'クリティカル率': 'Critical Rate',
        'クリティカル効果': 'Critical Damage',
        '物理ライフスティール': 'Physical Lifesteal',
        '魔法ライフスティール': 'Magical Lifesteal',
        'クールダウン短縮': 'Cooldown Reduction',
        '攻撃範囲': 'Attack Range',
        '遠距離': 'Ranged',
        '近距離': 'Melee',
        '防御ステータス': 'Defense Attributes',
        '耐性': 'Resistance',
        '5秒ごとのHP回復': 'HP Regen/5s',
        '5秒ごとのMP回復': 'Mana Regen/5s',
        '5秒ごとのエネルギー回復': 'Energy Regen/5s',
        'ステータス': 'Attributes',
        '最大闘志': 'Max Fighting Spirit',
        '闘志回復': 'Fighting Spirit Regen'
    }
    for k, v in mapping.items():
        text = text.replace(k, v)
    return text

if __name__ == "__main__":
    with open('chunk_2.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for s in exact_map:
        cache[s] = exact_map[s]
        
    translated_data = translate_node(data)
    
    with open('chunk_2_translated.json', 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
    print("Translation complete!")
