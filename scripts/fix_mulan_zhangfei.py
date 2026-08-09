import json

def main():
    ja_path = 'public/data/skills/ja.json'
    en_path = 'public/data/skills/en.json'

    with open(ja_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    # 1. Update Mulan (154) in EN
    en_mulan_skills = {
        "hero_name": "Mulan",
        "meta": en_data.get('154', {}).get('meta', {}),
        "passive": {
            "name": "Passive Skill: Great Wall Guardian",
            "cooldown_text": "CD: 0s | Mana: 0",
            "tags": ["Speed Up", "Silence", "Slow"],
            "description": "While her dual swords are drawn, Mulan gains 40 Movement Speed, and her Basic Attacks and skills place 1 stack of Balance on enemy heroes every second for 5s. At 5 stacks, the marks detonate, dealing 225 (+140% extra Physical Attack) physical damage to enemies while silencing them and slowing them immensely for 1s. While her heavy sword is drawn, her Attack Speed is reduced, but Basic Attacks deal an extra (+50% extra Physical Attack) damage. She also gains crowd control immunity and 45% damage reduction while using skills."
        },
        "skill1": {
            "name": "Skill 1: Snaking Strike / Sundering Slash",
            "forms": [
                {
                    "form_name": "Light Sword Form",
                    "skill_name": "Skill 1: Snaking Strike",
                    "cooldown_text": "CD: 8s",
                    "tags": ["Movement", "Damage"],
                    "description": "Mulan dashes in the target direction. During the dash, she can dash again by using the movement wheel. Each dash deals 134 (70 + 40% extra Physical Attack) physical damage to enemies in her path. If she hits an enemy during the dash, she can use this skill again within 5s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["70", "84", "98", "112", "126", "140"] },
                            { "label": "Cooldown", "values": ["8", "7.6", "7.2", "6.8", "6.4", "6"] }
                        ]
                    }
                },
                {
                    "form_name": "Heavy Sword Form",
                    "skill_name": "Skill 1: Sundering Slash",
                    "cooldown_text": "CD: 8s",
                    "tags": ["Damage", "Crowd Control"],
                    "description": "Mulan charges up and swings her sword in the target direction, dealing 216 (120 + 60% extra Physical Attack) - 1,083 (600 + 300% extra Physical Attack) physical damage to enemies within range. Damage dealt depends on the duration of the charge. If she charges up for 0.75s, hit enemies are slowed by 25% for 2s. If she charges up for 1.5s or more, hit enemies are launched for 0.5s. If she hits an enemy with this skill, she can use it again within 5s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["120", "144", "168", "192", "216", "240"] },
                            { "label": "Max Damage", "values": ["600", "720", "840", "960", "1,080", "1,200"] },
                            { "label": "Cooldown", "values": ["8", "7.6", "7.2", "6.8", "6.4", "6"] }
                        ]
                    }
                }
            ]
        },
        "skill2": {
            "name": "Skill 2: Dagger Waltz / Blade Flurry",
            "forms": [
                {
                    "form_name": "Light Sword Form",
                    "skill_name": "Skill 2: Dagger Waltz",
                    "cooldown_text": "CD: 12s",
                    "tags": ["Slow", "Damage", "Cooldown"],
                    "description": "Mulan throws a sword in the target direction, dealing 400 (400 + 110% extra Physical Attack) physical damage to enemies in its path. When the sword reaches its max range, it spins in place for 3s, dealing 160 (160 + 50% extra Physical Attack) physical damage to enemies within range every 0.5s and reducing their Movement Speed by 25% for 1s. She can retrieve the sword by walking next to it. Doing so reduces the skill's Cooldown by 5s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["400", "480", "560", "640", "720", "800"] },
                            { "label": "Damage Over Time", "values": ["160", "192", "224", "256", "288", "320"] },
                            { "label": "Slow", "values": ["25%", "30%", "35%", "40%", "45%", "50%"] },
                            { "label": "Cooldown", "values": ["12", "11.6", "11.2", "10.8", "10.4", "10"] }
                        ]
                    }
                },
                {
                    "form_name": "Heavy Sword Form",
                    "skill_name": "Skill 2: Blade Flurry",
                    "cooldown_text": "CD: 12s",
                    "tags": ["Crowd Control", "Damage"],
                    "description": "Mulan advances in the target direction while slashing 4 times with her sword. Each slash deals 320 (320 + 85% extra Physical Attack) physical damage and knocks back enemies within range while reducing their Movement Speed by 25% for 2s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["320", "384", "448", "512", "576", "640"] },
                            { "label": "Slow", "values": ["25%", "30%", "35%", "40%", "45%", "50%"] },
                            { "label": "Cooldown", "values": ["12", "11.6", "11.2", "10.8", "10.4", "10"] }
                        ]
                    }
                }
            ]
        },
        "skill3": {
            "name": "Skill 3: Blooming Blade",
            "forms": [
                {
                    "form_name": "Light Sword Form",
                    "skill_name": "Skill 3: Blooming Blade (Light)",
                    "cooldown_text": "CD: 6s",
                    "tags": ["Switch Form", "Enhance", "Damage"],
                    "description": "Mulan draws her heavy sword and executes a sweeping slash, dealing physical damage to nearby enemies and gaining Attack Speed for 5s. She can use her heavy sword skills while her heavy sword is drawn.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3"],
                        "rows": [
                            { "label": "Base Damage", "values": ["200", "280", "360"] },
                            { "label": "Attack Speed", "values": ["60%", "75%", "90%"] }
                        ]
                    }
                },
                {
                    "form_name": "Heavy Sword Form",
                    "skill_name": "Skill 3: Blooming Blade (Heavy)",
                    "cooldown_text": "CD: 6s",
                    "tags": ["Switch Form", "Enhance", "Damage"],
                    "description": "Mulan draws her dual swords and makes a sweeping slash, dealing 377 (200 + 110% extra Physical Attack) physical damage to nearby enemies and gaining 60% Attack Speed for 5s. She gains 40 Movement Speed and can use her dual sword skills while her dual swords are drawn.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3"],
                        "rows": [
                            { "label": "Base Damage", "values": ["200", "280", "360"] },
                            { "label": "Movement Speed", "values": ["40", "50", "60"] }
                        ]
                    }
                }
            ]
        }
    }
    en_data['154'] = en_mulan_skills

    # Also update Mulan in JA (154) to have form tabs
    ja_data['154'] = {
        "hero_name": "花木蘭",
        "passive": {
            "name": "長城の守護者",
            "description": "双剣使用時は移動速度が上昇し、通常攻撃とスキルで印を付与する。印が5スタックになると爆発し物理ダメージとサイレンス・スロウを与える。大剣使用時は攻撃速度が低下するが、通常攻撃のダメージが上昇し、スキル使用中に覇体と被ダメージ軽減を獲得する。"
        },
        "skill1": {
            "name": "迅影勢 / 烈空斬",
            "forms": [
                {"form_name": "双剣形態", "skill_name": "スキル1: 迅影勢 (双剣)", "description": "指定方向に突進し、範囲内の敵に物理ダメージを与える。命中すると5秒以内に再発動可能。"},
                {"form_name": "重剣形態", "skill_name": "スキル1: 烈空斬 (重剣)", "description": "溜め攻撃を行い、正面の広範囲に物理ダメージを与える。溜め時間に応じてスロウ・ノックアップ効果が付与される。"}
            ]
        },
        "skill2": {
            "name": "旋舞華 / 迅烈斬",
            "forms": [
                {"form_name": "双剣形態", "skill_name": "スキル2: 旋舞華 (双剣)", "description": "短剣を投げ、経路上の敵にダメージとスロウを与える。落ちた短剣を拾うとCDが短縮される。"},
                {"form_name": "重剣形態", "skill_name": "スキル2: 迅烈斬 (重剣)", "description": "連続で剣を振り下ろしながら前進し、敵をノックバックさせて移動速度を低下させる。"}
            ]
        },
        "skill3": {
            "name": "綻放刀鋒",
            "forms": [
                {"form_name": "双剣形態", "skill_name": "スキル3: 綻放刀鋒 (双剣切替)", "description": "大剣に持ち替え、周囲に物理ダメージを与えて攻撃速度を大幅に上昇させる。"},
                {"form_name": "重剣形態", "skill_name": "スキル3: 綻放刀鋒 (重剣切替)", "description": "双剣に持ち替え、周囲に物理ダメージを与えて移動速度を上昇させる。"}
            ]
        }
    }

    # 2. Update Zhang Fei (171) skill3 in EN
    if '171' in en_data:
        z171 = en_data['171']
        if 'skill3' in z171:
            z171['skill3']['forms'] = [
                {
                    "form_name": "Human Form",
                    "skill_name": "Skill 3: Unbridled Outburst",
                    "cooldown_text": "CD: 40s",
                    "tags": ["Transform", "Shield", "Crowd Control"],
                    "description": "Zhang Fei consumes all Madness to transform into a Demonic Beast, gaining a massive shield and roaring forward to knock back and stun enemies in his path, creating a pathway that grants bonus Movement Speed."
                },
                {
                    "form_name": "Demon Form",
                    "skill_name": "Skill 3: Demonic Roar",
                    "cooldown_text": "CD: 40s",
                    "tags": ["Damage", "Slow"],
                    "description": "While transformed, Zhang Fei leaps and smashes the ground, dealing high Physical Damage to nearby enemies and slowing them."
                }
            ]

    with open(ja_path, 'w', encoding='utf-8') as f:
        json.dump(ja_data, f, ensure_ascii=False, indent=2)

    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

    print("Successfully updated Mulan (154) and Zhang Fei (171) forms in ja.json and en.json!")

if __name__ == '__main__':
    main()
