import json

translations = {
    "hero_068": {
        "earlyGame": "Has high poke (long-range attack) capability from the early game. Accurately grasp the trajectory of Skill 2 and Skill 3, and apply pressure by chipping away at the enemy mid laner's HP over minions.",
        "midGame": "Magic Attack passively increases infinitely with every kill or assist, so actively participate in teamfights to stack it. Do not approach unwarded bushes carelessly, and use skills from a distance to scout.",
        "lateGame": "His burst damage in the late game is top tier among all mages. If you land a clean hit with Ultimate-enhanced skills on the enemy Marksman or Mage, you can deal fatal damage (or instantly kill them) in one shot.",
        "teamfight": "Always position at the very back and snipe the enemy backline over their frontline. If targeted by an Assassin, use Skill 1 to knock back the enemy, gain distance, and then counterattack.",
        "commonMistakes": "Lacking the aiming skill to land hits at the intersection of skills (where damage is highest), resulting in zero damage output. Also, using the self-defense Skill 1 aggressively, and getting immediately killed by an Assassin right after."
    },
    "hero_069": {
        "earlyGame": "Her jungling speed in the early game is very fast. Cycle Skill 1 and Skill 2 smoothly to quickly reach level 4. Utilize the shield to gank while maintaining high HP.",
        "midGame": "Using Skill 2 dash as a starting point, the combo of reducing Skill 2's cooldown with Skill 1 and Ultimate to land consecutive dashes (spear thrusts) is powerful. Relentlessly target the enemy Mage or Marksman.",
        "lateGame": "In late-game teamfights, you can play a role in absorbing enemy attacks and CC by diving right into the middle of the enemy formation and deploying the massive shield of your Ultimate. Since you can move as a spirit after death and freely choose your resurrection point, focus on providing vision for your team.",
        "teamfight": "Focus on the enemy carry, quickly close the distance, and deal burst damage. After being killed, move in the true spirit state (soul) to continuously provide vision of the enemy jungle and key enemy heroes, supporting your allies.",
        "commonMistakes": "Using the Ultimate with bad timing, allowing enemies to easily escape its range. Also, not moving to a safe location upon death, resurrecting right in the middle of the enemy formation, and getting killed again immediately."
    },
    "hero_070": {
        "earlyGame": "Stick close to your allied Marksman from the early game, allowing them to lane safely while recovering HP. Cast Skill 2 (bouncing sound wave) near enemy heroes in the minion wave to harass them with stuns.",
        "midGame": "Always move with multiple allies to increase the overall durability of the team. When enemies are grouped up, Skill 2's stun becomes a very powerful disruption, useful for initiating teamfights.",
        "lateGame": "Her healing power becomes extremely high in the late game, but do not be overconfident as enemies often buy anti-heal items. Make sure to never leave the side of your most important carry (the damage-dealing hero).",
        "teamfight": "At the moment your allies' HP drops rapidly, use Ultimate and Skill 1 simultaneously to forcefully keep them alive. Pay close attention to your own positioning so you are not caught in enemy AoE attacks.",
        "commonMistakes": "Playing too aggressively as if allies are invincible, even when enemies have purchased anti-heal items. Also, using Skill 2 when the enemy is alone, preventing the bounce effect from triggering."
    },
    "hero_073": {
        "earlyGame": "In the early game, focus on farming in the mid lane and consciously use minions to stack your passive. Harass enemies with Skill 1 while participating in ganks or securing river vision in sync with your allied Jungler's movements.",
        "midGame": "In the mid game when core items start coming together, he shows his true value in small skirmishes. Trigger your passive from quick positioning with Skill 2, and aim to reset cooldowns by finishing off low-HP enemies with your Ultimate.",
        "lateGame": "In the late game when enemy items are also complete, stepping forward carelessly carries the risk of being instantly killed. It is important to wait for your allies to engage and participate in the fight only after confirming enemy CC skills have been consumed.",
        "teamfight": "Never initiate by yourself in teamfights; instead, poke with Skill 1 from the backline. When enemy HP is low, dive in with Skill 2 and aim for continuous kills (kill resets) with your Ultimate to instantly break the enemy formation.",
        "commonMistakes": "Diving right into the middle of the enemy formation with Skill 2 immediately after the fight starts. Also, wasting the Ultimate on full-HP enemies or tanks, failing to utilize the kill reset, which is a common mistake for beginners."
    },
    "hero_074": {
        "earlyGame": "In the early game, assist the mid laner or Jungler with their farm, using Skill 1 and Skill 3 to help clear waves while harassing the enemy. Secure vision thoroughly and create an environment where allies can move safely.",
        "midGame": "Move across the entire map in the mid game to support allied ganks and retreats. Placing Skill 2 at the feet of low-HP allies to return them safely can significantly increase the overall survival rate of the team.",
        "lateGame": "Coordinating split pushes using the Ultimate, as well as fights around the Tyrant and Overlord, are key. By instantly gathering allies, you can intentionally create a numerical advantage.",
        "teamfight": "In teamfights, place Skill 2 in a position where allies can easily retreat (slightly backwards), while deploying the Ultimate in a safe location to bring them back to the frontline. Peeling for allies against enemy Assassins with the silence and knock-up from Skills 1 and 3 is also important.",
        "commonMistakes": "Accidentally placing Skill 2 at the feet of allies during combat, unintentionally returning an allied carry to base. Also, deploying the Ultimate right in the middle of enemies or in an unfavorable position, causing the summoned allies to be wiped out."
    },
    "hero_075": {
        "earlyGame": "Due to low mobility and vulnerability to ganks, prioritize safe farming under the tower in the farm lane during the early game. Place Skill 2 mines in bushes to secure vision and anticipate enemy Jungler ambushes.",
        "midGame": "Move together with your Support to contribute to tower sieges and objective securing. Deploy your Ultimate in a safe position that blocks enemy approach routes, applying pressure from a distance.",
        "lateGame": "A fully built Huang Zhong has overwhelming firepower. With proper positioning and protection from allies, his artillery can easily dominate teamfights. Constantly be on alert for the positions of enemy Assassins and Mages.",
        "teamfight": "It is dangerous to deploy your Ultimate as soon as a teamfight begins. First, deal damage with basic attacks, confirm that enemy dive skills or CC have been consumed, and then enter artillery mode in a safe place, such as behind your allied Tank.",
        "commonMistakes": "Deploying the Ultimate to become a stationary turret in an exposed location while enemy Assassins are still alive, making yourself an easy target. Also, not using Skill 2 mines and getting ganked while isolated without vision."
    },
    "hero_076": {
        "earlyGame": "If jungling, quickly aim for level 4. If played in the clash lane, utilize the recovery from Skill 1 to lane tenaciously. Since his passive deals massive damage to isolated enemies, force favorable 1v1 situations.",
        "midGame": "Once core items are completed, he exhibits unmatched strength in 1v1. Split push to draw enemy attention, and if a small skirmish breaks out, activate the Ultimate to instantly eliminate the enemy carry.",
        "lateGame": "Charging head-on into a group of enemies will result in being chain-CC'd and killed. Play like an Assassin, hiding in bushes and waiting for an opportunity to ambush the enemy backline (Marksman or Mage).",
        "teamfight": "Avoid engaging from the front in teamfights; aim to flank from the sides or rear. Once allies initiate combat, activate your Ultimate to dive into the enemy formation, combining Flash and Skill 2 to instantly assassinate the enemy carry.",
        "commonMistakes": "Forcing a fight while the Ultimate is on cooldown. Also, attacking densely grouped enemies where the passive (bonus damage against a single target) cannot be utilized, leading to a lack of damage."
    },
    "hero_077": {
        "earlyGame": "Because he has very strong ganking potential, clear the jungle quickly to reach level 4 and actively intervene in lanes. Hook enemies with Skill 2 and throw them towards your allies to reliably secure kills or assists.",
        "midGame": "The goal is to accumulate kills and widen the advantage. In small skirmishes, the accuracy of your hook decides everything, so aim carefully. Utilize the passive buff gained upon securing a kill to instantly dominate.",
        "lateGame": "As enemies start moving in groups, it becomes difficult to land hooks on isolated targets. Refrain from engaging head-on and shift to a roaming playstyle, waiting for allies to initiate.",
        "teamfight": "Never be the first to charge in during teamfights. Observe the allied engagement from the outside and land Skill 2 on squishy targets in vulnerable positions. Take down at least one person to trigger the \"Frenzy\" passive, then wipe out the remaining enemies in one go.",
        "commonMistakes": "Hooking an enemy Tank with Skill 2 but charging in anyway, only to be counterattacked. Also, after missing the hook, trying to fight using only basic attacks and getting killed due to a lack of mobility and damage."
    },
    "hero_078": {
        "earlyGame": "Utilize the powerful poke from Skill 2's snipe to overwhelm your lane opponent in the farm lane. The basics include placing Skill 1 vision devices in river bushes to proactively prevent enemy Jungler ganks.",
        "midGame": "Place vision devices around objectives (Tyrant and Overlord) or in the enemy jungle to grasp map control. Before fights break out, chip away at enemy HP with Skill 2 so your team can fight with an advantage.",
        "lateGame": "Pay close attention to your positioning as you become a prime target for enemy Assassins. Do not just rely on sniping; utilize basic attacks boosted by your passive to steadily wear down the enemy frontline when they enter your range.",
        "teamfight": "Before a teamfight begins, poke from a distance with snipes. Once the fight starts, switch to basic attacks to deal continuous damage. If enemies get close, use your Ultimate to deal damage while creating distance and kiting them.",
        "commonMistakes": "Continuing to only attempt Skill 2 snipes from afar during teamfights, missing them, and contributing zero damage to the team (not using basic attacks). Not placing Skill 1 vision devices at all, failing to contribute to the team's map control."
    },
    "hero_079": {
        "earlyGame": "In the mid lane, quickly clear minion waves using the Skill 1 and Skill 2 combo, then roam to the side lanes to support allies. Placing go pieces in bushes also secures vision, enabling a safe playstyle.",
        "midGame": "Utilize the massive area of your Ultimate to divide enemies or cut off their retreat routes during contests for the Tyrant or Overlord. Coordinate with allies to trap enemies inside the board and wipe them out.",
        "lateGame": "Despite having high survivability due to his passive's fatal damage immunity (invincibility), he remains a squishy Mage. Poke safely from the backline with go piece combos while waiting for an opportunity to drop a fatal Ultimate.",
        "teamfight": "In teamfights, deploy your Ultimate in sync with allied CC or position it to block enemy escape routes. After deploying the board, repeatedly cast Skill 1 and Skill 2 inside it to continuously deal AoE damage and slows.",
        "commonMistakes": "Panicking and deploying the Ultimate when enemies still have mobility skills or Flash, trapping no one. Overestimating the invincibility of the passive, stepping too far into the enemy formation, and getting CC-chained to death."
    },
    "hero_080": {
        "earlyGame": "A Meng Qi with high \"Mass\" has extremely high defensive stats, allowing for aggressive damage trades in the clash lane while keeping Skill 1's shield up. He boasts top-tier strength in early game brawls.",
        "midGame": "Utilize high stats from Mass to split push or invade the enemy jungle and steal resources. Since your movement speed is slow, it is crucial to use Skill 2 to consume Mass and quickly escape before getting surrounded.",
        "lateGame": "He becomes a frontline bruiser with both high damage and durability. Act as a sub-tank absorbing enemy attacks while looking for an opening to assault the enemy backline (Marksman and Mage) with your Ultimate.",
        "teamfight": "Use your Ultimate (Skill 3) to dive onto the enemy Marksman or Mage, knocking them up and disrupting their formation. Spam Skill 1 in the middle of the enemy team to spread shields and AoE damage, drawing maximum enemy aggro.",
        "commonMistakes": "Using movements and unnecessary skills to deplete Mass to zero, entering combat in his weakest state with neither defense nor attack. Missing the Ultimate, isolating yourself in the enemy formation, and becoming a sitting duck."
    },
    "hero_081": {
        "earlyGame": "She is highly difficult to control and extremely squishy, so prioritize safe farming in the farm lane during the early game. Utilize her high mobility and attack speed when without her umbrella to harass enemies with basic attacks when an opening presents itself.",
        "midGame": "Once core items are assembled, she can output high burst damage. In small skirmishes, frequently change positions using skills, dealing continuous damage while gracefully dodging enemy directional skills and CC.",
        "lateGame": "While her damage is immense, there is always the risk of instant death from a single mistake. Always position near allied Tanks or Supports, keep perfect track of the umbrella's location, and be ready to escape enemy assassinations.",
        "teamfight": "In teamfights, deal damage from the periphery with basic attacks, and if an enemy Assassin approaches, teleport to the umbrella's position using skills to create distance. Using Skill 2 at the right time to erase fatal enemy projectiles is the key to survival.",
        "commonMistakes": "Not keeping track of where you threw the umbrella, teleporting right into the middle of enemies or under a tower, and dying. Pointlessly exhausting all skills and getting caught and killed when no escape methods are left."
    },
    "hero_082": {
        "earlyGame": "Right from the start of the match, connect Skill 1 to your team's most powerful carry (Jungler or Marksman). The attack and movement speed buffs from the link will boost your ally's farming speed and gank success rate.",
        "midGame": "Always stick with a fed ally to create 2v1 or 3v2 situations and wreak havoc on the map. When attacked by enemies, switch to the defense buff with Skill 2 depending on the situation, prioritizing your ally's survival.",
        "lateGame": "Since enemy firepower scales up, Ming himself will be instantly killed if he steps forward. Stick tightly behind your allied carry, maintaining the link at all times while waiting for the right moment to provide massive healing with the Ultimate.",
        "teamfight": "Positioning is everything in teamfights. Stay slightly behind your allied carry to avoid getting caught in enemy AoE attacks. The moment your ally's HP drops to a dangerous level, activate your Ultimate to provide a clutch heal.",
        "commonMistakes": "Losing track of your linked target in a teamfight and accidentally buffing the Tank or yourself. Delaying the Ultimate heal and letting your allied carry die. Stepping too far forward and being the first to die."
    },
    "hero_083": {
        "earlyGame": "Because he can use both human and tiger forms from level 1, his early game combat power is top-tier among Junglers. Coordinate with allies to aggressively invade the enemy jungle, steal buffs, and apply immense pressure right from the start.",
        "midGame": "Utilize your high mobility to dash across the map, repeatedly ganking and securing objectives like the Tyrant, focusing all your efforts on widening the gold gap. The human form's ranged attacks are useful when taking down towers.",
        "lateGame": "Compared to other pure carry heroes, his late-game damage scaling falls off. Avoid head-on brawls; poke in human form, and play as a true Assassin by using the tiger form to reliably execute isolated or low-HP enemies.",
        "teamfight": "When a teamfight begins, first chip away at the enemy frontline's HP from a safe distance using human form Skill 1 and basic attacks. Do not miss the opportunity when enemy CC is consumed and their backline's HP is low; switch to tiger form and dive in for kills.",
        "commonMistakes": "Charging directly into the enemy formation in tiger form right as the teamfight starts, taking concentrated fire, and dying instantly. Failing to create an advantage in the early game, merely farming, and losing presence from the mid game onwards."
    },
    "hero_084": {
        "earlyGame": "A fully energized Biron is extremely powerful. Take control of the clash lane by attacking minions to build energy and landing the enhanced Skill 1 to simultaneously deal damage and heal.",
        "midGame": "Utilize your high sustain to push the lane while invading the enemy jungle or roaming to the mid lane. In small skirmishes, use the knock-up CC from your enhanced Skill 2 to set up kills.",
        "lateGame": "Function as a frontline bruiser who exerts massive pressure on enemy carries. Since energy management decides victories, it is mandatory to attack nearby monsters or minions to secure energy before entering combat.",
        "teamfight": "Starting with 30 or more energy, combine Flash and enhanced Skill 2 to dash onto the enemy backline and instantly apply CC. Immediately after, deploy your Ultimate to gain a massive shield, running rampant in the enemy formation while healing with Skill 1.",
        "commonMistakes": "Diving into a teamfight with zero energy, meaning skills are not enhanced and you get killed due to a lack of damage, CC, and healing. Trying to approach the backline without Flash and getting kited endlessly from afar."
    },
    "hero_085": {
        "earlyGame": "In the early game, stay beside your allied Marksman, helping them clear minions while safely securing vision. Since she is extremely fragile until level 4, avoid forced engagements.",
        "midGame": "After unlocking the Ultimate, possess the most fed carry on your team (Jungler or Marksman) and move around the map. It is crucial to use Skill 1 to check bushes for vision and prevent ambushes.",
        "lateGame": "The shield amount in the late game becomes very large, but since enemy firepower is also high, mastering the technique of manually ending the possession before the shield breaks to reduce the cooldown is essential.",
        "teamfight": "In teamfights, intentionally taking an enemy's fatal CC skill to trigger the passive deer form and bait out their skills is a powerful tactic. Quickly return to human form afterward and possess an ally again to provide shields.",
        "commonMistakes": "A common beginner mistake is \"parasitic play\" where you possess an ally and do nothing. You must not just wait for the shield to break; you need to dismount at the right time to manage the cooldown, and actively poke with basic attacks and skills."
    },
    "hero_086": {
        "earlyGame": "Utilize his flight ability, which ignores terrain, to invade the enemy jungle and steal resources from the early game, or set up ganks from unpredictable routes to create an advantage.",
        "midGame": "Use your mobility to traverse the entire map and actively hunt down isolated enemy Marksmen or Mages. In small skirmishes, you can use the invincibility frames of the Ultimate to execute tower dives.",
        "lateGame": "In the late game when enemies group up, charging head-on will result in instant death. Wait for an allied Tank to initiate and for enemy CC to be consumed before diving onto the backline.",
        "teamfight": "Your role in teamfights is strictly \"assassinating the backline\" and \"cleaning up after the fight.\" Managing your energy to maintain flight during combat is vital; if the gauge is about to deplete, you need the composure to briefly disengage and recover.",
        "commonMistakes": "Neglecting energy management for the flight state and reverting to walking right in front of enemies is fatal. Also, being the very first to dive into a teamfight and taking concentrated fire is a common NG move for beginners."
    },
    "hero_087": {
        "earlyGame": "He cannot change forms until level 4 and is extremely weak, so endure by safely clearing minions under the tower. Avoid enemy harass while reliably securing experience and gold.",
        "midGame": "Switch between Light form and Dark form depending on the situation. Dark form excels in split pushing and 1v1s, while Light form excels in poking and teamfight damage. Determine which form to main based on team compositions and the flow of the match.",
        "lateGame": "If in Dark form, thoroughly split push side lanes to draw enemy attention; if in Light form, continuously output overwhelming AoE damage with skills from behind your allies. Careful positioning is required, as a mistake in placement leads to immediate death.",
        "teamfight": "In Light form teamfights, utilize the super armor and damage reduction while charging skills, and drop your Ultimate and Skill 2 into enemy clusters. If participating in teamfights in Dark form, you must play like an Assassin, targeting squishy enemies from the flanks or rear.",
        "commonMistakes": "Misunderstanding the characteristics of the forms, such as charging head-on into a teamfight in Dark form or isolating yourself to 1v1 in Light form. Also, since form changing takes time, avoid switching in a vulnerable state during combat."
    },
    "hero_088": {
        "earlyGame": "Because her early game damage is modest and she lacks mobility, do not stray far from the tower and farm safely. Utilize the range of Skill 1 to last-hit minions from a position where enemies cannot counterattack.",
        "midGame": "Once core items are assembled, her damage spikes. Always stick with allied Supports and Tanks, poking from a safe backline to create advantages during objective contests (Tyrant and Overlord).",
        "lateGame": "A full-build Garo has overwhelming firepower and range. You can unilaterally attack from outside the enemy's range, melting even shielded enemy Tanks in an instant. Never approach unwarded areas of the map alone.",
        "teamfight": "Positioning in teamfights is everything. Since she has no self-defense skills, always stay at the very back of your team. Deploy the Ultimate's magic circle to boost your critical rate, and take down enemies in your line of sight one by one.",
        "commonMistakes": "Continuing to use basic attacks with Skill 1 active and completely depleting mana is a common beginner mistake. Also, stepping too far forward without checking the minimap for enemy Assassins will result in them instantly closing the gap and killing you."
    }
}

with open("c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_9.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for hero_id, new_strategy in translations.items():
    if hero_id in data and "strategy" in data[hero_id]:
        for key in ["earlyGame", "midGame", "lateGame", "teamfight", "commonMistakes"]:
            if key in new_strategy and key in data[hero_id]["strategy"]:
                data[hero_id]["strategy"][key] = new_strategy[key]

with open("c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_9_done.json", "w", encoding="utf-8") as out:
    json.dump(data, out, ensure_ascii=False, indent=2)
