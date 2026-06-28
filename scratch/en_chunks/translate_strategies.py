import json

file_path = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_10.json"
out_path = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_10_done.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

translations = {
  "hero_089": {
    "earlyGame": "Take advantage of your passive's physical defense stacks and HP recovery to actively trade damage in the laning phase. It is entirely possible to overwhelm your lane opponent from the early game using your skill combos.",
    "midGame": "After unlocking your Ultimate at level 4, ride your ship to launch fast ganks in other lanes. Keep a constant eye on the map and immediately rush to potential skirmishes to create a numbers advantage.",
    "lateGame": "In the late game, you function as a powerful initiator. Coordinate with your allies, charge at the enemy backline carries with your ship, and unleash wide-area CC to spark teamfights.",
    "teamfight": "The CC chain from a ship charge into Skill 1 and Skill 2 is extremely powerful. If possible, bring an allied Mage or Marksman on board to dive together, aiming to instantly shatter the enemy formation and wipe them out.",
    "commonMistakes": "Charging in alone on your ship from a distance where allies cannot follow, getting isolated, and dying is a classic mistake. Also, practice steering the ship so you don't accidentally hit walls or obstacles and fail your initiation."
  },
  "hero_090": {
    "earlyGame": "Use the intersecting explosion damage of Skill 1 and Skill 2 to quickly clear minion waves and rush to level 4. With high early harass potential, chip away at your opponent's health to apply pressure.",
    "midGame": "Upon learning your Ultimate at level 4, you gain overwhelming kill potential. Coordinate with your Jungler to roam to side lanes, initiating aggressive ganks—even tower dives—to secure kills and snowball.",
    "lateGame": "In the late game, enemies will build magic defense and group up, making solo kills difficult. Do not dive in recklessly; wait for enemy CC skills to be used before identifying the perfect moment to successfully execute your Ultimate.",
    "teamfight": "At the start of a teamfight, poke from a distance with your skills. The moment the enemy formation breaks or their health drops, dive into the backline with your Ultimate. Your primary goal is to focus your invincible aerial attacks on the enemy carries.",
    "commonMistakes": "Failing the dash combo of your Ultimate and stopping dead in the middle of the enemy team without taking flight is a fatal mistake you must avoid. It is essential to practice in Training Camp to consistently pull off the dash combo from various distances."
  },
  "hero_091": {
    "earlyGame": "Utilize the true damage and recovery from your continuous basic attacks to confidently trade damage from level 1. Assert dominance in 1v1 brawls early on to seize control of your lane.",
    "midGame": "Leverage your mobility to actively participate in skirmishes. Target enemy Mages or Marksmen by initiating with Skill 2's dash, followed by a combo of your enhanced Skill 1's knockup and true damage to secure kills.",
    "lateGame": "As enemy firepower scales in the late game, you will find it harder to survive face-to-face brawls. You must consciously maintain your passive stacks and skillfully use your Ultimate's invincibility frame to dodge lethal enemy skills while fighting.",
    "teamfight": "Your role is to dive directly into the enemy backline and disrupt their formation. Your Ultimate is highly versatile—you can either target an enemy carry to strike from above or cast it on an allied core hero to protect them with a massive shield.",
    "commonMistakes": "Diving into the enemy team without your stacks built up leaves you squishy and easily burst down. Another common beginner mistake is wasting your Ultimate instead of actively using it to dodge powerful enemy CC."
  },
  "hero_092": {
    "earlyGame": "In the early game, use Skill 1's terrain-ignoring movement to efficiently clear the jungle, and launch swift ganks over unexpected walls to dictate the pace of the match.",
    "midGame": "In skirmishes, fight while maintaining mid-range continuous damage and recovery through your basic attack's Soul Chain. Do not miss the moment an enemy's health drops into the execution threshold (instant kill range); secure the kill to snowball.",
    "lateGame": "In the late game, survivability in teamfights becomes a challenge. Instead of charging in first, engage as a secondary follow-up to an ally's initiation. Maximize the sustain from your skills and Ultimate's recovery to outlast your opponents.",
    "teamfight": "Whittle down the enemy frontline tanks while looking for an opening to approach the backline using Skill 1. The ideal approach is to link your Soul Chain to multiple enemies to heal while fighting, executing low-health targets one after another for a multi-kill.",
    "commonMistakes": "Getting locked down by enemy CC chains immediately after engaging and dying helplessly is the most common failure. It is also dangerous to forcefully chase highly mobile enemies who can easily break the Soul Chain's range, leaving you isolated."
  },
  "hero_093": {
    "earlyGame": "Understand the mechanics of your elemental enhancements (Fire, Water, Wind) and swap between them according to the situation in the laning phase. Use the Fire element to harass and the Water element for sustain, farming safely.",
    "midGame": "Increase your impact in skirmishes using combos that combine different elements. Your Ultimate's Dragon form provides powerful mobility, highly useful for diving into the enemy team or executing an emergency escape from dangerous situations.",
    "lateGame": "Your late-game firepower with full equipment is tremendous, allowing you to wipe out enemies with properly enhanced basic attacks. Always stick with your team, secure a safe position, and continuously unleash enhanced basic attacks tailored to the situation.",
    "teamfight": "In teamfights, skillfully switch between the Fire element's burst damage and the Wind element's knockback CC. If an enemy Assassin closes in, use your Ultimate to become untargetable while looking for a chance to counterattack.",
    "commonMistakes": "Entering a fight with the wrong element active is a common beginner mistake. It is also a bad play to waste your powerful Ultimate purely for movement, leaving you defenseless and easily killed in crucial teamfights."
  },
  "hero_094": {
    "earlyGame": "Utilize your skill range to clear minions from a safe position while constantly poking your lane opponent. Since your mana consumption is high in the early game, refrain from wasting skills and manage your resources properly.",
    "midGame": "Upon unlocking your Ultimate, you gain exceptional 1v1 potential by dragging a key enemy target into another dimension (Illusion Realm). You can secure kills by isolating stray enemies or protect your allies by quarantining an invading enemy Jungler.",
    "lateGame": "In the late game, your primary duty is to use your Ultimate to isolate enemies capable of wiping out your team if left unchecked, such as enemy Marksmen or powerful Assassins. Ensure you finish them off in the Illusion Realm, or at the very least stall them to guide the teamfight to your advantage.",
    "teamfight": "At the start of a teamfight, deal damage from the backline using Skill 1 and 2, and cast your Ultimate on the most troublesome enemy when the fight turns chaotic. Since you also enter the Illusion Realm, be careful not to link with the wrong opponent, which risks you getting killed instead.",
    "commonMistakes": "Using your Ultimate on a fed enemy melee carry and getting completely beaten up inside the Illusion Realm is the worst possible mistake. You must accurately assess your damage output versus the enemy's durability, and identify targets you can beat (or need to isolate)."
  },
  "hero_095": {
    "earlyGame": "Always keep an eye on your Star Power (passive gauge), maintaining 1 to 2 bars of gauge while laning or clearing the jungle. By chaining enhanced skills, you can dish out high burst damage right from the early game.",
    "midGame": "Capitalize on your high mobility to clear the jungle quickly and apply pressure across the entire map. Ambush isolated enemy Marksmen or Mages, execute a hit-and-run by securing a kill with your enhanced skill combo, and immediately disengage.",
    "lateGame": "As enemy firepower spikes in the late game, sudden engages become highly risky. Wait for your team's CC or look for a window after major enemy skills have been used before joining the fight, utilizing your Ultimate's damage nullification to persistently survive.",
    "teamfight": "Instead of charging head-on, flank from the side or behind to target the enemy backline. Use Skill 2 to close the gap, dish out damage with your enhanced Skill 1, and perform tricky maneuvers like using your Ultimate to return to your original position to erase damage when the enemy retaliates.",
    "commonMistakes": "Entering a fight without managing your gauge, failing to unleash enhanced skills, and lacking damage is a classic beginner mistake. It is also a bad play to use your Ultimate without keeping track of your return position, accidentally diving right into the middle of the enemy team or under their tower."
  },
  "hero_096": {
    "earlyGame": "Keep your passive in mind, which increases your skill damage the further you are from the target. Farm minions and poke from a safe maximum range by placing Skill 2. While Skill 1's pull is powerful, do not force it early on; use it for defense or to follow up on ganks.",
    "midGame": "Stick with your Jungler or Roamer, using Skill 1 to forcefully drag enemies into your team's formation to secure a steady stream of kills. When your Ultimate is active, you can continuously control enemies, giving you a massive impact in skirmishes.",
    "lateGame": "In late-game teamfights, it is no exaggeration to say that Xi Shi's Skill 1 dictates victory or defeat. Continuously look for pick-offs by landing Skill 1 on enemy carries (Marksmen or Mages) from outside their vision or from bushes, allowing your team to instantly burst them down with concentrated fire.",
    "teamfight": "Always position yourself behind your allies, looking for openings to land your skills on the backline while avoiding the enemy frontline. Since you lack defensive or mobility skills, if an enemy Assassin closes in, you must use the movement speed boost from your Ultimate to run away with all your might.",
    "commonMistakes": "Being too focused on landing Skill 1 and overextending, only to get caught and killed by the enemy, is a fatal mistake. Another common beginner error is dragging an enemy to a position where your allies cannot follow up, completely wasting your valuable CC."
  }
}

for hero_id, trans in translations.items():
    if hero_id in data and "strategy" in data[hero_id]:
        for field, text in trans.items():
            if field in data[hero_id]["strategy"] and data[hero_id]["strategy"][field]:
                data[hero_id]["strategy"][field] = text

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Successfully saved updated JSON to {out_path}")
