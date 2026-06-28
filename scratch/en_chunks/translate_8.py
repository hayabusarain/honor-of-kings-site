import json

translations = {
  "hero_048": {
    "earlyGame": "Erin's early game damage is modest among marksmen, and she is very squishy and easily targeted by assassins. While protected by your support, use Skill 1 from a safe position to poke (harass) enemies. Focus entirely on avoiding deaths and steadily farming gold.",
    "midGame": "Once you have core items like Golden Excalibur and Bloodweeper for attack speed and magic pierce, the mobility from your passive's 'Elf Step' comes alive. Continuously land magic damage basic attacks while dodging enemy skills with your step to gain the upper hand in small skirmishes.",
    "lateGame": "Fully equipped Erin becomes a monster with tremendous continuous damage and sustain from magic lifesteal. Attack relentlessly from behind your frontline tanks, weaving in your ultimate to shred enemies. Even if enemy fighters approach, you can kite them by maintaining distance with your step and fight back.",
    "teamfight": "Positioning is everything. Never step out in front; use your allied tanks and fighters as shields and maintain maximum range. Stay vigilant against deadly enemy CC skills and assassin dives. Use the acceleration of Skill 2 and Summoner Spells (Frenzy or Purify) at the right timing to survive while continuously dealing damage.",
    "commonMistakes": "A common mistake for beginners is failing to master the 'enhanced basic attack (piercing damage)' and the resulting 'step' after the passive gauge is full, leading to accidentally stepping right in front of the enemy and getting instantly killed. You need to always be aware of the left stick's input direction and practice stepping away to create distance from enemies."
  },
  "hero_049": {
    "earlyGame": "In the early game, use Skill 2 from a safe position to quickly clear minion waves and rush to level 4. After clearing the wave, roam to side lanes or the jungle to grant vision and provide backup for your allies.",
    "midGame": "In the mid game, always move together with your allied jungler or roamer. During small skirmishes, use the walls from Skill 1 to cut off the enemy's escape route, and reliably neutralize key enemy targets with the powerful suppression effect of your ultimate to assist in getting kills.",
    "lateGame": "In the late game, your damage output increases, but you become a prime target for enemy assassins, so pay the utmost attention to your positioning. Stay close to your allied backline (marksman) and adopt a defensive playstyle to protect them.",
    "teamfight": "In teamfights, never initiate first. If enemy tanks or fighters dive in, lock them down with Skill 1 and your ultimate. The most powerful counterplay is to immediately suppress an enemy assassin with your ultimate the moment they approach your allied carry, allowing your team to easily finish them off.",
    "commonMistakes": "A common beginner mistake is indiscriminately using the ultimate on enemy tanks. You must save your ultimate for crucial targets that need to be eliminated, such as enemy carries or assassins. Also, avoid moving alone."
  },
  "hero_050": {
    "earlyGame": "In the early game, use your Skill 2 fan from a long distance to safely last-hit minions and poke the enemy. Pay attention to your energy management and look for enemy openings to harass them with your passive's enhanced basic attack.",
    "midGame": "From level 4 onwards, utilize your high mobility and burst damage to actively look for ganks in the side lanes. Hit enemies with Skill 2 to lower their magic defense, then quickly close the gap with Skill 1 or your ultimate to unleash your combo.",
    "lateGame": "In the late game, you have enough damage to instantly burst down enemy marksmen or mages, but you are also extremely fragile. Avoid frontal engagements; instead, hide in the brush and wait for opportunities to ambush the enemy backline.",
    "teamfight": "In teamfights, patiently wait for the enemy to use their CC skills. Look for the moment the enemy formation breaks or their backline becomes isolated, then dive in from the flank or rear. Group enemies up with your ultimate and Skill 1 while dealing burst damage, and disengage immediately.",
    "commonMistakes": "A common mistake for beginners is missing skills, which prevents energy recovery and leaves you unable to do anything. Especially if you miss Skill 2, which is key to engaging, it's crucial to know when to pull back instead of forcing an engagement."
  },
  "hero_051": {
    "earlyGame": "In the early game, move with your mid laner or jungler. Enter water areas (such as the river) to enhance your own recovery and gain vision. Thoroughly use the sound waves of Skill 1 to check bushes for safety and securely support your allies' farm.",
    "midGame": "Once you reach level 4 and unlock your ultimate (Celestial Melody), form a pact with the ally who has the most powerful ultimate (e.g., Lu Bu or Diaochan). Anticipate where teamfights will occur and use Skill 2 to create a water area, setting up a favorable combat environment.",
    "lateGame": "In the late game, closely follow your key allies and prioritize survival above all else. As long as Dolia survives, allies can repeatedly use their skills. Always stay alert to the positions of enemy assassins and use the knockback of Skill 1 to prevent them from engaging.",
    "teamfight": "In teamfights, activate your ultimate right after your allied carry uses a powerful skill to instantly reset its cooldown. Using Skill 1 inside a water area provides an AoE stun, so use it effectively when enemies are grouped up or when allies are being attacked.",
    "commonMistakes": "A frequent beginner mistake is misjudging whose skill to reset, ending up refreshing a low-impact skill. Additionally, since her durability is not high, standing on the frontline like a tank will result in her getting killed easily."
  },
  "hero_052": {
    "earlyGame": "Nakoruru has low mobility until level 4 when she unlocks her ultimate, so prioritize farming the jungle. Once you reach level 4 and can use Mamahaha (ultimate), your ganking potential skyrockets, so actively target isolated enemies for kills.",
    "midGame": "From the mid game onwards, fly freely across the map, repeatedly farming and ganking to expand your gold lead. Your damage spikes significantly once you have your core items, so seize control of object management like destroying towers and securing dragons.",
    "lateGame": "In late game teamfights, breaking through the frontline is difficult, so focus on flanking from the enemy's blind spots or sides. Target enemy mages and marksmen, and quickly burst them down with a combo starting from your ultimate, followed by Skill 1 and Skill 2.",
    "teamfight": "Stay hidden at the start of teamfights and engage only when an opening appears, such as after major enemy CC skills have been used on other targets. The second phase of your ultimate reduces the damage dealt by enemies, making it ideal to secure kills while suppressing their counterattacks.",
    "commonMistakes": "Beginners tend to rely too much on the movement speed boost from her ultimate and recklessly dive alone into the middle of the enemy team. Since Nakoruru is squishy and will be instantly burst down if caught by hard CC, accurately assessing the kill threshold and securing an escape route is essential."
  },
  "hero_053": {
    "earlyGame": "He boasts very high base damage and skill rotation from the early game. As a jungler, you can execute powerful ganks from level 2. In the Clash Lane, use the enhanced basic attack from your passive (Concealed Saber) and skill pokes to dominate your opponent and seize the initiative.",
    "midGame": "The mid game is when he shines the most. Actively look for kills using a combo of closing the gap with your dash (Skill 1), landing a stun (Skill 2), and following up with your ultimate to snowball the game. Invading the enemy jungle to steal resources is also highly effective.",
    "lateGame": "In the late game, enemies become tankier, making it harder to burst them down with a single combo. Avoid 5v5 frontal teamfights; shift your playstyle to hiding in brushes to assassinate isolated enemy carries, or following up on your team's CC.",
    "teamfight": "In teamfights, instead of trying to wear down enemy tanks from the front, flank to apply pressure on the enemy backline. Ensure the tip of Skill 2 hits to land the stun, and utilize the healing effect of your ultimate to fight tenaciously with hit-and-run tactics.",
    "commonMistakes": "Beginners often struggle with aiming Skill 1 (Concealed Saber Swallow Return) and accidentally jump in the wrong direction instead of towards the enemy. Additionally, failing to capitalize on an early lead and dragging the game out, only to fall off in the late game, is a typical losing pattern."
  },
  "hero_054": {
    "earlyGame": "In the Clash Lane, use Skill 2 (Whirling Strike) to quickly clear minion waves and create a level advantage. Utilize the high HP regeneration from your passive to actively trade damage and continuously apply pressure to your opponent.",
    "midGame": "From level 4 onwards, you gain strong pursuit capabilities and burst damage. After pushing your lane, actively roam to the mid lane or enemy jungle. Apply silence (Skill 1) to enemy mages or junglers to seal their skills and coordinate with allies to secure kills.",
    "lateGame": "In the late game, you function as the team's main tank or initiator. Stand on the frontline to absorb enemy attacks while thoroughly peeling for your carries, disrupting approaching enemy assassins or fighters with Skill 1 and your ultimate so your carries can safely deal damage.",
    "teamfight": "In teamfights, charge deep into the enemy lines and target key enemies (primarily marksmen or mages). Silence them with Skill 1 and follow up immediately with the knockup from your ultimate. This prevents them from counterattacking or escaping, creating a decisive opportunity for your team to focus fire.",
    "commonMistakes": "Because he is easy to play, beginners tend to charge blindly into the enemy team alone and get isolated. Arthur alone lacks the damage to finish off enemies, so it is crucial to engage only when your allies are close enough and ready to follow up."
  },
  "hero_055": {
    "earlyGame": "Since his damage is unstable until he has items, avoid forced ganks in the early game and focus on farming the jungle. Your top priority should be reaching level 4 efficiently and completing your core items (critical rate gear).",
    "midGame": "Once you start completing your critical strike items, your burst damage will dramatically increase. Utilize your high mobility to roam the map, ambush isolated enemy marksmen or mages who are farming, and burst them down with a single combo to widen the gold gap.",
    "lateGame": "In the late game, your role is to exploit momentary openings to instantly assassinate enemy carries. If the enemy's defense is tightly packed, avoid forcing an engage. Instead, employ effective strategies like setting up brush ambushes or split-pushing side lanes to force the enemy to scatter.",
    "teamfight": "Never initiate a teamfight first. Wait until your allied tank has absorbed the enemy's CC skills, then use the jump from Skill 2 to dive directly onto the enemy backline. Activate the invincibility shield of Skill 1 at the right moment to secure kills while negating enemy counterattacks.",
    "commonMistakes": "Beginners often press skills too quickly in succession, failing to weave in the 'enhanced basic attack' from the passive before casting the next skill. Always adhere to the rhythm of 'Skill -> Enhanced Basic Attack -> Skill' to maximize your damage output."
  },
  "hero_056": {
    "earlyGame": "As a roamer or Clash Laner, utilize the high defense from your passive to hold the frontline. Skill 1 can be tapped for quick damage or held to harass from a distance. Adapt its usage to the situation to establish lane dominance.",
    "midGame": "In the mid game, actively participate in ganks and cover allies, using the dash knockup of Skill 2 as an initiation. Utilize the knockback effect triggered when retrieving the thrown weapon to disrupt the enemy formation or peel for your allies.",
    "lateGame": "In the late game, your role shifts heavily to being the team's main tank. Simply staying near the allied hero with the lowest HP grants them a defensive buff from your passive. Stick closely to your allied carries and protect them fiercely from enemy assassins.",
    "teamfight": "In teamfights, the massive AoE knockup of your ultimate (Earth Splitter) serves as an extremely powerful engagement tool. Charge up to split the earth and knock up grouped enemies, then use the residual damage and slow of the fissure to cut off their escape routes, creating an environment where your team can unleash their damage all at once.",
    "commonMistakes": "A frequent beginner mistake is using the ultimate too early, ending up isolated in a position where allies cannot follow up. Furthermore, failing to utilize the weapon throw of Skill 1 and merely diving in wastes his inherent crowd control potential."
  },
  "hero_057": {
    "earlyGame": "Possessing overwhelming close-range burst damage, clear the jungle quickly from the early game and invade the enemy jungle to apply pressure. Once you reach level 4, immediately secure objectives (Dragon) or execute a powerful gank.",
    "midGame": "The mid game is when Liu Bei can dominate skirmishes, utilizing the shield and CC immunity from his ultimate. Charge at enemies with Skill 2 to knock them back, and secure kills with full shotgun hits at point-blank range, completely taking control of the game's tempo.",
    "lateGame": "In the late game, enemy damage scales up and your ultimate's shield can be broken instantly, greatly reducing your impact. Avoid charging head-on; instead, wait for your allied tank to engage, then dive in from the flank or rear, exclusively targeting enemy assassins or carries.",
    "teamfight": "In teamfights, play like an assassin. Hide in brushes and wait for key enemies to step into vulnerable positions. Close the gap with Skill 2, pop your ultimate, and instantly eliminate them with point-blank burst damage before swiftly disengaging.",
    "commonMistakes": "Beginners often misunderstand the nature of his shotgun and fail to deal damage by using basic attacks from afar. Liu Bei's maximum damage requires all pellets to hit, meaning you must stick at point-blank range to your target."
  },
  "hero_058": {
    "earlyGame": "In the early game, play as a roamer to accompany your mid laner or jungler. Grant shields with Skill 2 while providing vision and assisting with farming. Consistently use basic attacks and skills to quickly build up the 'Madness' gauge required to activate your ultimate.",
    "midGame": "Once your Madness gauge is full, you are capable of powerful counter-engages and initiations. Prioritize protecting your allied marksmen or carries. If an enemy dives in, knock them back with Skill 1. In tight situations, turn the tide with the massive shield and roar of your ultimate.",
    "lateGame": "In late game teamfights, Zhang Fei's ultimate becomes the deciding factor. Use it either as a counter against enemy assassins targeting your carries, or initiate by firing your ultimate the moment the enemy formation lines up, stunning multiple enemies to create the perfect engagement.",
    "teamfight": "It is an absolute requirement to have your Madness gauge at 100 before a teamfight starts. After using your ultimate, you enter Demon mode and can output high physical damage. Stick to the enemy carries and fulfill your role as an impenetrable frontline wall so your team can deal damage safely.",
    "commonMistakes": "A typical beginner mistake is starting a teamfight without a full Madness gauge, making Zhang Fei little more than a walking target. Additionally, since his ultimate's roar knocks enemies away, care must be taken not to shoot it in a direction that accidentally saves enemies from your allies' AoE skills (griefing)."
  },
  "hero_059": {
    "earlyGame": "Capitalize on his ability to adapt to various situations by switching weapons. Choose the advantageous weapon (defense mode or offense mode) according to your opponent's traits to gain the upper hand in the lane. Focus on stacking fighting spirit with your basic attacks.",
    "midGame": "As skirmishes increase in the mid game, use the high burst damage and mobility of Ultra-kill mode to secure kills. Successfully knocking enemies into walls with skills delivers heavy damage and a bind effect, so positioning around terrain is crucial.",
    "lateGame": "In the late game, explosive power comes from activating your ultimate (Descent of the War God) with max stacks. Before teamfights, maintain your fighting spirit stacks using jungle monsters, and be fully prepared to dive the enemy backline.",
    "teamfight": "In teamfights, do not brawl front-to-front; enter from the flank or rear like an assassin. Activate your ultimate to gain super armor and mobility, stick to the enemy carry, and decimate the enemy formation with true damage and wide-range lock-on attacks in Ultra-kill mode.",
    "commonMistakes": "A common hurdle for beginners is failing to grasp the skill variations from the 5 weapons and multiple modes, ending up using the wrong weapon for the situation. Also, engaging without stacked fighting spirit, dealing no damage and getting counter-killed, is a crucial mistake to avoid."
  },
  "hero_060": {
    "earlyGame": "Take advantage of your passive's bonus damage to monsters to clear jungle camps and the scuttler significantly faster than other marksmen, building an early gold lead. In lane, play aggressively by placing Skill 1 (Dark Mark) on the enemy and landing 4 basic attacks for massive burst damage.",
    "midGame": "Demonstrate your excellent objective-taking ability by swiftly destroying dragons and towers, bringing advantages to your entire team. Your passive (Spy's Ears) allows you to detect enemies hiding in brushes, enabling safe split-pushing while avoiding ganks.",
    "lateGame": "In the late game, Fang's continuous damage falls off compared to traditional basic-attack marksmen, making prolonged teamfights disadvantageous. You must exercise game control to coordinate with allies, quickly secure objectives before the enemy defense solidifies, and end the game early.",
    "teamfight": "In teamfights, be extremely wary of approaching enemy assassins and fighters. Your Skill 2 (Rolling Dash) is a precious invincibility movement skill, so always save it for self-peel. Place your ultimate's tornado to zone out the enemy frontline, and steadily secure kills from a safe distance using the explosion damage from Skill 1.",
    "commonMistakes": "The most common beginner mistake is using Skill 2 forward to chase or deal damage, leaving you with no escape from enemy counterattacks or CC. Always remember to use Skill 2 strictly as a 'last resort for survival' to retreat backwards."
  },
  "hero_061": {
    "earlyGame": "In the early game, use the long range of Skill 1 to safely poke the enemy from a distance while clearing minions. Prioritize farming alongside your support while remaining vigilant against ganks from the enemy jungler.",
    "midGame": "As you start completing core items in the mid game, it's important to participate in small teamfights without neglecting to push your lane. Conserve the physical immunity of Skill 2 and use it as a counter the moment enemy assassins or fighters engage on you.",
    "lateGame": "In the late game, you can output extremely high damage but remain defenseless against magic damage. Always position yourself behind allies and ensure you are never isolated. Maneuver with utmost care to stay out of range of enemy mage skills.",
    "teamfight": "In teamfights, the basic rule is to steadily chip away at the closest enemies with basic attacks. If an enemy physical assassin dives you, negate their damage with Skill 2, immediately create distance with your ultimate, and strike back.",
    "commonMistakes": "Wasting Skill 2 (physical immunity) merely for its movement speed boost is a critical mistake. Doing this leaves you with no means of survival when targeted by an enemy assassin."
  },
  "hero_062": {
    "earlyGame": "Be proactive from the early game. Invade the enemy jungle and use your hook to drag out buff monsters, disrupting the enemy jungler's farm. Hiding in the mid lane bushes and applying constant pressure with your hook is also highly effective.",
    "midGame": "Move together with your allies and aim for pick-offs (eliminating isolated enemies) by hooking from unwarded bushes. Once a hook lands, immediately use your ultimate to suppress the enemy and prevent their escape.",
    "lateGame": "You have the ability to decide late-game teamfights, but the vulnerability after missing a hook is massive. Wait for a guaranteed opportunity or layer your hook with allied CC.",
    "teamfight": "Ideally, you should hook in an enemy mage or marksman before a teamfight erupts. However, accidentally pulling in a powerful enemy tank (like Kaizer or Zhang Fei) can cause your team to get wiped out, so choose your targets very carefully.",
    "commonMistakes": "Obsessing over hook accuracy and recklessly stepping too far forward only to get killed is a common mistake. Another is hooking the enemy's engager (initiator), causing your own formation to collapse."
  },
  "hero_063": {
    "earlyGame": "In the early game, utilize Skill 1 in the 'Breaking Formation' stance to damage enemies and quickly clear minions. Until you reach level 4 and unlock your ultimate, play safely and avoid forced trades.",
    "midGame": "Roam with your allied jungler and roamer. In small skirmishes, utilize the 'Peace' stance to maintain your team's high HP. The stun on Skill 2 only triggers on the outer edge, so it's crucial to master the spacing.",
    "lateGame": "In the late game, you become the cornerstone of your team's sustain (healing). Continuously heal allies before and after teamfights, and prioritize surviving enemy burst damage using the invincibility of your ultimate.",
    "teamfight": "Deal damage using 'Breaking Formation', and switch to 'Peace' to support your team when their HP drops. Your ultimate is not just for healing; it serves as a self-defense tool to dodge fatal enemy skills, or as a finisher by diving into the enemy formation.",
    "commonMistakes": "Failing to understand the stun range of Skill 2 and getting too close to the enemy, thus missing the stun. Another mistake is using the ultimate too early, resulting in getting killed when it is truly needed."
  },
  "hero_064": {
    "earlyGame": "To maximize your passive, develop the habit of constantly moving and attacking while weaving in and out of bushes. Since you are weak in direct frontal trades early on, safely farm while securing vision with your traps.",
    "midGame": "Your mobility increases significantly once you acquire items. Place traps at key choke points in the river and enemy jungle to control vision, and work with your team to hunt down isolated enemies.",
    "lateGame": "In the late game, you boast incredibly high sustained damage. Since you can attack while moving during your ultimate, always focus on kiting to prevent enemies from closing the gap.",
    "teamfight": "Never stop moving; continuously rain down basic attacks and ultimate arrows while repositioning. If an enemy assassin targets you, use Skill 1 to escape over terrain, or drop a trap at your feet to apply a slow while creating distance.",
    "commonMistakes": "Fighting out in the open without utilizing bushes is a major mistake. Additionally, standing still while attacking with your ultimate wastes your greatest strength—mobility."
  },
  "hero_065": {
    "earlyGame": "Athena possesses very high combat power from the early game. Cast Skill 1 on minions before diving the enemy, and aggressively initiate trades using the true damage and stun (or slow) of Skill 2.",
    "midGame": "Utilize your mobility and damage to push side lanes while invading the enemy jungle to apply pressure. Even if your HP is low, the healing from your ultimate allows you to play aggressively.",
    "lateGame": "In the late game, your role shifts to an assassin, aiming to burst down enemy marksmen or mages by landing Skill 1. Engaging head-on will draw focus fire, so wait for the right moment to strike from the flanks or rear.",
    "teamfight": "Mark the enemy backline carry with Skill 1, dive in, and stun them with Skill 2. When your HP gets low, cast your ultimate so it hits multiple enemies or minions, allowing you to recover massive amounts of HP while fighting through the fray.",
    "commonMistakes": "Recklessly diving even after missing the first phase of Skill 1 is a common error. Also, using Skill 2 while your HP is higher than the enemy's will only apply a slow instead of a stun."
  },
  "hero_066": {
    "earlyGame": "Nuwa's early game damage is modest, so use your skills to clear minions from a safe distance. Once you reach level 4, constantly check the minimap and provide covering fire with your ultimate during engagements in other lanes.",
    "midGame": "Utilize the long-range teleport of Skill 3 to quickly cover allies. Using the blocks (walls) of Skill 2 to cut off enemy escape routes or, conversely, to protect your allies is also a crucial supportive play.",
    "lateGame": "Once you have your items, the combo of Skill 2 explosions and your ultimate deals enough burst damage to instantly delete enemy backliners. Capitalize on the expanded field of view granted by your passive to unilaterally attack from safety.",
    "teamfight": "Place Skill 2 blocks in narrow corridors to divide passing enemies, then fire Skill 1 and your ultimate into them for massive damage. If an enemy assassin approaches, immediately place a block for self-defense.",
    "commonMistakes": "Carelessly teleporting into the center of the enemy formation with Skill 3 and getting focused down. Another mistake is placing Skill 2 walls in your allies' escape path, hindering their retreat."
  },
  "hero_067": {
    "earlyGame": "In the early game, Nezha excels in prolonged brawls due to the true damage (burn effect) of his passive. Use Skill 1 to clear minions while boosting your movement speed to take favorable trades.",
    "midGame": "From level 4 onwards, constantly monitor the minimap. If you spot low-HP or isolated enemies, fly in from anywhere on the map with your ultimate to secure the kill. This is a strong phase for split-pushing.",
    "lateGame": "In the late game, continue to push side lanes. When the enemy responds to your push, use your ultimate to join the teamfight on the opposite side of the map. By building defensive items, you gain the durability to dive deep into the enemy formation without easily falling.",
    "teamfight": "In teamfights, use your ultimate to crash directly into the enemy's most fed marksman or mage. Your role is to disrupt their formation and fight tenaciously so their backline cannot output damage.",
    "commonMistakes": "Diving in with your ultimate when your allies are too far away to follow up, creating a 1v5 situation and dying pointlessly (often called a 'solo dive')."
  }
}

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_8.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for hero_id, hero_data in data.items():
    if "strategy" in hero_data and hero_id in translations:
        for key in ["earlyGame", "midGame", "lateGame", "teamfight", "commonMistakes"]:
            if key in hero_data["strategy"] and key in translations[hero_id]:
                hero_data["strategy"][key] = translations[hero_id][key]

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_8_done.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Translation completed and saved.")
