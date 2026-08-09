import json

data = {
  "77": {
    "name": "Musashi",
    "skills": {
      "passive": {
        "name": "Niten Ichiryuu",
        "tags": ["Damage", "Movement", "Cooldown"],
        "description": "Musashi receives 1 Vigor upon using skills, for up to 2 stacks. While he has Vigor, he gains enhanced Basic Attacks that consume 1 Vigor, are not affected by Attack Speed, and reduce the cooldowns of Skills 1 and 2 by 1s upon hitting an enemy.\nWhile he has 1 Vigor:\nIf the target's Health is above 50%, his next Basic Attack is enhanced to a dual-blade slash, dealing 120 (120 + 40% extra Physical Attack) extra physical damage.\nIf the target's Health is below 50%, his next Basic Attack is enhanced to a forward slash, dealing 45 (45 + 15% extra Physical Attack) (+ 6% of target's lost Health) extra physical damage.\nWhile he has 2 Vigor:\nHis next Basic Attack lets him dash to the target, dealing 187 (20 + 100% Physical Attack) physical damage and slowing them by 25% for 1s.",
        "table": {
          "Slash Damage": ["120", "240"],
          "Chop Damage": ["45", "90"]
        }
      },
      "skill_1": {
        "name": "Illuminating Slash",
        "tags": ["Knockdown", "Immunity", "Damage"],
        "cd": "12s",
        "mana_cost": "",
        "description": "Musashi unleashes a wave of sword energy forward that knocks down enemy projectiles, deals 390 (390 + 130% extra Physical Attack) physical damage to enemies in its path, and slows the enemies by 25% for 1s.\nHe gains crowd control immunity when using this skill.",
        "table": {
          "Cooldown": ["12", "11.6", "11.2", "10.8", "10.4", "10"],
          "Physical Damage": ["390", "468", "546", "624", "702", "780"],
          "Slow": ["25%", "30%", "35%", "40%", "45%", "50%"]
        }
      },
      "skill_2": {
        "name": "Extreme Speed",
        "tags": ["Movement", "Damage", "Shield"],
        "cd": "10s",
        "mana_cost": "",
        "description": "Musashi dashes forward, dealing 210 (210 + 75% extra Physical Attack) physical damage to enemies in his path. If he hits an enemy, he gains a shield that negates 330 (330 + 6% extra max Health) damage and reduces this skill's CD by 50%.",
        "table": {
          "Cooldown": ["10", "9.6", "9.2", "8.8", "8.4", "8"],
          "Physical Damage": ["210", "252", "294", "336", "378", "420"],
          "Shield": ["330", "396", "462", "528", "594", "660"]
        }
      },
      "skill_3": {
        "name": "Duel to the Death",
        "tags": ["Imperil", "Crowd Control", "Damage"],
        "cd": "50s",
        "mana_cost": "",
        "description": "Musashi locks onto an enemy hero and dashes toward them. Upon arrival, deals 400 (400 + 130% extra Physical Attack) physical damage to enemies within range and launches them for 1s. The target is then marked by Musashi for a duel to the death for 5s. All of the target's recovery effects are delayed until after the duel.\nMusashi has crowd control immunity and takes 50% less damage during the dash.",
        "table": {
          "Cooldown": ["50", "45", "40"],
          "Physical Damage": ["400", "600", "800"]
        }
      }
    }
  },
  "78": {
    "name": "Nakoruru",
    "skills": {
      "passive": {
        "name": "DANCING SWORD ARTS",
        "tags": ["Enhance", "Damage"],
        "description": "When Nakoruru hits an enemy with a skill, her next Basic Attack is enhanced, for up to 3 stacks. Her next Basic Attack summons Mamahaha, who deals damage to nearby enemies based on the number of stacks, with each stack dealing 120 (120 + 37% extra Physical Attack) physical damage.",
        "table": {
          "Base Damage": ["120", "240"]
        }
      },
      "skill_1": {
        "name": "AMUBE YATORO",
        "tags": ["Damage", "Cooldown"],
        "cd": "9s",
        "mana_cost": "55",
        "description": "Nakoruru summons Mamahaha to attack the enemy, dealing 380 (380 + 120% extra Physical Attack) physical damage and marking them with an Eagle Eye Mark. Further damage dealt by her will activate the marks, dealing physical damage equal to 6% of the target's max Health (max damage to monsters from the mark capped at 300). Every 40 additional Physical Attack increases max Health by 1%. Activating the mark will reduce the cooldown of AMUBE YATORO by 2.5s and recover 35 Mana.",
        "table": {
          "Cooldown": ["9", "8.6", "8.2", "7.8", "7.4", "7"],
          "Base Damage": ["380", "456", "532", "608", "684", "760"]
        }
      },
      "skill_2": {
        "name": "RERA MUTSUBE",
        "tags": ["Movement", "Recovery", "Damage"],
        "cd": "6s",
        "mana_cost": "45",
        "description": "Nakoruru dashes forward, dealing 400 (400 + 130% extra Physical Attack) physical damage to enemies in her path. For every enemy hero hit, she recovers 400 (400 + 5% extra max Health) Health. When this skill hits a monster, it deals 50% more damage. Hitting non-hero units restores 50% of the Health restored when hitting heroes.",
        "table": {
          "Cooldown": ["6", "5.8", "5.6", "5.4", "5.2", "5"],
          "Base Damage": ["400", "480", "560", "640", "720", "800"],
          "Health Recovery": ["400", "480", "560", "640", "720", "800"]
        }
      },
      "skill_3": {
        "name": "KAMUI MUTSUBE",
        "tags": ["Speed Up", "Damage", "Imperil"],
        "cd": "15s",
        "mana_cost": "80",
        "description": "Nakoruru summons Mamahaha, gaining 50% Movement Speed for 6s which diminishes over time. She can ignore terrain once while flying. Using this skill again causes her to charge toward the target area, dealing 600 (600 + 190% extra Physical Attack) physical damage to enemies within range. Enemies hit by her are slowed by 25% and deal 30% less damage for 3s.\nPassive: Nakoruru summons Mamahaha to fly with her after staying out of combat for 4s, increasing her Movement Speed by 10%. She loses the Movement Speed increase upon re-entering combat.",
        "table": {
          "Cooldown": ["15", "13.5", "12"],
          "Base Damage": ["600", "900", "1,200"],
          "Slow": ["25%", "37.5%", "50%"]
        }
      }
    }
  },
  "79": {
    "name": "Nezha",
    "skills": {
      "passive": {
        "name": "Scorching Ember",
        "tags": ["Shield", "Speed Up"],
        "description": "Nezha receives a shield that negates 75 (75 + 1.5% extra max Health) true damage for every enemy hero he damages with a skill, for up to 800 (800 + 20% extra max Health) true damage in total. This also triggers Wind-Fire Wheels 1 time, increasing Movement Speed by 5% for 3s, for up to 5 stacks. The true damage shield can be recovered at the spawn point.\nWhen he deals damage using Basic Attacks or Scorching Ember, or deals damage to a non-hero unit, he only gets a shield negating 20 (20 + 0.5% extra max Health) true damage. Each target can trigger Wind-Fire Wheels up to 1 time.",
        "table": {
          "Base Shield": ["75", "150"],
          "Other Shield": ["20", "40"],
          "Shield Limit": ["800", "1,600"]
        }
      },
      "skill_1": {
        "name": "Fire-tipped Spear - Sweep",
        "tags": ["Damage"],
        "cd": "5s",
        "mana_cost": "30",
        "description": "Nezha deals 345 (345 + 105% extra Physical Attack) physical damage to nearby enemies and places Scorching Ember on them, dealing 45 (45 + 20% extra Physical Attack) true damage to the enemy every second for 5s, for up to 3 stacks. Damage increases by 50% with each stack. Scorching Ember also reduces the target's Health recovery by 15%.\nThe duration of Scorching Ember is refreshed when Nezha deals damage to the target.",
        "table": {
          "Base Damage": ["345", "460", "575", "690"],
          "Cooldown": ["5", "4.7", "4.3", "4"],
          "Ember Damage": ["45", "60", "75", "90"]
        }
      },
      "skill_2": {
        "name": "Red Armillary Sash - Bind",
        "tags": ["Damage", "Movement"],
        "cd": "1.5s",
        "mana_cost": "15",
        "description": "Flips behind the target to deal 150 (150 + 65% extra Physical Attack) physical damage. He also gains a shield that negates 24 (24 + 0.5% extra max Health) true damage, halved for non-hero units. This skill cannot be used on the same target again for 3s.",
        "table": {
          "Cooldown": ["1.5", "1.4", "1.3", "1.2"],
          "Use Interval": ["3", "2.8", "2.6", "2.4"],
          "Base Damage": ["150", "200", "250", "300"],
          "Base Shield": ["24", "32", "40", "48"]
        }
      },
      "skill_3": {
        "name": "Universe Ring - Skyfall",
        "tags": ["Chase", "Damage Reduction", "Crowd Control"],
        "cd": "50s",
        "mana_cost": "80",
        "description": "Nezha selects an enemy hero and flies to their location, dealing 450 (450 + 170% extra Physical Attack) physical damage and knocking them back.\nAfter landing, Nezha gains 10% damage reduction and 20% Resistance for 4s.\nThis skill enters a 50%-100% CD based on flight distance. If the target is untargetable upon arrival, Nezha waits until the untargetable state ends and then immediately knocks the target back (can wait up to 0.5s).",
        "table": {
          "Base Damage": ["450", "600", "750", "900"],
          "Damage Reduction": ["10%", "13.3%", "16.7%", "20%"],
          "Cooldown": ["50", "46.7", "43.3", "40"],
          "Range": ["2,400", "2,800", "3,200", "3,600"]
        }
      },
      "skill_4": {
        "name": "Universe Ring",
        "tags": ["Vision", "Enhance", "Damage"],
        "cd": "80s",
        "mana_cost": "90",
        "description": "Nezha unleashes the universe ring, dealing 140 (140 + 45% extra Physical Attack) physical damage to all enemy heroes across the entire map and gaining vision. Enhances the range of Universe Ring - Skyfall to cover the entire map for 5s.\nHeroes revealed by this effect cannot use recall.",
        "table": {
          "Base Damage": ["140", "210", "280"],
          "Cooldown": ["80", "72", "64"]
        }
      }
    }
  },
  "80": {
    "name": "Nuwa",
    "skills": {
      "passive": {
        "name": "Divine Consciousness",
        "tags": ["Enhance"],
        "description": "Nuwa gains 10-20% vision, Basic Attack range, and skill range (increases with hero level).",
        "table": {
          "Vision Range Increase": ["10%", "20%"]
        }
      },
      "skill_1": {
        "name": "Divine Glow - Creation",
        "tags": ["Damage", "Crowd Control", "Terrain"],
        "cd": "8.5s",
        "mana_cost": "45",
        "description": "Nuwa unleashes energy in the target direction, dealing 225 (225 + 42% Magical Attack) magical damage to enemies in its path and knocking them back. After hitting an enemy, the energy gradually stops and expands in a cross shape, forming a matrix. This deals 225 (225 + 42% Magical Attack) magical damage to enemies hit.\nThe cross deals an extra 50% damage to enemies at its center, and sets off explosions if it touches matrices.",
        "table": {
          "Cooldown": ["8.5", "8", "7.5", "7"],
          "Base Damage": ["225", "300", "375", "450"]
        }
      },
      "skill_2": {
        "name": "Divine Glow - Coalescence",
        "tags": ["Terrain", "Crowd Control", "Damage"],
        "cd": "0s",
        "mana_cost": "40",
        "description": "Nuwa creates a matrix that only she can traverse and enemy heroes cannot pass through. Each matrix lasts 3.5s.\nWhenever a matrix is hit by one of Nuwa's other skills, it sets off an explosion that deals 210 (210 + 40% Magical Attack) magical damage to nearby enemies.\nWhen matrices fuse, they deal 180 (180 + 35% Magical Attack) magical damage (+50% extra damage in the center) on collision and knock back enemies for 0.5s. Collisions gain up to 30% extra range based on the initial distance between matrices. Up to 3 matrices can be stocked. When multiple matrices explode simultaneously, they only deal damage to the same target once.",
        "table": {
          "Stock Time": ["15", "14", "13", "12"],
          "Explosion Damage": ["210", "280", "350", "420"],
          "Emergence Interval": ["0.4", "0.3", "0.2", "0.1"]
        }
      },
      "skill_3": {
        "name": "Divine Glow - Emergence",
        "tags": ["Teleportation", "Slow", "Shield"],
        "cd": "30s",
        "mana_cost": "80",
        "description": "Nuwa teleports to the target location while gaining 30% Movement Speed and a shield that negates 600 (600 + 9% extra max Health) damage for 2s. She also deals 300 (300 + 57% Magical Attack) magical damage to enemies within the target area and slows them by 25-50% for 0.5s. Enemies take less damage the farther away they are from her, down to 50% of the initial damage.",
        "table": {
          "Cooldown": ["30", "28", "26", "24"],
          "Base Damage": ["300", "400", "500", "600"],
          "Shield": ["600", "800", "1,000", "1,200"],
          "Slow": ["25%", "33.3%", "41.7%", "50%"]
        }
      },
      "skill_4": {
        "name": "Divine Glow - Annihilation",
        "tags": ["Damage"],
        "cd": "50s",
        "mana_cost": "120",
        "description": "Nuwa releases pure energy, dealing 600 (600 + 115% Magical Attack) magical damage to enemies in its path. The pure energy will set off an explosion if it touches a matrix.",
        "table": {
          "Cooldown": ["50", "45", "40"],
          "Base Damage": ["600", "900", "1,200"]
        }
      }
    }
  },
  "81": {
    "name": "Pei",
    "skills": {
      "passive_1": {
        "name": "Blast (Human Form)",
        "tags": ["Enhance", "Damage"],
        "description": "While in human form, Pei's Basic Attack range is increased and each Basic Attack restores 5 Energy to him. His Basic Attack also deals an extra 20 magical damage. This extra damage can stack up to 3 times when attacking the same target within 3s.",
        "table": {
          "Extra Damage": ["20", "100"]
        }
      },
      "skill_1_1": {
        "name": "Striker Stance",
        "tags": ["Slow", "Damage"],
        "cd": "8s",
        "mana_cost": "40 (Energy)",
        "description": "Pei fires Inner Energy in the target direction, dealing 275 (275 + 130% extra Physical Attack) (+ 8% of target's current Health) magical damage to enemies in its path, and slowing them by 25% for 1.5s. Recovers 20 Energy when Skill 1 hits.",
        "table": {
          "Cooldown": ["8", "7.6", "7.2", "6.8", "6.4", "6"],
          "Base Damage": ["275", "340", "405", "470", "535", "600"],
          "Slow": ["25%", "30%", "35%", "40%", "45%", "50%"]
        }
      },
      "skill_2_1": {
        "name": "Guarding Stance",
        "tags": ["Shield", "Enhance", "Damage"],
        "cd": "8s",
        "mana_cost": "50 (Energy)",
        "description": "Pei envelops himself in Beastly Instincts, dealing 100 (100 + 70% extra Physical Attack) magical damage to nearby enemies while creating a shield that negates 450 (450 + 170% extra Physical Attack) damage and increasing his Attack Speed by 30% for 5s. While the shield is active, he deals 20 (20 + 14% extra Physical Attack) magical damage to nearby enemies every 0.5s.",
        "table": {
          "Base Damage": ["100", "150", "200", "250", "300", "350"],
          "ASPD Increase": ["30%", "34%", "38%", "42%", "46%", "50%"],
          "Damage Over Time": ["20", "30", "40", "50", "60", "70"]
        }
      },
      "skill_3_1": {
        "name": "Tiger Form",
        "tags": ["Switch", "Enhance"],
        "cd": "6s",
        "mana_cost": "",
        "description": "Pei switches to tiger form, gaining 15% Movement Speed for 1s and enhancing his next 2 Basic Attacks for 5s.\nFirst Enhanced Basic Attack: He dashes at the target, dealing 185 (20 + 100% Physical Attack) physical damage and inflicting them with extreme slow. After using the first enhanced Basic Attack, the duration of the second will change to 5s.\nSecond Enhanced Basic Attack: He deals 185 (20 + 100% Physical Attack) magical damage to enemies within range in front of him.",
        "table": {
          "Cooldown": ["5.4", "4.8", "4.2", "3.6"],
          "Base Damage": ["110", "200", "290", "380"],
          "MSPD Increase": ["20%", "25%", "30%", "35%"]
        }
      },
      "passive_2": {
        "name": "Beastly Instincts (Tiger Form)",
        "tags": ["Enhance", "Speed Up"],
        "description": "While in tiger form, Pei gains 25 Physical Attack, 60 Physical Defense, 60 Magical Defense, and 25 Movement Speed.",
        "table": {
          "Physical Attack": ["25", "50"],
          "Physical Defense": ["60", "120"],
          "Magical Defense": ["60", "120"],
          "MSPD": ["25", "50"]
        }
      },
      "skill_1_2": {
        "name": "Roaring Tiger Stance",
        "tags": ["Damage"],
        "cd": "3s",
        "mana_cost": "50 (Energy)",
        "description": "Pei swipes at the target, dealing 300 (300 + 130% extra Physical Attack) physical damage. An extra 1% damage is dealt to the target for every 1% of their lost Health. If this skill defeats the target enemy, he recovers 20 Energy.",
        "table": {
          "Base Damage": ["300", "360", "420", "480", "540", "600"]
        }
      },
      "skill_2_2": {
        "name": "Leaping Tiger Stance",
        "tags": ["Movement", "Damage"],
        "cd": "7s",
        "mana_cost": "50 (Energy)",
        "description": "Pei pounces in the target direction, dealing 160 (160 + 70% extra Physical Attack) physical damage to enemies in his path. If he pounces into terrain, he will latch on for 1s, during which he can pounce again by using the movement wheel, dealing 320 (320 + 140% extra Physical Attack) physical damage to enemies in his path. If his pounce hits any enemy, he recovers 20 Energy and reduces Skill 2's CD by 30%.",
        "table": {
          "Cooldown": ["7", "6.6", "6.2", "5.8", "5.4", "5"],
          "Base Damage": ["160", "190", "220", "250", "280", "310"],
          "Extra Damage": ["320", "385", "450", "515", "580", "645"],
          "Cooldown Reduction": ["30%", "36%", "42%", "48%", "54%", "60%"]
        }
      },
      "skill_3_2": {
        "name": "Human Form",
        "tags": ["Switch", "Enhance"],
        "cd": "6s",
        "mana_cost": "",
        "description": "Pei switches to Human Form, gaining 15% Movement Speed for 1s and enhancing his next Basic Attack for 5s. The enhanced Basic Attack allows him to fire a stronger Inner Energy at the target, dealing 265 (100 + 100% Physical Attack) magical damage to the target and enemies in a cone-shaped area behind them.",
        "table": {
          "Cooldown": ["5.4", "4.8", "4.2", "3.6"],
          "Base Damage": ["300", "500", "700", "900"],
          "MSPD Increase": ["20%", "25%", "30%", "35%"]
        }
      }
    }
  },
  "82": {
    "name": "Sakeer",
    "skills": {
      "passive": {
        "name": "Firefly Protection",
        "tags": ["Heal", "Damage", "Vision"],
        "description": "Sakeer's Basic Attack deals melee damage and summons a firefly that deals 100 (100 + 20% Magical Attack + 3% extra max Health) magical damage to enemies and exposes them for 3s. Sakeer also periodically restores 60 (60 + 10% Magical Attack + 1.5% extra max Health) Health to the nearby teammate with the lowest Health. When there are no enemies nearby, charging his Basic Attack recovers 60 (60 + 10% Magical Attack + 1.5% extra max Health) Health. He will stop restoring Health to teammates while charging.",
        "table": {}
      },
      "skill_1": {
        "name": "Mulberry Power",
        "tags": ["Crowd Control", "Heal", "Damage"],
        "cd": "10s",
        "mana_cost": "50",
        "description": "Sakeer channels Luminescence to the target area, dealing 500 (500 + 10% Magical Attack) magical damage to enemies and launching them for 1s. Luminescence is consumed on hit, dealing 100 (100 + 20% Magical Attack + 3% extra max Health) magical damage per stack. If there are teammates nearby, Luminescence instead heals the teammate with the lowest Health, restoring 60 (60 + 10% Magical Attack + 1.5% extra max Health) Health per stack. Luminescence: He gains 1 stack every 1.5s, for up to 9 stacks. The skill's range increases with the number of stacks.",
        "table": {
          "Cooldown": ["10", "9.6", "9.2", "8.8", "8.4", "8"],
          "Skill Damage": ["500", "600", "700", "800", "900", "1,000"]
        }
      },
      "skill_2": {
        "name": "Ride the Wind",
        "tags": ["Movement", "Heal", "Damage"],
        "cd": "0.2s",
        "mana_cost": "50",
        "description": "Sakeer flies to the target brush, gaining 1 stack of Luminescence and releasing a number of fireflies depending on how far he flies. After 1s, the fireflies fly to the nearby hero with the lowest Health. If the hero is an enemy, the fireflies deal 100 (100 + 20% Magical Attack + 3% extra max Health) magical damage and expose them for 3s. If the hero is a teammate, they restore 60 (60 + 10% Magical Attack + 1.5% extra max Health) Health. This skill stocks up to 3 charges. Tap it to fly to a brush in front of him without aiming.",
        "table": {
          "Stock Time": ["12", "11.5", "11", "10.5", "10", "9.5"]
        }
      },
      "skill_3": {
        "name": "Firefly Fields",
        "tags": ["Brush", "Heal", "Damage"],
        "cd": "25s",
        "mana_cost": "80",
        "description": "Sakeer summons an Illuminating Brush at the target location. He can use this skill again within 6s to fly to the brush and gain a stack of Luminescence.\nIlluminating Brush: 1s after the brush has been summoned, it releases fireflies at up to 5 nearby heroes every second. Every firefly deals 100 (100 + 20% Magical Attack + 3% extra max Health) magical damage to enemies, or restores 60 (60 + 10% Magical Attack + 1.5% extra max Health) Health to teammates. Enemies that step into this brush will have their location revealed. After a while, the Illuminating Brush will stop releasing fireflies and turn into a regular brush that lasts for 30s.",
        "table": {
          "Cooldown": ["25", "22.5", "20"],
          "Duration": ["9", "12", "15"]
        }
      }
    }
  },
  "83": {
    "name": "Shangguan",
    "skills": {
      "passive": {
        "name": "Piercing Brush",
        "tags": ["Enhance", "Damage", "Recovery"],
        "description": "Enhances every 3rd Basic Attack, dealing an extra 255 (255 + 50% Magical Attack) magical damage to enemies in a line. When brush strokes intersect, nearby enemies take 255 (255 + 50% Magical Attack) magical damage (damage is reduced by 50% for successive hits within 1s).\nRecovers 100 (100 + 22% Magical Attack) Health and gains an enhanced Basic Attack when near intersecting brush strokes.",
        "table": {
          "Enhanced Damage": ["255", "510"],
          "Contact Damage": ["255", "510"],
          "Health Recovery": ["100", "240"]
        }
      },
      "skill_1": {
        "name": "Ink Burst",
        "tags": ["Damage"],
        "cd": "5s",
        "mana_cost": "30",
        "description": "Flings a powerful drop of ink in the target direction, dealing 200 (200 + 40% Magical Attack) magical damage to enemies hit. Upon reaching the end of its range, the ink explodes, dealing 200 (200 + 40% Magical Attack) magical damage to nearby enemies.",
        "table": {
          "Base Damage": ["200", "240", "280", "320", "360", "400"]
        }
      },
      "skill_2": {
        "name": "Seething Script",
        "tags": ["Damage", "Slow"],
        "cd": "1.5s",
        "mana_cost": "60",
        "description": "With her current location as the finishing point, Shangguan starts writing from a target location, dealing 150 (150 + 20% Magical Attack) magical damage where her brush lands. Enemies touched by her brush strokes take 300 (300 + 40% Magical Attack) magical damage and are slowed by 25% for 2s.\nThis skill can be stocked every 10s (affected by Cooldown Reduction), for up to 2 uses.",
        "table": {
          "Stock Interval": ["10", "9.4", "8.8", "8.2", "7.6", "7"],
          "Brush Landing DMG": ["150", "180", "210", "240", "270", "300"],
          "Writing Damage": ["300", "360", "420", "480", "540", "600"],
          "Slow": ["25%", "30%", "35%", "40%", "45%", "50%"]
        }
      },
      "skill_3": {
        "name": "Finishing Stroke",
        "tags": ["Damage", "Immunity", "Movement"],
        "cd": "35s",
        "mana_cost": "100",
        "description": "Dashes wildly with her brush, dealing 250 (250 + 32% Magical Attack) magical damage to enemies in her path. If she hits an enemy or ink left behind by another active skill, she can dash again in the target direction within 3s. If she dashes 3-5 times, she will jump into the air, becoming untargetable and cleansed of all crowd control effects, and perform continuous attacks on nearby enemies, dealing 460 (460 + 70% Magical Attack) magical damage. The number of attacks is decided by the number of dashes, with 3/4/5 dashes yielding 4/7/10 attacks. When hitting the same unit multiple times, subsequent hits deal only 25% damage.\nShe can dash up to 5 times, and she can attack and use skills between dashes. If interrupted, the skill's CD is reduced by 20%-80%, depending on the number of dashes performed.",
        "table": {
          "Cooldown": ["35", "31", "27"],
          "Dash Damage": ["250", "375", "500"],
          "Base Damage": ["460", "690", "920"]
        }
      }
    }
  }
}

with open("scratch/raw_batch_12.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
