import json

def main():
    ja_path = 'public/data/skills/ja.json'
    en_path = 'public/data/skills/en.json'

    with open(ja_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    # 1. Update JA 538
    if '538' in ja_data:
        j538 = ja_data['538']
        
        # Put forms back under skill1, skill2, skill3 if missing
        p_forms = j538.get('passive', {}).get('forms', [])
        if 'forms' in j538.get('passive', {}):
            del j538['passive']['forms']

        # Ensure skill1 has forms
        if 'forms' not in j538.get('skill1', {}):
            s1_name = j538.get('skill1', {}).get('name', '断月')
            s1_desc = j538.get('skill1', {}).get('description', '')
            j538['skill1']['forms'] = [
                {
                    "form_name": "通常",
                    "skill_name": s1_name,
                    "description": s1_desc
                },
                {
                    "form_name": "槍意1スタック:堅意・止水",
                    "skill_name": "槍意1スタック:堅意・止水",
                    "description": "槍を振り回して連続攻撃を行い、移動速度が上昇し、シールドを獲得する。"
                }
            ]

        # Ensure skill2 has forms
        if 'forms' not in j538.get('skill2', {}):
            s2_name = j538.get('skill2', {}).get('name', '追星')
            s2_desc = j538.get('skill2', {}).get('description', '')
            j538['skill2']['forms'] = [
                {
                    "form_name": "通常",
                    "skill_name": s2_name,
                    "description": s2_desc
                },
                {
                    "form_name": "槍意2スタック:鋭意・摧骨",
                    "skill_name": "槍意2スタック:鋭意・摧骨",
                    "description": "3回連続攻撃を行い、HPを回復する。対象のHPが低いほど回復効果が上昇する。"
                }
            ]

        # Ensure skill3 has forms
        if 'forms' not in j538.get('skill3', {}):
            s3_name = j538.get('skill3', {}).get('name', '燎原')
            s3_desc = j538.get('skill3', {}).get('description', '')
            j538['skill3']['forms'] = [
                {
                    "form_name": "通常",
                    "skill_name": s3_name,
                    "description": s3_desc
                },
                {
                    "form_name": "槍意3スタック:真意・燎原",
                    "skill_name": "槍意3スタック:真意・燎原",
                    "description": "空中へ跳び上がり、溜め攻撃で広範囲に大ダメージを与える。地形を無視して移動可能。"
                }
            ]

    # 2. Update EN 538
    en_ying_skills = {
        "hero_name": "Ying",
        "meta": en_data.get('538', {}).get('meta', {}),
        "passive": {
            "name": "Passive Skill: Spear Will - Sweeping Fire",
            "cooldown_text": "CD: 0s | Mana: 0",
            "tags": ["Enhance", "Cooldown"],
            "description": "Ying is mentally linked with her spear, Sweeping Fire. Using skills grants 1 stack of Spear Will. Basic Attacks expend all Spear Will, use the corresponding Spear Will skill (Stalwart - Peacemaker, Zealous - Devastation, or Zenith - Wildfire), and reduce Moonslash and Cloudchaser Cooldown by 1.5s. Spear Will skills can crit and benefit from 50% of Attack Speed."
        },
        "skill1": {
            "name": "Skill 1: Moonslash",
            "forms": [
                {
                    "form_name": "Normal Form",
                    "skill_name": "Skill 1: Moonslash",
                    "cooldown_text": "CD: 10s | Mana: 40",
                    "tags": ["Crowd Control", "Damage"],
                    "description": "Ying swings her spear upward, then slashes downward, executing 2 strikes that each deal 180 (+60% extra Physical Attack) physical damage. The upward strike launches enemies for 0.5s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["180", "216", "252", "288", "324", "360"] },
                            { "label": "Cooldown", "values": ["10", "9.6", "9.2", "8.8", "8.4", "8"] }
                        ]
                    }
                },
                {
                    "form_name": "Spear Will (1 Stack)",
                    "skill_name": "Spear Will (1 stack): Stalwart - Peacemaker",
                    "cooldown_text": "CD: 1s",
                    "tags": ["Shield", "Damage"],
                    "description": "Ying flourishes her spear and attacks repeatedly, gaining 25% Movement Speed for 1s, dealing 124 (55 + 40% extra Physical Attack) physical damage to enemies over 4 strikes, and gaining a shield that negates damage equal to 260 (+4.5% extra Health) for 2s. This skill is cast by using an enhanced Basic Attack at 1 stack of Spear Will."
                }
            ]
        },
        "skill2": {
            "name": "Skill 2: Cloudchaser",
            "forms": [
                {
                    "form_name": "Normal Form",
                    "skill_name": "Skill 2: Cloudchaser",
                    "cooldown_text": "CD: 10s | Mana: 40",
                    "tags": ["Movement", "Speed Up", "Damage"],
                    "description": "Ying raises her spear and charges up, gaining up to 25% Movement Speed. After charging, she dashes forward and executes a horizontal sweep, dealing 180 (+60% extra Physical Attack) - 360 (+120% extra Physical Attack) physical damage to enemies and slowing them by 15% for 1s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["180", "216", "252", "288", "324", "360"] },
                            { "label": "Max Damage", "values": ["360", "432", "504", "576", "648", "720"] },
                            { "label": "Max MSPD Increase", "values": ["25%", "30%", "35%", "40%", "45%", "50%"] },
                            { "label": "Cooldown", "values": ["10", "9.6", "9.2", "8.8", "8.4", "8"] },
                            { "label": "Slow", "values": ["15%", "18%", "21%", "24%", "27%", "30%"] }
                        ]
                    }
                },
                {
                    "form_name": "Spear Will (2 Stacks)",
                    "skill_name": "Spear Will (2 stacks): Zealous - Devastation",
                    "cooldown_text": "CD: 1s",
                    "tags": ["Recovery", "Damage"],
                    "description": "Ying strikes 3 times, dealing 129 (60 + 40% extra Physical Attack) physical damage with each of the first two strikes and restoring 90 (+1.3% extra Health) Health. The final strike deals 258 (120 + 80% extra Physical Attack) physical damage and restores 180 (+2.5% extra Health) Health. This skill is cast by using an enhanced Basic Attack at 2 stacks of Spear Will. The lower her Health, the greater the recovery effect (up to 2x)."
                }
            ]
        },
        "skill3": {
            "name": "Skill 3: Starburn",
            "forms": [
                {
                    "form_name": "Normal Form",
                    "skill_name": "Skill 3: Starburn",
                    "cooldown_text": "CD: 40s | Mana: 80",
                    "tags": ["Dash", "Crowd Control", "Immunity"],
                    "description": "Ying ignites Sweeping Fire's tip and dashes back and forth through the area before her. Each dash deals 180 (+60% extra Physical Attack) physical damage and launches enemies. Upon dashing to maximum range, she launches a flurry of stabs. Each stab deals 90 (+30% extra Physical Attack) physical damage, for a total of 4 stabs. While using this skill, Ying gains crowd control immunity and 30% damage reduction. Upon activating the second phase of the skill, Roaring Sun, she sweeps forward with Sweeping Fire, leaving a trail of fire behind. The sweep deals 180 (+60% extra Physical Attack) physical damage, and the trail of fire deals 50 (+16% extra Physical Attack) magical damage every 0.2s over 3s, for a total of 1 time. While Starburn is active, the second phase of the skill can be used to sweep the area around her, interrupting subsequent dashes, dealing 120 (+40% extra Physical Attack) physical damage, and leaving a circular trail of fire behind for 3s."
                },
                {
                    "form_name": "Spear Will (3 Stacks)",
                    "skill_name": "Spear Will (3 stacks): Zenith - Wildfire",
                    "cooldown_text": "CD: 1s",
                    "tags": ["Damage", "Enhance"],
                    "description": "Ying leaps into the air and charges up before unleashing a sweeping strike, dealing 333 (160 + 100% extra Physical Attack) physical damage to enemies in its path. The lower the target's Health, the greater the damage, up to a maximum of 666 (320 + 200% extra Physical Attack) physical damage when the target's Health is below 50%. This skill is cast by using an enhanced Basic Attack at 3 stacks of Spear Will. While airborne, Ying ignores terrain, gains 200% Movement Speed, and gains 10% damage reduction."
                }
            ]
        }
    }
    en_data['538'] = en_ying_skills

    with open(ja_path, 'w', encoding='utf-8') as f:
        json.dump(ja_data, f, ensure_ascii=False, indent=2)

    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

    print("Restored Ying (538) skill forms for Skill 1, Skill 2, and Skill 3 successfully!")

if __name__ == '__main__':
    main()
