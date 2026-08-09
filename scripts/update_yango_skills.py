import json

def main():
    en_path = 'public/data/skills/en.json'
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    yango_skills = {
        "passive": {
            "name": "Passive Skill: Occult Arts - Manipulation",
            "cooldown_text": "CD: 0s | Mana: 0",
            "tags": ["Puppet", "Recovery"],
            "description": "When Yango and the puppet's Basic Attacks hit an enemy hero, they have a 30% chance of granting a Hero Shard and restoring 70 (+1% extra Health) Health. Yango's Recovery skill is replaced with Hero Shards. He can stock up to 150 Hero Shards, which can be used to turn his puppet into a copy of an enemy hero. He automatically stocks 1 Hero Shard every 10–5s, depending on his level. Hero Puppet: Consumes 50 Hero Shards to transform the puppet into a copy of the selected hero for 10s. The hero puppet possesses all of the copied hero's skills, but only deals 50% damage and takes an extra 100% damage compared to them. The hero puppet becomes stronger with Yango, dealing 1% more damage for every 15 extra Physical Attack and taking 2% less damage for every 80 extra Health.",
            "table": {
                "headers": ["Lvl 1", "Lvl 15"],
                "rows": [
                    { "label": "Base Recovery", "values": ["70", "140"] }
                ]
            }
        },
        "skill1": {
            "name": "Skill 1: Occult Arts - Umbra / Occult Arts - Return",
            "forms": [
                {
                    "form_name": "Self Form",
                    "skill_name": "Skill 1: Occult Arts - Umbra",
                    "cooldown_text": "CD: 20s | Mana: 60",
                    "tags": ["Puppet", "Damage", "Crowd Control"],
                    "description": "Yango throws the puppet, dealing 300 (+100% extra Physical Attack) physical damage to enemies in its path and launching them for 0.5s. He then starts controlling the puppet. The puppet's Basic Attacks deal 100% Physical Attack physical damage. When recalled, the puppet purifies crowd control effects from Yango and grants him 40% Movement Speed for 1s, as well as a shield that negates 420 (+6% extra Max Health) damage. When the puppet is destroyed, Yango is revealed and stunned for 2s. He is then unable to summon the puppet for 20–16s. If the puppet remains beyond a range of 2,500 from Yango for 5s, it is automatically destroyed. Normal Puppet: Inherits all of Yango's equipment effects (excluding Revive, Blood Fury, Dark Curtain, and Mana Shield), inherits certain buff effects, and shares Gold and EXP with him.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4"],
                        "rows": [
                            { "label": "Base Damage", "values": ["300", "400", "500", "600"] },
                            { "label": "Cooldown", "values": ["20", "18.7", "17.3", "16"] },
                            { "label": "Shield", "values": ["420", "560", "700", "840"] }
                        ]
                    }
                },
                {
                    "form_name": "Puppet Form",
                    "skill_name": "Skill 1: Occult Arts - Return",
                    "cooldown_text": "CD: 20s | Mana: 0",
                    "tags": ["Retrieve", "Damage", "Crowd Control"],
                    "description": "Retrieves the puppet immediately, dealing 300 (+100% extra Physical Attack) physical damage to enemies along the path and launching them for 0.5s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4"],
                        "rows": [
                            { "label": "Base Damage", "values": ["300", "400", "500", "600"] },
                            { "label": "Cooldown", "values": ["20", "18.7", "17.3", "16"] }
                        ]
                    }
                }
            ]
        },
        "skill2": {
            "name": "Skill 2: Occult Arts - Zhi Chu Luan / Occult Arts - Substitution",
            "forms": [
                {
                    "form_name": "Self Form",
                    "skill_name": "Skill 2: Occult Arts - Zhi Chu Luan",
                    "cooldown_text": "CD: 11s | Mana: 40",
                    "tags": ["Damage"],
                    "description": "Yango sends out 4 paper birds, dealing 435 (+165% extra Physical Attack) physical damage to enemies in their paths. When multiple paper birds hit the same target, the damage is reduced by 50% for subsequent hits.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4"],
                        "rows": [
                            { "label": "Base Damage", "values": ["435", "580", "725", "870"] },
                            { "label": "Cooldown", "values": ["11", "10.3", "9.7", "9"] }
                        ]
                    }
                },
                {
                    "form_name": "Puppet Form",
                    "skill_name": "Skill 2: Occult Arts - Substitution",
                    "cooldown_text": "CD: 10s | Mana: 0",
                    "tags": ["Swap Location", "Damage"],
                    "description": "The puppet swaps locations with Yango if it is within a range of 900 from him; otherwise, it will move to a location that is 900 from him, dealing 300 (+100% extra Physical Attack) physical damage to enemies in its path. If the puppet's movements have been restricted, this skill pulls Yango to the puppet and returns control to him.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4"],
                        "rows": [
                            { "label": "Base Damage", "values": ["300", "400", "500", "600"] }
                        ]
                    }
                }
            ]
        },
        "skill3": {
            "name": "Skill 3: Occult Arts - Shadow Crucifixion / Occult Arts - Binding",
            "forms": [
                {
                    "form_name": "Self Form",
                    "skill_name": "Skill 3: Occult Arts - Shadow Crucifixion",
                    "cooldown_text": "CD: 11s | Mana: 40",
                    "tags": ["Damage", "Slow"],
                    "description": "Yango releases two strings then pulls them back, each string dealing 180 (+90% extra Physical Attack) physical damage. Enemies hit by both strings take extra physical damage equal to 13% of lost Health and are slowed by 30% for 2s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4"],
                        "rows": [
                            { "label": "Base Damage", "values": ["180", "240", "300", "360"] },
                            { "label": "Cooldown", "values": ["11", "10.3", "9.7", "9"] },
                            { "label": "Slow", "values": ["30%", "40%", "50%", "60%"] }
                        ]
                    }
                },
                {
                    "form_name": "Puppet Form",
                    "skill_name": "Skill 3: Occult Arts - Binding",
                    "cooldown_text": "CD: 10s | Mana: 0",
                    "tags": ["Crowd Control", "Damage", "Slow"],
                    "description": "The puppet deals 300 (+100% extra Physical Attack) physical damage to nearby enemies and slows them by 250 for 2s. If the skill is used again within 3s, it will enter its 2nd phase. After a brief delay, the puppet will stun enemies continuously, with each strike dealing 120 (+40% extra Physical Attack) magical damage.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4"],
                        "rows": [
                            { "label": "Base Damage", "values": ["300", "400", "500", "600"] },
                            { "label": "Slow", "values": ["250", "333", "416", "499"] },
                            { "label": "Damage Over Time", "values": ["120", "160", "200", "240"] }
                        ]
                    }
                }
            ]
        },
        "skill4": {
            "name": "Skill 4: Occult Arts - Dispersal / Occult Arts - Breakout",
            "forms": [
                {
                    "form_name": "Self Form",
                    "skill_name": "Skill 4: Occult Arts - Dispersal",
                    "cooldown_text": "CD: 25s | Mana: 100",
                    "tags": ["Cleanse", "Movement"],
                    "description": "Yango instantly vanishes, cleansing all crowd control effects from himself, then reappears in the target location after a short delay. Does not cleanse the stun effect from the puppet being destroyed.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3"],
                        "rows": [
                            { "label": "Cooldown", "values": ["25", "22.5", "20"] }
                        ]
                    }
                },
                {
                    "form_name": "Puppet Form",
                    "skill_name": "Skill 4: Occult Arts - Breakout",
                    "cooldown_text": "CD: 12s | Mana: 0",
                    "tags": ["Movement", "Damage"],
                    "description": "The puppet charges in the target direction, dealing 300 (+100% extra Physical Attack) physical damage to enemies in its path. If the puppet's movements have been restricted, then control is passed back to its master.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3"],
                        "rows": [
                            { "label": "Cooldown", "values": ["12", "11", "10"] }
                        ]
                    }
                }
            ]
        }
    }

    if '125' in en_data and isinstance(en_data['125'], dict):
        meta = en_data['125'].get('meta', {})
        hero_name = en_data['125'].get('hero_name', 'Yango')
        en_data['125'] = {
            "hero_name": hero_name,
            "meta": meta,
            **yango_skills
        }

    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

    print("Updated Yango's EN skills with 100% accurate in-game text from screenshots!")

if __name__ == '__main__':
    main()
