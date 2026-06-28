import json
import os

input_path = 'c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_3.json'
output_path = 'c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_3_done.json'

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

translations = {
    "hero_110": {
        "earlyGame": "In the early game, prioritize stability in the laning phase and carefully last-hit minions to scale. Although Mayene has high mobility, careless damage trades will wear down her HP, so look for openings when the enemy wastes their skills to poke with hit-and-run tactics.",
        "midGame": "The mid game is her most powerful phase, especially when she completes her Cooldown Reduction items (such as Boots of Tranquility and Axe of Torment). After clearing waves quickly, actively roam to side lanes or the enemy jungle. Secure advantages for your team by dealing burst damage to isolate squishy targets (Mages and Marksmen) in small skirmishes.",
        "lateGame": "In the late game, positioning becomes more difficult as the enemy team completes defensive items and groups up. Avoid engaging head-on; instead, flank from the side or rear like an Assassin. Thoroughly execute a 'hit-and-run' style by quickly taking down the enemy's backline carries and immediately disengaging with Skill 2.",
        "teamfight": "Leave the role of initiating teamfights to allied Tanks and wait for the enemy's strong CC skills to be consumed. Look for an opening to dive into the enemy's backline with combos like 'Skill 1 -> Flash -> Skill 1'. Inflict lethal damage while using the invincibility and recovery effects to survive and disrupt the battlefield.",
        "commonMistakes": "A common mistake made by beginners is randomly spamming complex skill combos (1-1, 1-2, 2-1, 2-2) regardless of the situation. In particular, avoid the mistake of using an offensive combo when you need to escape, leaving you without a disengage skill, or diving in first while the enemy's CC is still available, which will get you killed instantly."
    }
}

for hero_key, hero_data in data.items():
    if 'strategy' in hero_data and hero_key in translations:
        for field in ['earlyGame', 'midGame', 'lateGame', 'teamfight', 'commonMistakes']:
            if field in hero_data['strategy'] and field in translations[hero_key]:
                hero_data['strategy'][field] = translations[hero_key][field]

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved to " + output_path)
