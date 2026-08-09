import json, re

def main():
    en_path = 'public/data/skills/en.json'
    ja_path = 'public/data/skills/ja.json'

    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    with open(ja_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    # 1. Yango (125)
    yango_skills = {
        "hero_name": "Yango",
        "meta": en_data.get('125', {}).get('meta', {}),
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
    en_data['125'] = yango_skills

    # 2. Zhang Fei (171)
    zhang_fei_skills = {
        "hero_name": "Zhang Fei",
        "meta": en_data.get('171', {}).get('meta', {}),
        "passive": {
            "name": "Passive Skill: Dark Potential",
            "cooldown_text": "CD: 0s | Mana: 0",
            "tags": ["Slow"],
            "description": "Before transforming, Zhang Fei's Basic Attacks increase Madness by 3. After transforming, using skills will shake the ground and slow nearby enemies by 25% for 2s."
        },
        "skill1": {
            "name": "Skill 1: Forbidden Domain / Mad Slaughter",
            "forms": [
                {
                    "form_name": "Human Form",
                    "skill_name": "Skill 1: Forbidden Domain",
                    "cooldown_text": "CD: 6s | Mana: 0",
                    "tags": ["Crowd Control", "Damage"],
                    "description": "Zhang Fei swings his snake spear, dealing 600 (+150% extra Physical Attack) physical damage to enemies within range and knocking back enemy heroes. Hitting an enemy unit increases Madness by 3."
                },
                {
                    "form_name": "Demon Form",
                    "skill_name": "Skill 1: Mad Slaughter",
                    "cooldown_text": "CD: 6s | Mana: 0",
                    "tags": ["Damage"],
                    "description": "Zhang Fei smashes the ground, dealing 600 (+150% extra Physical Attack + 4% Health) physical damage to enemies within range. Enemies in the center are launched for 0.5s."
                }
            ]
        },
        "skill2": {
            "name": "Skill 2: Leaping Savior / Stampede",
            "forms": [
                {
                    "form_name": "Human Form",
                    "skill_name": "Skill 2: Leaping Savior",
                    "cooldown_text": "CD: 10s | Mana: 0",
                    "tags": ["Shield", "Movement"],
                    "description": "Zhang Fei leaps to the target location and activates a mark, granting a shield that negates 650 (+13% extra Health) damage to teammates within range. He gains 3 Madness from using the skill and 1 extra Madness for each shield granted to teammates."
                },
                {
                    "form_name": "Demon Form",
                    "skill_name": "Skill 2: Stampede",
                    "cooldown_text": "CD: 10s | Mana: 0",
                    "tags": ["Damage", "Movement"],
                    "description": "Zhang Fei leaps to the target location, trampling enemies within range and dealing 480 (+120% extra Physical Attack + 4% Health) physical damage. Enemies in the center are launched for 0.5s."
                }
            ]
        },
        "skill3": {
            "name": "Skill 3: Unbridled Outburst",
            "cooldown_text": "CD: 40s | Mana: 100 Madness",
            "tags": ["Transformation", "Shield", "Crowd Control"],
            "description": "Zhang Fei roars in the target direction for 1.25s, generating a powerful gust of wind and gaining a shield that negates damage equal to 40% of his health for 15s. While roaring, he gains crowd control immunity and invincibility. The wind knocks enemies back and deals 600 (+150% extra Physical Attack) physical damage, and enemies at the end of its path are stunned for 1.5s. His Movement Speed increases by 50% while he is in the wind. Ferali Form: While he is in Ferali Form, his Basic Attacks deal an extra 220 (+100% extra Physical Attack) damage. When Ferali Form ends, Forbidden Domain is automatically triggered."
        }
    }
    en_data['171'] = zhang_fei_skills

    # 3. Yao (522)
    yao_skills = {
        "hero_name": "Yao",
        "meta": en_data.get('522', {}).get('meta', {}),
        "passive": {
            "name": "Passive Skill: Gift of the Stars",
            "cooldown_text": "CD: 0s | Mana: 0",
            "tags": ["Enhance", "Recovery"],
            "description": "Yao recovers 70 (+2% extra Health) Health when his skills hit an enemy unit, or half if they miss. Skill uses grant stacks of Star Power. At max stacks, enhances his next skill for 3s. Using the enhanced skill then enhances his next Basic Attack, letting him dash at the target and deal 100 (+30% extra Physical Attack) physical damage.",
            "table": {
                "headers": ["Lvl 1", "Lvl 15"],
                "rows": [
                    { "label": "Base Recovery", "values": ["70", "140"] },
                    { "label": "Base Damage", "values": ["100", "200"] }
                ]
            }
        },
        "skill1": {
            "name": "Skill 1: Starlight Slice / Brilliance: Starlight Slice",
            "forms": [
                {
                    "form_name": "Normal Form",
                    "skill_name": "Skill 1: Starlight Slice",
                    "cooldown_text": "CD: 6s",
                    "tags": ["Damage"],
                    "description": "Yao spins quickly with his blade, dealing 380 (+120% extra Physical Attack) physical damage to nearby enemies.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["380", "456", "532", "608", "684", "760"] },
                            { "label": "Cooldown", "values": ["6", "5.8", "5.6", "5.4", "5.2", "5"] }
                        ]
                    }
                },
                {
                    "form_name": "Enhanced Form",
                    "skill_name": "Enhanced Skill 1: Brilliance: Starlight Slice",
                    "cooldown_text": "CD: 6s | Energy: 3",
                    "tags": ["Damage"],
                    "description": "Yao spins quickly with his blade, dealing 380 (+120% extra Physical Attack) physical damage to nearby enemies and enhancing his next Basic Attack. Star Power mimics this skill, increasing his Attack Speed by 40% when both he and the stars hit a unit.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["380", "456", "532", "608", "684", "760"] },
                            { "label": "Cooldown", "values": ["6", "5.8", "5.6", "5.4", "5.2", "5"] },
                            { "label": "ASPD Increase", "values": ["40%", "48%", "56%", "64%", "72%", "80%"] }
                        ]
                    }
                }
            ]
        },
        "skill2": {
            "name": "Skill 2: Star Rush / Brilliance: Star Rush",
            "forms": [
                {
                    "form_name": "Normal Form",
                    "skill_name": "Skill 2: Star Rush",
                    "cooldown_text": "CD: 7s",
                    "tags": ["Movement", "Slow", "Damage"],
                    "description": "Yao moves quickly to the left, dealing 180 (+70% extra Physical Attack) physical damage to enemies in his path and slowing them by 25% for 1–2s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["180", "216", "252", "288", "324", "360"] },
                            { "label": "Cooldown", "values": ["7", "6.7", "6.4", "6.1", "5.8", "5.5"] },
                            { "label": "Slow Duration", "values": ["1", "1.2", "1.4", "1.6", "1.8", "2"] },
                            { "label": "Slow", "values": ["25%", "30%", "35%", "40%", "45%", "50%"] }
                        ]
                    }
                },
                {
                    "form_name": "Enhanced Form",
                    "skill_name": "Enhanced Skill 2: Brilliance: Star Rush",
                    "cooldown_text": "CD: 7s | Energy: 3",
                    "tags": ["Movement", "Slow", "Damage"],
                    "description": "Yao moves quickly to the right, dealing 180 (+70% extra Physical Attack) physical damage to enemies in his path, slowing them by 25% for 1–2s, and enhancing his next Basic Attack. Star Power will use this skill again from the left, launching units hit by both him and the stars for 0.75s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
                        "rows": [
                            { "label": "Base Damage", "values": ["180", "216", "252", "288", "324", "360"] },
                            { "label": "Cooldown", "values": ["7", "6.7", "6.4", "6.1", "5.8", "5.5"] },
                            { "label": "Slow Duration", "values": ["1", "1.2", "1.4", "1.6", "1.8", "2"] },
                            { "label": "Slow", "values": ["25%", "30%", "35%", "40%", "45%", "50%"] }
                        ]
                    }
                }
            ]
        },
        "skill3": {
            "name": "Skill 3: Return to Dust / Brilliance: Return to Dust",
            "forms": [
                {
                    "form_name": "Normal Form",
                    "skill_name": "Skill 3: Return to Dust",
                    "cooldown_text": "CD: 15s",
                    "tags": ["Movement", "Star Reduction", "Damage"],
                    "description": "Yao returns to his location 2s ago (up to 600 units), removes all Star Reduction, and deals 420 (+140% extra Physical Attack) magical damage to enemies in his path and at the end point. Passive: 40% of damage taken is converted into Star Reduction, only taking effect after 2s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3"],
                        "rows": [
                            { "label": "Base Damage", "values": ["420", "630", "840"] },
                            { "label": "Cooldown", "values": ["15", "12", "9"] }
                        ]
                    }
                },
                {
                    "form_name": "Enhanced Form",
                    "skill_name": "Enhanced Ultimate: Brilliance: Return to Dust",
                    "cooldown_text": "CD: 15s | Energy: 3",
                    "tags": ["Movement", "Star Reduction", "Damage"],
                    "description": "Yao returns to his location 2s ago (up to 600 units), removes all Star Reduction, deals 420 (+140% extra Physical Attack) magical damage to enemies in his path and at the end point, and enhances his next Basic Attack. Star Power mimics this skill, slowing units hit by both him and the stars by 25% for 2s. Passive: 40% of damage taken is converted into Star Reduction, only taking effect after 2s.",
                    "table": {
                        "headers": ["Lvl 1", "Lvl 2", "Lvl 3"],
                        "rows": [
                            { "label": "Base Damage", "values": ["420", "630", "840"] },
                            { "label": "Cooldown", "values": ["15", "12", "9"] },
                            { "label": "Slow", "values": ["25%", "37.5%", "50%"] }
                        ]
                    }
                }
            ]
        }
    }
    en_data['522'] = yao_skills

    # 4. Charlotte (536)
    charlotte_skills = {
        "hero_name": "Charlotte",
        "meta": en_data.get('536', {}).get('meta', {}),
        "passive": {
            "name": "Passive Skill: Splash Light",
            "cooldown_text": "CD: 0s | Mana: 0",
            "tags": ["Damage", "Recovery"],
            "description": "After a skill lands on an enemy, Charlotte enhances her next skill into an Additional Skill and gains 1 stack of [Seven-Star Sword] for 4s. At 3 stacks, her Basic Attack is enhanced to [Seven-Star Sword]. [Seven-Star Sword]: Charlotte locks onto an enemy and slashes 7 times, dealing Physical Damage and reducing their Move Speed. The final slash deals extra Physical Damage equal to 15% of the target's lost Health."
        },
        "skill1": {
            "name": "Skill 1: Tri-Slash",
            "forms": [
                {
                    "form_name": "Normal Form",
                    "skill_name": "Skill 1: Tri-Slash",
                    "cooldown_text": "CD: 8.0s",
                    "tags": ["Damage"],
                    "description": "Charlotte slashes a triangle, dealing Physical Damage. If it hits an enemy, she gains Move Speed."
                },
                {
                    "form_name": "Enhanced Form",
                    "skill_name": "Skill 1: Enhanced Tri-Slash",
                    "cooldown_text": "CD: 8.0s",
                    "tags": ["Damage", "Enhance"],
                    "description": "Enhanced Skill: Charlotte slashes a triangle with increased speed, dealing physical damage and granting extra Movement Speed upon hitting an enemy."
                }
            ]
        },
        "skill2": {
            "name": "Skill 2: Splash Sword",
            "forms": [
                {
                    "form_name": "Normal Form",
                    "skill_name": "Skill 2: Splash Sword",
                    "cooldown_text": "CD: 6.0s",
                    "tags": ["Damage", "Recovery"],
                    "description": "Charlotte charges in the target direction, dealing Physical Damage to enemies in her path and recovering Health."
                },
                {
                    "form_name": "Enhanced Form",
                    "skill_name": "Skill 2: Enhanced Splash Sword",
                    "cooldown_text": "CD: 6.0s",
                    "tags": ["Damage", "Recovery", "Enhance"],
                    "description": "Enhanced Skill: Charlotte charges forward, dealing multiple physical strikes with reduced Cooldown and increased Health recovery."
                }
            ]
        },
        "skill3": {
            "name": "Skill 3: Seven-Star Sword",
            "forms": [
                {
                    "form_name": "Normal Form",
                    "skill_name": "Skill 3: Seven-Star Sword",
                    "cooldown_text": "CD: 18.0s",
                    "tags": ["Damage", "CC"],
                    "description": "Charlotte slashes enemies in a circle, dealing Physical Damage and reducing their Move Speed. During the skill, she gains Damage Reduction and Immunity to Crowd Control."
                },
                {
                    "form_name": "Enhanced Form",
                    "skill_name": "Skill 3: Enhanced Seven-Star Sword",
                    "cooldown_text": "CD: 18.0s",
                    "tags": ["Damage", "CC", "Enhance"],
                    "description": "Enhanced Skill: Charlotte slashes enemies in a circle, knocking them up on the final hit, dealing physical damage, and granting Damage Reduction and CC Immunity."
                }
            ]
        }
    }
    en_data['536'] = charlotte_skills

    # 5. Mayene (564)
    mayene_skills = {
        "hero_name": "Mayene",
        "meta": en_data.get('564', {}).get('meta', {}),
        "passive": {
            "name": "Passive Skill: Slack Off a Lil Bit",
            "cooldown_text": "CD: 0s | Mana: 0",
            "tags": ["Recovery"],
            "description": "Mayene's skills consume Punch Strength or Kick Strength. When idle and not taking damage, she sits down to slack off, accelerating Strength recovery by 25%. While slacking, she snacks on treats, randomly recovering 110 (+2% extra Health) x 1/1.5/2 Health. Attacking, taking damage, or moving interrupts this effect. She won't slack off in Serious State. Using a different skill combo within 3s of another boosts its effect by 25%."
        },
        "skill1": {
            "name": "Skill 1: Whatever (I)",
            "forms": [
                {
                    "form_name": "Base Form",
                    "skill_name": "Skill 1: Whatever (I)",
                    "cooldown_text": "CD: 8.5s",
                    "tags": ["Damage", "Crowd Control", "Movement"],
                    "description": "Mayene runs forward and pulls in enemies in front of her, dealing 300 (+100% extra Physical Attack) physical damage to enemies in a cone-shaped area and slowing them by 30% for 1s. Costs 1 Punch Strength. Recovers 1 Punch Strength every 8.5s (affected by Cooldown Reduction), max 2 bars."
                },
                {
                    "form_name": "Combo: Exploit Weakness",
                    "skill_name": "Skill 1 (Exploit Weakness): Whatever (I) -> Whatever (I)",
                    "cooldown_text": "CD: 0s",
                    "tags": ["Damage", "Crowd Control"],
                    "description": "Exploit Weakness: When using Whatever (I) again quickly after, she will leap into the air and deliver a powerful strike, dealing 400 (+125% extra Physical Attack) physical damage to enemies within range and extra physical damage equal to 10% of the target's Health, as well as launching them for 1s. Deals 50% extra damage to enemies in the center. Mayene takes 25% less damage while using the skill."
                },
                {
                    "form_name": "Combo: Feint to Retreat",
                    "skill_name": "Skill 1 (Feint to Retreat): Whatever (I) -> Whatever (II)",
                    "cooldown_text": "CD: 0s",
                    "tags": ["Damage", "Recovery"],
                    "description": "Feint to Retreat: Mayene delivers a smooth combo of strikes, starting with 3 punches that deal 200 (+70% extra Physical Attack) physical damage each, followed by a knee strike that deals 200 (+70% extra Physical Attack) physical damage while pushing the target backward slightly. She also recovers 200 (+5% extra Health) Health."
                }
            ]
        },
        "skill2": {
            "name": "Skill 2: Whatever (II)",
            "forms": [
                {
                    "form_name": "Base Form",
                    "skill_name": "Skill 2: Whatever (II)",
                    "cooldown_text": "CD: 8.5s",
                    "tags": ["Immunity", "Damage Reduction", "Movement"],
                    "description": "Mayene flips forward, during which she has crowd control immunity, gains 30% damage reduction and recovers 200 (+5% extra Health) Health. Costs 1 Kick Strength. Recovers 1 Kick Strength every 8.5s (affected by Cooldown Reduction), max 2 bars."
                },
                {
                    "form_name": "Combo: Flee Danger",
                    "skill_name": "Skill 2 (Flee Danger): Whatever (II) -> Whatever (II)",
                    "cooldown_text": "CD: 0s",
                    "tags": ["Damage", "Recovery", "Immunity"],
                    "description": "Flee Danger: When using Whatever (II) again quickly after, she delivers a flying kick to the enemy, dealing 500 (+150% extra Physical Attack) physical damage and recovering 200 (+5% extra Health) Health. She then somersaults into the air, gaining CC immunity, 25% damage reduction, and recovering 300 (+5% extra Health) Health."
                },
                {
                    "form_name": "Combo: Defend by Attacking",
                    "skill_name": "Skill 2 (Defend by Attacking): Whatever (II) -> Whatever (I)",
                    "cooldown_text": "CD: 0s",
                    "tags": ["Damage", "Knock Back", "Recovery"],
                    "description": "Defend by Attacking: When using Whatever (I) quickly after, she blinks behind the enemy and delivers a spinning kick, knocking back the target and dealing 350 (+110% extra Physical Attack) (+15% target's lost Health) physical damage. If the target is defeated, recovers 300 (+5% extra Health) Health and 50% Strength (doubled for hero kills)."
                }
            ]
        },
        "skill3": {
            "name": "Skill 3: Get Serious",
            "cooldown_text": "CD: 60s | Mana: 0",
            "tags": ["Enhance", "Haste", "Damage"],
            "description": "Mayene gets serious, dealing 360 (+100% extra Physical Attack) physical damage to nearby enemies. Upon entering the Serious State, she recovers 1 Punch Strength and Kick Strength, and max Strength is increased to 3 bars each. The Serious State lasts for 10s, during which she gains 15% Movement Speed, and any slowing effect inflicted on her is reduced by 50%."
        }
    }
    en_data['564'] = mayene_skills

    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

    print("All multi-form heroes (125, 171, 522, 536, 564) updated with perfect English data!")

if __name__ == '__main__':
    main()
