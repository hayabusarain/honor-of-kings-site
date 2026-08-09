import json

def fix_zhangfei(filepath, lang):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if '171' not in data:
        return
    
    zf = data['171']

    # SKILL 1
    sk1_human_desc = (
        "Zhang Fei swings his snake spear, dealing 600 (600 + 150% extra physical damage) to enemies within range and knocking back enemy heroes. Hitting an enemy unit increases Madness by 3." if lang == 'en' 
        else "張飛は蛇矛を振り回し、範囲内の敵に600（600 + 150%追加物理攻撃力）の物理ダメージを与え、敵ヒーローをノックバックさせる。敵ユニットに命中すると狂気が3増加する。"
    )
    sk1_demon_desc = (
        "Zhang Fei smashes the ground, dealing 600 (600 + 150% extra physical damage + 4% max health) physical damage to enemies within range. Enemies in the center are launched for 0.5s." if lang == 'en'
        else "張飛は地面を叩きつけ、範囲内の敵に600（600 + 150%追加物理攻撃力 + 4%最大HP）の物理ダメージを与える。中心にいる敵は0.5秒間打ち上げられる。"
    )
    sk1_demon_name = "Mad Slaughter" if lang == 'en' else "狂気の殺戮"

    sk1_table = {
        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
        "rows": [
            { "label": "Base Damage", "values": ["600", "720", "840", "960", "1,080", "1,200"] },
            { "label": "Cooldown", "values": ["6", "5.8", "5.6", "5.4", "5.2", "5"] }
        ]
    }

    zf['skill1']['forms'] = [
        {
            "name": "Human Form" if lang == 'en' else "人間形態",
            "description": sk1_human_desc,
            "table": sk1_table
        },
        {
            "name": "Demon Form" if lang == 'en' else "魔神形態",
            "description": sk1_demon_desc,
            "table": sk1_table
        }
    ]

    # SKILL 2
    sk2_human_desc = (
        "Zhang Fei leaps to the target location and activates a mark, granting a shield that negates 650 (650 + 13% extra health) damage to teammates within range. He gains 3 Madness from using the skill and 1 extra Madness for each shield granted to teammates." if lang == 'en'
        else "張飛は指定位置に跳躍してマークを発動し、範囲内の味方に650（650 + 13%追加HP）のダメージを無効化するシールドを付与する。スキル使用で狂気を3獲得し、味方にシールドを付与するごとに狂気を追加で1獲得する。"
    )
    sk2_demon_desc = (
        "Zhang Fei leaps to the target location, trampling enemies within range and dealing 480 (480 + 120% extra physical damage + 4% max health) physical damage. Enemies in the center are launched for 0.5s." if lang == 'en'
        else "張飛は指定位置に跳躍し、範囲内の敵を踏みつけて480（480 + 120%追加物理攻撃力 + 4%最大HP）の物理ダメージを与える。中心にいる敵は0.5秒間打ち上げられる。"
    )

    sk2_human_table = {
        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
        "rows": [
            { "label": "Damage Immunity", "values": ["650", "775", "900", "1,025", "1,150", "1,275"] },
            { "label": "Cooldown", "values": ["10", "9.6", "9.2", "8.8", "8.4", "8"] }
        ]
    }

    sk2_demon_table = {
        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
        "rows": [
            { "label": "Base Damage", "values": ["480", "576", "672", "768", "864", "960"] },
            { "label": "Cooldown", "values": ["10", "9.6", "9.2", "8.8", "8.4", "8"] }
        ]
    }

    zf['skill2']['forms'] = [
        {
            "name": "Human Form" if lang == 'en' else "人間形態",
            "description": sk2_human_desc,
            "table": sk2_human_table
        },
        {
            "name": "Demon Form" if lang == 'en' else "魔神形態",
            "description": sk2_demon_desc,
            "table": sk2_demon_table
        }
    ]

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    fix_zhangfei('public/data/skills/en.json', 'en')
    fix_zhangfei('public/data/skills/ja.json', 'ja')
    print("Fixed Zhang Fei forms!")
