import json
import glob
import re

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
    
    label_map = {
        "耐性減少": "Resist Reduction",
        "通常攻撃強化ダメージ": "Enhanced Basic Attack Damage",
        "攻撃速度＆移動速度": "Attack & Movement Speed",
        "チャージ速度増加": "Charge Speed Bonus",
        "灼熱ダメージ": "Burning Damage",
        "通常攻撃強化": "Enhanced Basic Attack",
        "移動速度ボーナス": "Movement Speed Bonus",
        "基本回復": "Base Regen",
        "薙ぎ払いダメージ": "Sweep Damage",
        "追加HP回復": "Bonus HP Regen",
        "ヒーローへのダメージ": "Damage to Heroes",
        "物理攻撃ボーナス": "Physical Attack Bonus",
        "2回目ダメージ": "2nd Hit Damage",
        "通常攻撃時回復": "Basic Attack Regen",
        "清平回復": "Qingping Regen",
        "陣のダメージ": "Array Damage",
        "着地ダメージ": "Landing Damage",
        "クールダウン短縮": "Cooldown Reduction",
        "命中時回復": "On-Hit Regen",
        "HP増加": "HP Bonus",
        "破陣ダメージ": "Formation Breaker Damage",
        "破甲割合": "Armor Pen %",
        "被ダメージ軽減割合": "Damage Reduction %",
        "接触ダメージ": "Contact Damage",
        "武器飛行ダメージ": "Weapon Flight Damage",
        "追加攻撃": "Bonus Attack",
        "物理および魔法防御減少": "Physical & Magical Def Reduction",
        "最後の攻撃のダメージ": "Final Hit Damage",
        "HP回復": "HP Regen",
        "爆発ダメージ": "Explosion Damage",
        "瞬発加速": "Instant Acceleration",
        "経路ダメージ": "Path Damage",
        "物理ダメージ": "Physical Damage",
        "基本シールド": "Base Shield",
        "MP回復": "Mana Regen",
        "強化通常攻撃ダメージ": "Enhanced Basic Attack Damage",
        "持続ダメージ": "Continuous Damage",
        "強化通常攻撃": "Enhanced Basic Attack",
        "基本ダメージ": "Base Damage",
        "毎回シールド": "Shield per Hit",
        "ノックバックダメージ": "Knockback Damage",
        "非ヒーローへのダメージ": "Damage to Non-Heroes",
        "攻撃力増加": "Attack Bonus",
        "パッシブ移動速度": "Passive Movement Speed",
        "クリティカル率アップ": "Crit Rate Bonus",
        "物理攻撃": "Physical Attack",
        "移動速度減少": "Movement Speed Reduction",
        "シールド上限": "Shield Cap",
        "その他のシールド": "Other Shields",
        "スタック時間": "Stack Duration",
        "燃焼ダメージ": "Burn Damage",
        "攻撃減少": "Attack Reduction",
        "強化ダメージ": "Enhanced Damage",
        "スタック間隔": "Stack Interval",
        "物理攻撃増加": "Physical Attack Bonus",
        "真っ向斬りダメージ": "Cleave Damage",
        "先端ダメージ": "Tip Damage",
        "突撃ダメージ": "Charge Damage",
        "追加シールド": "Bonus Shield",
        "魔法ダメージ": "Magical Damage",
        "移動速度持続減少": "Continuous Move Speed Reduction",
        "衝突ダメージ": "Collision Damage",
        "引き寄せダメージ": "Pull Damage",
        "通常攻撃ダメージ": "Basic Attack Damage",
        "突き刺しダメージ": "Thrust Damage",
        "通常攻撃追加ダメージ": "Bonus Basic Attack Damage",
        "視界拡大": "Vision Expansion",
        "クールダウン": "Cooldown",
        "範囲ダメージ": "AoE Damage",
        "生死の界壁": "Boundary of Life & Death",
        "氷柱ダメージ": "Icicle Damage",
        "起爆ダメージ": "Detonation Damage",
        "ロストマインド効果": "Lost Mind Effect",
        "最大ダメージ": "Max Damage",
        "移動速度増加": "Movement Speed Bonus",
        "物理防御貫通": "Physical Pierce",
        "失ったHP": "Missing HP",
        "発動間隔": "Activation Interval",
        "幽影の力上限": "Shadow Power Cap",
        "チャージダメージ": "Charge Damage",
        "ダメージ比率": "Damage Ratio",
        "シールド増加": "Shield Bonus",
        "剣気ダメージ": "Sword Aura Damage",
        "回復時間": "Recovery Time",
        "移動速度吸収": "Move Speed Steal",
        "強化回復": "Enhanced Regen",
        "被ダメージ軽減": "Damage Reduction",
        "破壊ダメージ": "Destruction Damage",
        "初回ダメージ": "Initial Damage",
        "攻撃速度減少": "Attack Speed Reduction",
        "雷撃ダメージ": "Lightning Damage",
        "最大HP": "Max HP",
        "落筆ダメージ": "Brush Drop Damage",
        "扇形範囲ダメージ": "Sector AoE Damage",
        "攻撃速度アップ": "Attack Speed Bonus",
        "サブ属性のダメージ": "Sub-Attribute Damage",
        "発動距離": "Activation Range",
        "突進ダメージ": "Dash Damage",
        "視界増加": "Vision Bonus",
        "基本移動速度": "Base Movement Speed",
        "回避率": "Evasion Rate",
        "剣陣ダメージ": "Sword Array Damage",
        "準備時間": "Prep Time",
        "魔法防御ボーナス": "Magical Defense Bonus",
        "攻撃速度": "Attack Speed",
        "シールド効果": "Shield Effect",
        "熱風ダメージ": "Hot Wind Damage",
        "魔法防御減少": "Magical Defense Reduction",
        "攻撃力": "Attack",
        "物理防御力減少": "Physical Defense Reduction",
        "確定ダメージ": "True Damage",
        "移動速度": "Movement Speed",
        "高速移動間隔": "Dash Interval",
        "追加ダメージ": "Bonus Damage",
        "移動速度減少効果": "Move Speed Slow Effect",
        "天眼ダメージ": "Heavenly Eye Damage",
        "物理防御増加": "Physical Defense Bonus",
        "火矢ダメージ": "Fire Arrow Damage",
        "HP回復比率": "HP Regen Ratio",
        "炎ダメージ": "Flame Damage",
        "物理・魔法防御": "Physical & Magical Defense",
        "物理・魔法防御増加": "Physical & Magical Defense Bonus",
        "攻撃速度増加": "Attack Speed Bonus",
        "斬撃ダメージ": "Slash Damage",
        "シールド": "Shield",
        "基本確定ダメージ": "Base True Damage",
        "嘲罵時間": "Taunt Duration",
        "防御力減少": "Defense Reduction",
        "ダメージブロック": "Damage Block",
        "攻撃速度ボーナス": "Attack Speed Bonus",
        "地面持続ダメージ": "Ground Continuous Damage",
        
        "スキル1": "Skill 1",
        "スキル2": "Skill 2",
        "スキル3": "Skill 3",
        "スキル4": "Skill 4",
        "パッシブ": "Passive",
        "通常形態": "Normal Form",
        "重剣形態": "Heavy Sword Form",
        "双剣形態": "Twin Swords Form",
        "統御形態": "Domination Form",
        "狂暴形態": "Revenge Form",
    }
        
    labels_translated = 0
    for h_id, h in en_data.items():
        # Translate meta.max_skill
        meta = h.get('meta', {})
        for sk in ['max_skill_1', 'max_skill_2']:
            if sk in meta and isinstance(meta[sk], str):
                if meta[sk] in label_map:
                    meta[sk] = label_map[meta[sk]]
                elif 'スキル' in meta[sk]:
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
