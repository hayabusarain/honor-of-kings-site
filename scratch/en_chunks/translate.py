import json
import re

input_path = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_5.json"
output_path = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_5_done.json"

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

translations_map = {
    'hero1': {
        "earlyGame": "Early Game: Play in the Clash Lane or as a Roamer. Use your passive \"Flow\" to enhance durability (Vitality) or mobility (Swiftness) while stabilizing the laning phase and supporting the Jungler. Utilize Skill 1's shield and recovery to build an advantage in skirmishes.",
        "midGame": "Mid Game: Group up with your allies and contribute to securing objectives like Tyrants and Overlords. Use Skill 2's knockup and the strong CC from your Ultimate to create engagement opportunities.",
        "lateGame": "Late Game: Act as the main Tank on the frontline to absorb enemy attacks. It is crucial to manage your \"Flow\" stacks and hit enemy carries (Mages and Marksmen) with your Ultimate to take control of teamfights.",
        "teamfight": "Teamfights: Dive into the enemy formation with your Ultimate and spread CC to create a favorable environment for your backline to deal damage. Avoid chasing too deep and focus on peeling for your carries.",
        "commonMistakes": "Common Mistakes: Fighting without consuming \"Flow\" stacks, or diving alone into the enemy formation without allied support and getting isolated."
    },
    'hero2': {
        "earlyGame": "Early Game: Quickly clear minions in the Mid Lane and look for opportunities to roam and gank the side lanes. Utilize your passive \"Flow\" to increase your Magical Attack and poke enemies from a distance to poke down their HP.",
        "midGame": "Mid Game: Coordinate with your Jungler and contribute as a damage dealer in objective fights for Tyrants and others. Place Skill 2's magic circle on the enemy's path to restrict their movement while dealing damage.",
        "lateGame": "Late Game: Avoid surprise attacks from enemy Assassins while continuously dealing damage from the backline. Your Ultimate's laser has excellent range and damage, making it perfect for poking down enemy HP before a teamfight.",
        "teamfight": "Teamfights: Always position yourself behind your allied Tank (in the safe zone) to avoid taking enemy CC or burst damage. Use Skill 2 to lock down enemies and try to hit multiple targets with your Ultimate to maximize damage.",
        "commonMistakes": "Common Mistakes: Stepping too far forward and getting targeted by enemy Assassins or Fighters. Also, wasting Flash and losing your only escape route, since you lack self-defense skills."
    },
    'hero3': {
        "earlyGame": "Early Game: Focus on safely clearing minions in the Farm Lane to earn Gold. Since you are very squishy early on, be wary of enemy ganks and fundamentally position safely under your tower.",
        "midGame": "Mid Game: Your damage output increases as you complete your core equipment. Stick with your allied Roamer to avoid isolation while farming. In skirmishes, output damage with normal attacks from the backline.",
        "lateGame": "Late Game: You become the main damage source (Carry) for your team. Under the constant protection of your allies, melt down enemies front-to-back with your overwhelming attack speed and firepower.",
        "teamfight": "Teamfights: Either use your Ultimate's stun to initiate on the enemy Carry or save it for self-defense. Never step up to the absolute frontline; keep attacking the closest enemy from behind your allies.",
        "commonMistakes": "Common Mistakes: Pushing the frontline alone without looking at the map and getting ganked, or forcing your way forward to target the enemy backline in teamfights and getting killed."
    },
    'hero4': {
        "earlyGame": "Early Game: As a Clash Laner or Roamer, proactively trade damage utilizing your CC immunity (Super Armor) when casting skills. You have high base damage early on, allowing for aggressive plays.",
        "midGame": "Mid Game: Move with your Jungler to create opportunities for ganks or objective fights. Use the Skill 1 -> Skill 2 -> Skill 1 combo to knock up enemies, creating easy kill setups for your allies.",
        "lateGame": "Late Game: As the team's main initiator, do not miss the chance to engage when enemies misposition. Your job is to disrupt the enemy formation using your high durability and draw their focus.",
        "teamfight": "Teamfights: Aim to hit multiple enemies, especially Mages or Marksmen, with the wide-area knockup of your Ultimate. Since you are immune to CC while casting skills, you can force enemies to waste their control abilities.",
        "commonMistakes": "Common Mistakes: Diving alone from a distance your allies cannot follow, resulting in isolation and a pointless death. Fighting without stacking Fighting Spirit (passive), failing to fully utilize your durability."
    }
}

count = 0
for hero_key, hero_data in data.items():
    if "strategy" in hero_data:
        strategy = hero_data["strategy"]
        if "earlyGame" not in strategy: continue
        eg = strategy["earlyGame"]
        
        assigned_hero = None
        if "クラッシュレーンまたはロームとしてプレイし" in eg:
            assigned_hero = 'hero1'
        elif "ミッドレーンでミニオンを素早く処理し" in eg:
            assigned_hero = 'hero2'
        elif "ファームレーンでミニオンを確実に倒し" in eg:
            assigned_hero = 'hero3'
        elif "CC無効（スーパーアーマー）を活かして" in eg:
            assigned_hero = 'hero4'
            
        if assigned_hero:
            strategy["earlyGame"] = translations_map[assigned_hero]["earlyGame"]
            strategy["midGame"] = translations_map[assigned_hero]["midGame"]
            strategy["lateGame"] = translations_map[assigned_hero]["lateGame"]
            strategy["teamfight"] = translations_map[assigned_hero]["teamfight"]
            strategy["commonMistakes"] = translations_map[assigned_hero]["commonMistakes"]
            count += 1

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Translation applied successfully. Translated {count} heroes.")
