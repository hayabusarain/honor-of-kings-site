import json

data = {
  "154": { 
    "skills": [
      {
        "skill_name": "Passive Skill: Great Wall Guardian",
        "cd": "",
        "mana_cost": "",
        "tags": ["Speed Up", "Silence", "Slow", "Enhance", "Immunity", "Damage Reduction"],
        "description": "While her dual swords are drawn, Mulan gains 40 Movement Speed, and her Basic Attacks and skills place 1 stack of Balance on enemy heroes every second for 5s. At 5 stacks, the marks detonate, dealing 225 (140% physical attack) physical damage to enemies while silencing them and slowing them immensely for 1s.\nWhile her heavy sword is drawn, her Attack Speed is reduced, but Basic Attacks deal an extra (50% physical attack) damage. She also gains crowd control immunity and 45% damage reduction while using skills."
      },
      {
        "skill_name": "Skill 1: Snaking Strike",
        "cd": "8s",
        "mana_cost": "",
        "tags": ["Movement", "Damage"],
        "description": "Mulan dashes in the target direction. During the dash, she can dash again by using the movement wheel. Each dash deals 134 (70 + 40% physical attack) physical damage to enemies in her path.\nIf she hits an enemy during the dash, she can use this skill again within 5s."
      },
      {
        "skill_name": "Skill 2: Dagger Waltz",
        "cd": "12s",
        "mana_cost": "",
        "tags": ["Slow", "Damage", "Cooldown"],
        "description": "Mulan throws a sword in the target direction, dealing 400 (400 + 110% extra physical attack) physical damage to enemies in its path. When the sword reaches its max range, it spins in place for 3s, dealing 160 (160 + 50% extra physical attack) physical damage to enemies within range every 0.5s and reducing their Movement Speed by 25% for 1s.\nShe can retrieve the sword by walking next to it. Doing so reduces the skill's CD by 5s."
      },
      {
        "skill_name": "Skill 3: Blooming Blade (Light)",
        "cd": "6s",
        "mana_cost": "",
        "tags": ["Switch Form", "Damage Reduction", "Damage"],
        "description": "Mulan draws her heavy sword, gaining 45% damage reduction while doing so and dealing 377 (200 + 110% physical attack) physical damage to nearby enemies. She also gains 60 physical attack for 5s.\nShe gains access to her heavy sword skills while her heavy sword is drawn."
      },
      {
        "skill_name": "Skill 1: Sundering Slash",
        "cd": "8s",
        "mana_cost": "",
        "tags": ["Damage", "Crowd Control"],
        "description": "Mulan charges up and swings her sword in the target direction, dealing 216 (120 + 60% physical attack) - 1,083 (600 + 300% physical attack) physical damage to enemies within range. Damage dealt depends on the duration of the charge.\nIf she charges up for 0.75s, hit enemies are slowed by 25% for 2s.\nIf she charges up for 1.5s or more, hit enemies are launched for 0.5s.\nIf she hits an enemy with this skill, she can use it again within 5s."
      },
      {
        "skill_name": "Skill 2: Blade Flurry",
        "cd": "12s",
        "mana_cost": "",
        "tags": ["Crowd Control", "Damage"],
        "description": "Mulan advances in the target direction while slashing 4 times with her sword. Each slash deals 320 (320 + 85% extra physical attack) physical damage and knocks back enemies within range while reducing their Movement Speed by 25% for 2s."
      },
      {
        "skill_name": "Skill 3: Blooming Blade (Heavy)",
        "cd": "6s",
        "mana_cost": "",
        "tags": ["Switch Form", "Enhance", "Damage"],
        "description": "Mulan draws her dual swords and makes a sweeping slash, dealing 377 (200 + 110% physical attack) physical damage to nearby enemies and gaining 60% Attack Speed for 5s.\nShe gains 40 Movement Speed and can use her dual sword skills while her dual swords are drawn."
      }
    ]
  },
  "130": { 
    "skills": [
      {
        "skill_name": "Passive Skill: Dual Blade Style",
        "cd": "",
        "mana_cost": "",
        "tags": ["Enhance", "Damage", "Cooldown"],
        "description": "Musashi uses 1 Energy when he casts a skill, enhancing his next Basic Attack. The enhanced Basic Attack varies based on his Energy level.\n2 Energy: Dashing strikes that deal physical damage and slows them.\n1 Energy: Quick consecutive slashes that deal physical damage.\nEnhanced Basic Attacks recover Health and reduce the cooldowns of Skill 1 and 2."
      },
      {
        "skill_name": "Skill 1: Illuminating Slash",
        "cd": "5s",
        "mana_cost": "",
        "tags": ["Damage", "Block"],
        "description": "Musashi unleashes a sword wave, dealing physical damage and reducing enemies' Movement Speed. The sword wave blocks non-piercing projectiles in its path."
      },
      {
        "skill_name": "Skill 2: Dual Blade Dash",
        "cd": "8s",
        "mana_cost": "",
        "tags": ["Movement", "Shield"],
        "description": "Musashi dashes in the target direction, dealing physical damage to enemies in his path. If he hits an enemy, he gains a shield."
      },
      {
        "skill_name": "Skill 3: The Obliterator",
        "cd": "50s",
        "mana_cost": "",
        "tags": ["Crowd Control", "Damage"],
        "description": "Musashi leaps toward the target, knocking them up and dealing physical damage. He applies Grievous Wounds to the target, causing them to be unable to recover Health for a period. He gains 2 Energy and Damage Reduction during this skill."
      }
    ]
  },
  "162": { 
    "skills": [
      {
        "skill_name": "Passive Skill: Blade of the Fox",
        "cd": "",
        "mana_cost": "",
        "tags": ["Enhance", "Damage"],
        "description": "Nakoruru's next Basic Attack is enhanced after her skills hit an enemy, dealing extra physical damage."
      },
      {
        "skill_name": "Skill 1: Amaterasu",
        "cd": "6s",
        "mana_cost": "50",
        "tags": ["Damage", "Cooldown"],
        "description": "Nakoruru commands Mamahaha to attack the target, dealing physical damage and marking them. Her other damage will trigger the mark, dealing extra physical damage based on the target's max Health and reducing this skill's cooldown."
      },
      {
        "skill_name": "Skill 2: Anschatsbe",
        "cd": "6s",
        "mana_cost": "50",
        "tags": ["Movement", "Recovery"],
        "description": "Nakoruru dashes forward, dealing physical damage to enemies in her path. She recovers Health for each enemy hero hit."
      },
      {
        "skill_name": "Skill 3: Mamahaha Flight",
        "cd": "12s",
        "mana_cost": "100",
        "tags": ["Movement", "Damage"],
        "description": "Nakoruru flies with Mamahaha, gaining Movement Speed. She can use the skill again to dive to the target location, dealing physical damage, reducing enemies' Movement Speed, and reducing their damage output."
      }
    ]
  },
  "180": { 
    "skills": [
      {
        "skill_name": "Passive Skill: Scorching Ember",
        "cd": "",
        "mana_cost": "",
        "tags": ["Shield", "Speed Up"],
        "description": "Nezha receives a shield that negates true damage for every enemy hero he damages with a skill. This also triggers Wind-Fire Wheels 1 time, increasing Movement Speed by 5% for 3s, for up to 5 stacks. When he deals damage using Basic Attacks or Scorching Ember, or deals damage to a non-hero unit, he gets a reduced shield."
      },
      {
        "skill_name": "Skill 1: Fire-tipped Spear - Sweep",
        "cd": "5s",
        "mana_cost": "30",
        "tags": ["Damage"],
        "description": "Nezha deals physical damage to nearby enemies and places Scorching Ember on them, dealing true damage to the enemy every second for 5s, for up to 3 stacks. Damage increases by 50% with each stack. Scorching Ember also reduces the target's Health recovery by 15%."
      },
      {
        "skill_name": "Skill 2: Red Armillary Sash - Bind",
        "cd": "1.5s",
        "mana_cost": "15",
        "tags": ["Damage", "Movement"],
        "description": "Flips behind the target to deal physical damage. He also gains a shield that negates true damage, halved for non-hero units. This skill cannot be used on the same target again for 3s."
      },
      {
        "skill_name": "Skill 3: Universe Ring - Skyfall",
        "cd": "50s",
        "mana_cost": "80",
        "tags": ["Chase", "Damage Reduction", "Crowd Control"],
        "description": "Nezha selects an enemy hero and flies to their location, dealing physical damage and knocking them back. After landing, Nezha gains 10% damage reduction and 20% Resistance for 4s. This skill enters a 50%-100% CD based on flight distance."
      },
      {
        "skill_name": "Skill 4: Universe Ring",
        "cd": "80s",
        "mana_cost": "90",
        "tags": ["Vision", "Enhance", "Damage"],
        "description": "Nezha unleashes the universe ring, dealing physical damage to all enemy heroes across the entire map and gaining vision. Enhances the range of Universe Ring - Skyfall to cover the entire map for 5s. Heroes revealed by this effect cannot use recall."
      }
    ]
  },
  "179": { 
    "skills": [
      {
        "skill_name": "Passive Skill: Divine Consciousness",
        "cd": "",
        "mana_cost": "",
        "tags": ["Enhance"],
        "description": "Nuwa gains 10-20% vision, Basic Attack range, and skill range (increases with hero level)."
      },
      {
        "skill_name": "Skill 1: Divine Glow - Creation",
        "cd": "8.5s",
        "mana_cost": "45",
        "tags": ["Damage", "Crowd Control", "Terrain"],
        "description": "Nuwa unleashes energy in the target direction, dealing magical damage to enemies in its path and knocking them back. After hitting an enemy, the energy gradually stops and expands in a cross shape, forming a matrix. This deals magical damage to enemies hit. The cross deals an extra 50% damage to enemies at its center, and sets off explosions if it touches matrices."
      },
      {
        "skill_name": "Skill 2: Divine Glow - Coalescence",
        "cd": "0s",
        "mana_cost": "40",
        "tags": ["Terrain", "Crowd Control", "Damage"],
        "description": "Nuwa creates a matrix that only she can traverse and enemy heroes cannot pass through. Each matrix lasts 3.5s. Whenever a matrix is hit by one of Nuwa's other skills, it sets off an explosion that deals magical damage to nearby enemies. When matrices fuse, they deal magical damage on collision and knock back enemies. Up to 3 matrices can be stocked."
      },
      {
        "skill_name": "Skill 3: Divine Glow - Emergence",
        "cd": "30s",
        "mana_cost": "80",
        "tags": ["Teleportation", "Slow", "Shield"],
        "description": "Nuwa teleports to the target location while gaining 30% Movement Speed and a shield that negates damage for 2s. She also deals magical damage to enemies within the target area and slows them by 25-50% for 0.5s."
      },
      {
        "skill_name": "Skill 4: Divine Glow - Annihilation",
        "cd": "50s",
        "mana_cost": "120",
        "tags": ["Damage"],
        "description": "Nuwa releases pure energy, dealing magical damage to enemies in its path. The pure energy will set off an explosion if it touches a matrix."
      }
    ]
  },
  "502": { 
    "skills": [
      {
        "skill_name": "Passive Skill: Blast",
        "cd": "",
        "mana_cost": "",
        "tags": ["Enhance", "Damage"],
        "description": "While in human form, Pei's Basic Attack range is increased and each Basic Attack restores 5 Energy to him. His Basic Attack also deals an extra 20 magical damage. This extra damage can stack up to 3 times when attacking the same target within 3s."
      },
      {
        "skill_name": "Skill 1: Striker Stance",
        "cd": "8s",
        "mana_cost": "40",
        "tags": ["Slow", "Damage"],
        "description": "Pei fires Inner Energy in the target direction, dealing magical damage to enemies in its path, and slowing them by 25% for 1.5s. Recovers 20 Energy when Skill 1 hits."
      },
      {
        "skill_name": "Skill 2: Guarding Stance",
        "cd": "8s",
        "mana_cost": "50",
        "tags": ["Shield", "Enhance", "Damage"],
        "description": "Pei envelops himself in Beastly Instincts, dealing magical damage to nearby enemies while creating a shield that negates damage and increasing his Attack Speed by 30% for 5s. While the shield is active, he deals magical damage to nearby enemies every 0.5s."
      },
      {
        "skill_name": "Skill 3: Tiger Form",
        "cd": "6s",
        "mana_cost": "0",
        "tags": ["Switch", "Enhance"],
        "description": "Pei switches to tiger form, gaining 15% Movement Speed for 1s and enhancing his next 2 Basic Attacks for 5s. First Enhanced Basic Attack: He dashes at the target, dealing physical damage and inflicting them with extreme slow. Second Enhanced Basic Attack: He deals magical damage to enemies within range in front of him."
      },
      {
        "skill_name": "Passive Skill: Beastly Instincts",
        "cd": "",
        "mana_cost": "",
        "tags": ["Enhance", "Speed Up"],
        "description": "While in tiger form, Pei gains 25 Physical Attack, 60 Physical Defense, 60 Magical Defense, and 25 Movement Speed."
      },
      {
        "skill_name": "Skill 1: Roaring Tiger Stance",
        "cd": "3s",
        "mana_cost": "50",
        "tags": ["Damage"],
        "description": "Pei swipes at the target, dealing physical damage. An extra 1% damage is dealt to the target for every 1% of their lost Health. If this skill defeats the target enemy, he recovers 20 Energy."
      },
      {
        "skill_name": "Skill 2: Leaping Tiger Stance",
        "cd": "7s",
        "mana_cost": "50",
        "tags": ["Movement", "Damage"],
        "description": "Pei pounces in the target direction, dealing physical damage to enemies in his path. If he pounces into terrain, he will latch on for 1s, during which he can pounce again by using the movement wheel, dealing physical damage to enemies in his path. If his pounce hits any enemy, he recovers 20 Energy and reduces Skill 2's CD by 30%."
      },
      {
        "skill_name": "Skill 3: Human Form",
        "cd": "6s",
        "mana_cost": "0",
        "tags": ["Switch", "Enhance"],
        "description": "Pei switches to Human Form, gaining 15% Movement Speed for 1s and enhancing his next Basic Attack for 5s. The enhanced Basic Attack allows him to fire a stronger Inner Energy at the target, dealing magical damage to the target and enemies in a cone-shaped area behind them."
      }
    ]
  },
  "534": { 
    "skills": [
      {
        "skill_name": "Passive Skill: Scimitar's Edge",
        "cd": "",
        "mana_cost": "",
        "tags": ["Damage", "Recovery"],
        "description": "Sakeer's basic attacks deal extra physical damage and heal him. When he casts a skill, he gains a stack of Blade Mark, up to 3 stacks. At 3 stacks, his next basic attack consumes all stacks to deal massive damage and heal himself."
      },
      {
        "skill_name": "Skill 1: Whirling Blades",
        "cd": "6s",
        "mana_cost": "",
        "tags": ["Damage", "Slow"],
        "description": "Sakeer throws out two scimitars that swirl around him, dealing physical damage to enemies and slowing them down. If both scimitars hit the same target, it deals extra damage and applies a short slow."
      },
      {
        "skill_name": "Skill 2: Phantom Step",
        "cd": "8s",
        "mana_cost": "",
        "tags": ["Movement", "Enhance"],
        "description": "Sakeer dashes forward and gains Attack Speed and Movement Speed. His next basic attack becomes a phantom strike, dealing extra damage and teleporting him slightly behind the target."
      },
      {
        "skill_name": "Skill 3: Blade Dance",
        "cd": "40s",
        "mana_cost": "",
        "tags": ["Damage", "Invincibility"],
        "description": "Sakeer unleashes a flurry of attacks, dealing multiple instances of physical damage to all enemies in an area. During this skill, he becomes untargetable and immune to crowd control. Kills or assists reduce the cooldown of this skill."
      }
    ]
  },
  "513": { 
    "skills": [
      {
        "skill_name": "Passive Skill: Calligraphy Mastery",
        "cd": "",
        "mana_cost": "",
        "tags": ["Damage", "Enhance"],
        "description": "Shangguan's basic attacks gain enhanced range and deal extra magical damage after a short delay or when hitting an enemy with a skill. Her abilities leave behind ink marks that interact with each other to cause additional effects."
      },
      {
        "skill_name": "Skill 1: Brush Strike",
        "cd": "5s",
        "mana_cost": "40",
        "tags": ["Damage"],
        "description": "Shangguan throws a brush in a straight line, dealing magical damage to enemies in its path. The brush explodes at maximum range or upon hitting a hero, dealing area magical damage."
      },
      {
        "skill_name": "Skill 2: Ink Spill",
        "cd": "10s",
        "mana_cost": "50",
        "tags": ["Damage", "Slow"],
        "description": "Shangguan writes on the ground, creating a zone of ink. Enemies in the zone take continuous magical damage and are slowed. If Brush Strike hits the ink, it triggers an explosion."
      },
      {
        "skill_name": "Skill 3: Ascendant Fly",
        "cd": "35s",
        "mana_cost": "90",
        "tags": ["Movement", "Damage", "Invincibility"],
        "description": "Shangguan dashes forward. If she hits an enemy or an ink mark, she can dash again up to 5 times. After completing 5 dashes, she leaps into the air, becoming untargetable and raining down ink bolts on nearby enemies, dealing massive magical damage."
      }
    ]
  }
}

with open("scratch/ocr/chunk_11_result.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
