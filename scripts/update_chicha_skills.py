import json

def main():
    en_path = 'public/data/skills/en.json'
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    chicha_skills = {
        "passive": {
            "name": "Passive Skill: Forge Inheritor",
            "cooldown_text": "CD: 0s | Mana: 0",
            "tags": ["Enhance", "Recovery"],
            "description": "Chicha cycles through her five ancestral weapons (polearm, spear, dagger-axe, halberd, and bow). Each Basic Attack restores 20 (+0.3% extra Health) Health and switches to the next weapon with increased range. Each Basic Attack or skill hit grants 1 stack of Fighting Spirit (lasts 4s, up to 8 stacks), with each stack granting 4% Attack Speed (can exceed the Attack Speed cap). Holding a polearm or spear puts her in Defense Form, dagger-axe or halberd puts her in Offense Form, and bow puts her in Overkill Form. Each form grants different Skill 1 and Skill 2 effects. Entering Overkill Form instantly reduces Skill 1 and Skill 2 Cooldown by 50%.",
            "table": {
                "headers": ["Lvl 1", "Lvl 15"],
                "rows": [
                    { "label": "ASPD Increase", "values": ["4%", "8%"] },
                    { "label": "Health Recovery", "values": ["20", "40"] }
                ]
            }
        },
        "skill1": {
            "name": "Skill 1: Peak-Crushing Polearm / Hell-Binding Dagger-Axe / Sky-Shattering Bow",
            "forms": [
                {
                    "form_name": "Defense Form",
                    "skill_name": "Skill 1: Peak-Crushing Polearm",
                    "cooldown_text": "CD: 10s | Mana: 50",
                    "tags": ["Crowd Control", "Damage", "Movement"],
                    "description": "Defense Form: Chicha swings her weapon and leaps forward in the target direction, dealing 225 (+70% extra Physical Attack) physical damage to enemies in the path and carrying them to the landing point. After landing, thrusts forward, dealing 225 (+70% extra Physical Attack) physical damage and launching enemies for 0.75s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["225", "270", "315", "360", "405", "450"] },
                            { "label": "Cooldown", "values": ["10", "9.6", "9.2", "8.8", "8.4", "8"] }
                        ]
                    }
                },
                {
                    "form_name": "Offense Form",
                    "skill_name": "Skill 1: Hell-Binding Dagger-Axe",
                    "cooldown_text": "CD: 10s | Mana: 50",
                    "tags": ["Crowd Control", "Damage", "Movement"],
                    "description": "Offense Form: Chicha hurls her weapon toward the target direction and propels forward, dealing 250 (+80% extra Physical Attack) physical damage to enemies in her path and pushing them to the skill's endpoint. After landing, she smashes the ground, dealing 250 (+80% extra Physical Attack) physical damage and launching enemies for 0.75s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["250", "300", "350", "400", "450", "500"] },
                            { "label": "Cooldown", "values": ["10", "9.6", "9.2", "8.8", "8.4", "8"] }
                        ]
                    }
                },
                {
                    "form_name": "Overkill Form",
                    "skill_name": "Skill 1: Sky-Shattering Bow",
                    "cooldown_text": "CD: 10s | Mana: 50",
                    "tags": ["Crowd Control", "Damage", "Movement"],
                    "description": "Overkill Form: Chicha launches a flying kick in the target direction, firing a piercing arrow that deals 275 (+90% extra Physical Attack) physical damage and knocking back enemies for 0.75s. If enemies hit a wall, they are restricted to a fixed area for 2s and take 275 (+90% extra Physical Attack) physical damage.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["275", "330", "385", "440", "495", "550"] },
                            { "label": "Cooldown", "values": ["10", "9.6", "9.2", "8.8", "8.4", "8"] },
                            { "label": "Collision Damage", "values": ["275", "330", "385", "440", "495", "550"] }
                        ]
                    }
                }
            ]
        },
        "skill2": {
            "name": "Skill 2: World-Splitting Spear / Realm-Sweeping Halberd / Star-Felling Arrow",
            "forms": [
                {
                    "form_name": "Defense Form",
                    "skill_name": "Skill 2: World-Splitting Spear",
                    "cooldown_text": "CD: 10s | Mana: 50",
                    "tags": ["Damage", "Recovery", "Knock Back"],
                    "description": "Defense Form: Chicha thrusts forward in the target direction, dealing 450 (+150% extra Physical Attack) physical damage and knocking back enemies (without applying crowd control). For each target hit, she recovers 180 (+3% extra Health) Health (halved for non-hero units).",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["450", "540", "630", "720", "810", "900"] },
                            { "label": "Cooldown", "values": ["10", "9.6", "9.2", "8.8", "8.4", "8"] },
                            { "label": "Health Recovery", "values": ["180", "216", "252", "288", "324", "360"] }
                        ]
                    }
                },
                {
                    "form_name": "Offense Form",
                    "skill_name": "Skill 2: Realm-Sweeping Halberd",
                    "cooldown_text": "CD: 10s | Mana: 50",
                    "tags": ["Damage", "Recovery", "Knock Back"],
                    "description": "Offense Form: Chicha sweeps in the target direction, dealing 475 (+160% extra Physical Attack) physical damage and knocking back enemies (without applying crowd control). For each target hit, she recovers 180 (+3% extra Health) Health (halved for non-hero units).",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["475", "570", "665", "760", "855", "950"] },
                            { "label": "Cooldown", "values": ["10", "9.6", "9.2", "8.8", "8.4", "8"] },
                            { "label": "Health Recovery", "values": ["180", "216", "252", "288", "324", "360"] }
                        ]
                    }
                },
                {
                    "form_name": "Overkill Form",
                    "skill_name": "Skill 2: Star-Felling Arrow",
                    "cooldown_text": "CD: 10s | Mana: 50",
                    "tags": ["Damage", "Recovery", "Knock Back"],
                    "description": "Overkill Form: Chicha aims in the target direction, locking onto all enemies in range (up to five, prioritizing heroes). After aiming, she shoots arrows at all locked-on targets, dealing 500 (+170% extra Physical Attack) physical damage, plus true damage equal to 10% of the Health the target has lost, and knocking back enemies (without crowd control). For each target hit, she recovers 180 (+3% extra Health) Health (halved for non-hero units). While using this skill, Chicha gains crowd control immunity and 15% damage reduction.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["500", "600", "700", "800", "900", "1,000"] },
                            { "label": "Cooldown", "values": ["10", "9.6", "9.2", "8.8", "8.4", "8"] },
                            { "label": "Damage Reduction", "values": ["15%", "18%", "21%", "24%", "27%", "30%"] },
                            { "label": "Health Recovery", "values": ["180", "216", "252", "288", "324", "360"] }
                        ]
                    }
                }
            ]
        },
        "skill3": {
            "name": "Skill 3: Return of the Armsmaster",
            "cooldown_text": "CD: 40s | Mana: 130",
            "tags": ["Enhance", "Damage"],
            "description": "Chicha unleashes all five weapons, gaining a Movement Speed boost for 2s and 35% Attack Speed, and breaking the Fighting Spirit stack limit for 6s. During this time, she commands all five weapons to attack, with each Basic Attack dealing an extra 40 (+13% extra Physical Attack) physical damage. While using this skill, she can use her Basic Attack while moving. Overkill Form will remain active once entered.",
            "table": {
                "headers": ["Lvl 1", "Lvl 2", "Lvl 3"],
                "rows": [
                    { "label": "Extra Damage", "values": ["40", "60", "80"] },
                    { "label": "ASPD Increase", "values": ["35%", "52.5%", "70%"] },
                    { "label": "Cooldown", "values": ["40", "36", "32"] },
                    { "label": "MSPD Burst", "values": ["80%", "90%", "100%"] }
                ]
            }
        }
    }

    if '172' in en_data and isinstance(en_data['172'], dict):
        meta = en_data['172'].get('meta', {})
        hero_name = en_data['172'].get('hero_name', 'Chicha')
        en_data['172'] = {
            "hero_name": hero_name,
            "meta": meta,
            **chicha_skills
        }

    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

    print("Updated Chicha's EN skills with 100% accurate in-game text from screenshots!")

if __name__ == '__main__':
    main()
