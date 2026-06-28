import json

translations = {
  "hero_005": {
    "earlyGame": "Early Game Strategy: Summon mechanical minions (robots) in the Mid Lane to push the lane hard, forcing enemies under their tower. When the enemy roams away, quickly use your minions to wear down the tower's HP.",
    "midGame": "Mid Game Strategy: Keep control of your lane while assisting sidelanes in taking down towers. Robots can be used to grant vision or block enemy skills, so always deploy them to keep up the pressure.",
    "lateGame": "Late Game Strategy: Rather than teamfights, finding opportunities for split pushing (destroying towers alone) is extremely powerful. However, since you are easily targeted by Assassins when isolated, carefully track enemy positions on the minimap.",
    "teamfight": "Teamfight Strategy: Deploy multiple robots to scatter enemy aggro while hitting the enemy carry or diving Assassins with your Ultimate to stun them. Maintain a safe position from the backline.",
    "commonMistakes": "Common Beginner Mistakes: Pushing the lane too deep alone and getting caught despite having low mobility and only your Ultimate for self-defense. Neglecting robot management, resulting in low damage when needed."
  },
  "hero_006": {
    "earlyGame": "Early Game Strategy: In the Farm Lane, utilize your passive's enhanced basic attack (Piercing Arrow) to simultaneously clear minions and harass the enemy. Take advantage of your long range to farm safely.",
    "midGame": "Mid Game Strategy: Once you start getting your core items, utilize Skill 2's movement and damage boost to engage in highly mobile skirmishes. Coordinate with your Roamer to roam the map and provide sustained damage during objective fights.",
    "lateGame": "Late Game Strategy: Serve as your team's main source of damage. Manage your 'Flow' stacks, and use Skill 3's (Ultimate) movement speed buff and rapid fire to continuously deal damage without letting enemies close the gap (kiting).",
    "teamfight": "Teamfight Strategy: Always position yourself behind your allies and attack enemies from front to back. If enemy Assassins approach, use Skill 1's knockback or Skill 2's movement to create distance, making fine adjustments to your positioning as you fight.",
    "commonMistakes": "Common Beginner Mistakes: Dashing towards the enemy team with Skill 2, putting yourself in a dangerous position. Ignoring your 'Flow' stacks and missing the timing for your enhanced basic attacks."
  },
  "hero_007": {
    "earlyGame": "Early Game Strategy: Since you are very squishy, farm safely in the Farm Lane under your tower or near your Roamer. Activating Skill 1 extends your range but consumes a lot of mana, so only use it for harassing and securing last hits.",
    "midGame": "Mid Game Strategy: Avoid forcing fights until your core items (especially critical strike items) are complete. Rack up assists from behind your allies utilizing your long range, and gather gold to prepare for the late game.",
    "lateGame": "Late Game Strategy: Your ultra-long range and high critical damage make you a huge threat to enemies. You can unilaterally attack from outside the enemy's range, and utilize your passive's shield damage bonus to quickly melt down enemy Tanks.",
    "teamfight": "Teamfight Strategy: Stay at the very back of your team, toggle on Skill 1, and continuously unleash basic attacks. If targeted by an enemy Assassin, cast and immediately cancel your Ultimate to boost your movement speed and kite away.",
    "commonMistakes": "Common Beginner Mistakes: Leaving Skill 1 constantly toggled on and depleting your mana. Also, pushing a lane alone when enemy Assassins are missing on the map, as you lack self-defense skills."
  },
  "hero_008": {
    "earlyGame": "Early Game Strategy: Use Skill 1 in the Mid Lane to quickly clear minions. Since your damage is low in the early game, don't force kills; instead, focus on roaming to the sidelanes to assist your allies in getting kills.",
    "midGame": "Mid Game Strategy: Once you get your core items, you can one-shot squishy enemies (Mages and Marksmen) with a single combo. Hide in the brush to ambush enemies, aiming for the Skill 2 (Stun) -> Ultimate -> Skill 1 combo.",
    "lateGame": "Late Game Strategy: Your one-shot combo damage becomes devastating, allowing you to instantly burst down enemy carries. In teamfights, instead of fighting front-to-back, play like an Assassin by flanking or ambushing the enemy backline from the brush.",
    "teamfight": "Teamfight Strategy: Be careful not to waste your skills on enemy Tanks, and wait until the enemy Marksman or Mage is within range. After unloading all your skills, temporarily retreat to a safe position until your cooldowns refresh.",
    "commonMistakes": "Common Beginner Mistakes: Casting your Ultimate when its fox fires will split among multiple enemies and minions, failing to burst down a single target. Walking straight up to enemies openly and getting killed before you can land your combo."
  },
  "hero_009": {
    "earlyGame": "Early Game Strategy: As you are extremely squishy and lack escape skills, focus entirely on safely farming minions from under your tower. Use your passive's sweeping fire (a technique where you basic attack the air to build stacks) to safely harass enemies from out of range.",
    "midGame": "Mid Game Strategy: Your damage spikes once your core items are completed. Always stick with your Roamer or Tank and avoid being isolated. Use Skill 2's rocket to secure map vision or to finish off low-HP enemies escaping far away.",
    "lateGame": "Late Game Strategy: Thanks to your passive's max HP percentage damage, you become an overwhelming source of damage capable of melting even the tankiest enemies in seconds. It is crucial to constantly track enemy Assassins on the minimap and never leave your allies' protection.",
    "teamfight": "Teamfight Strategy: Position yourself at the very back of the team and continuously unleash your passive sweeping fire after casting skills. If an enemy Assassin closes in, use Skill 2's knockback to create distance, and prioritize surviving by using Flash.",
    "commonMistakes": "Common Beginner Mistakes: Pressing the movement key during your passive's sweeping fire and canceling the attack animation. Farming alone defenselessly without map vision of the enemy."
  },
  "hero_010": {
    "earlyGame": "Early Game Strategy: Use Skill 1 and Skill 2 to quickly clear minions in the Mid Lane, and look for ganks in the sidelanes (especially the Clash Lane). Hiding in the brush to ambush enemies is an extremely powerful move.",
    "midGame": "Mid Game Strategy: Target isolated enemies and rack up kills with the full combo: Skill 2 (Stun) -> Skill 1 -> Ultimate. If you suspect enemies are hiding in areas without vision, cast Skill 1 into the brush to check for safety.",
    "lateGame": "Late Game Strategy: You possess the damage to nearly one-shot even an enemy Tank with a single combo, but you are a stationary target during your Ultimate. You must wait patiently for enemies to use their crowd control (CC) skills before casting your Ultimate.",
    "teamfight": "Teamfight Strategy: Always position yourself slightly behind your Tanks, and unleash your full combo when enemies are grouped up or the moment your allies land a strong CC. Deciding whether to save Skill 2 for self-defense or use it offensively is crucial.",
    "commonMistakes": "Common Beginner Mistakes: Failing to cancel (tap again) your Ultimate when the enemy escapes its range, leaving yourself a stationary and defenseless target. Forcing your Ultimate after missing Skill 2, resulting in insufficient damage."
  },
  "hero_011": {
    "earlyGame": "Early Game Strategy: In the Mid Lane, use your Skill 1's fan to simultaneously clear minions and harass enemy heroes. Since your mobility is low, watch out for enemy Jungler ganks and avoid stepping up when there is no vision in the river.",
    "midGame": "Mid Game Strategy: Once you get your items, your Skill 1 damage spikes. Group up with allies for teamfights and objective fights, consistently poking from a safe distance. Utilize your passive's movement speed boost to step up for a skill cast and immediately back off.",
    "lateGame": "Late Game Strategy: You gain the damage to one-shot the enemy backline. Ideally, poke down the enemy team's HP with Skill 1 before a teamfight, then follow up your allies' engage with your Skill 2 knockup, finishing them off with your Ultimate.",
    "teamfight": "Teamfight Strategy: Spam Skill 1 from the backline, and if an enemy Assassin approaches, place Skill 2 at your feet for self-defense. Your Ultimate has a wide range and boosts your movement speed upon hit, making it effective for both chasing and escaping.",
    "commonMistakes": "Common Beginner Mistakes: Wasting your Skill 2 knockup, only to be jumped on by an Assassin while it is on cooldown and getting killed without being able to react. Rushing headfirst into the enemy team to deal damage with your Ultimate."
  },
  "hero_012": {
    "earlyGame": "Early Game Strategy: Play as the Jungler and quickly clear your jungle camps to reach Level 4. Once you unlock your Ultimate, your ganks become highly effective, so ambush lanes where enemies are overextended.",
    "midGame": "Mid Game Strategy: Utilize your mobility to roam the map and force skirmishes to secure kills. Hit the enemy carries (Mages and Marksmen) with your Ultimate's knockup followed by the Skill 2 -> Skill 1 combo to control the pace of the game.",
    "lateGame": "Late Game Strategy: Thanks to your passive (damage reduction as your HP decreases), you can fight tenaciously like a Fighter despite being an Assassin. In teamfights, don't engage front-to-back; look to dive the enemy backline directly from the flanking brush.",
    "teamfight": "Teamfight Strategy: Dive the enemy backline with your Ultimate right after your Tank engages or when the enemy's CC skills are on cooldown. Trust your passive and fight to the limit, using Skill 1 to dash over walls and retreat if you're in danger.",
    "commonMistakes": "Common Beginner Mistakes: Randomly casting your Ultimate without predicting the landing spot, missing completely, and ending up isolated in the enemy team without dealing damage or CC. Overestimating your passive at full HP and recklessly initiating a 1vX fight."
  },
  "hero_013": {
    "earlyGame": "Early Game Strategy: Play as the Mid Laner or Roamer. Use your Skill 2's long-range stun to safely clear minions while harassing the enemy. Pay attention to your mana management, as your skills consume a lot of mana.",
    "midGame": "Mid Game Strategy: As you complete your items, Skill 2's damage and cooldown become excellent. Stick with your Jungler or Roamer, and create kill opportunities by landing stuns from the brush where enemies have no vision.",
    "lateGame": "Late Game Strategy: Relentlessly poke the enemy carries (main damage dealers) and focus entirely on whittling down the enemy team's HP before teamfights. Be mindful of firing from the backline and avoid stepping up too far carelessly.",
    "teamfight": "Teamfight Strategy: Poke enemies down with Skill 2, and when your team engages or enemy Fighters/Assassins dive in, use your Ultimate's wide-area stun to lock them down, protecting your allies and turning the tide of battle.",
    "commonMistakes": "Common Beginner Mistakes: Recklessly diving into the enemy team to force your Ultimate, only to get focused and bursted down instantly. Mozi's Ultimate is much more reliable when used for self-defense or counter-engaging."
  },
  "hero_014": {
    "earlyGame": "Early Game Strategy: Cooperate with your Support in the Farm Lane, prioritizing safe last-hitting on minions. Since your damage is low early on, use your Skill 1 roll to dodge enemy attacks while prioritizing safe farming from a distance.",
    "midGame": "Mid Game Strategy: Your damage spikes drastically once 1 or 2 core items are completed. Group with your team to siege towers or contest objectives like the Tyrant, using Skill 2 to reduce enemy physical defense before dealing damage.",
    "lateGame": "Late Game Strategy: You become the strongest carry with overwhelming burst damage. Always position yourself behind your Tanks or Supports, making sure not to get isolated. Maintain vision and melt the enemies front-to-back.",
    "teamfight": "Teamfight Strategy: Use Skill 1 to dodge enemy skills while strictly kiting backwards. Be cautious of approaching enemy Assassins and Fighters, and continuously dish out damage with your basic attacks and skills from a safe distance.",
    "commonMistakes": "Common Beginner Mistakes: Rolling forward with Skill 1 into the enemy team and jumping directly into their attack range, resulting in death. Rolling sideways or backwards to maintain a safe distance is the golden rule."
  },
  "hero_015": {
    "earlyGame": "Early Game Strategy: As a Roamer, support your Mid Laner and Jungler by securing vision. Use Skill 2 to annoy enemies while aggressively checking bushes to ensure your team can farm safely.",
    "midGame": "Mid Game Strategy: Utilize your mobility to roam the entire map and cover areas where your allies might get ganked. It's crucial to have the macro awareness to track enemy CC (crowd control) skills and predict when your allies will be targeted.",
    "lateGame": "Late Game Strategy: Constantly watch out for enemies with strong CC skills. Your primary role is to stick to your Marksman or Mage and maintain an environment where they can freely deal damage.",
    "teamfight": "Teamfight Strategy: Absorb enemy attacks and aggro on the frontline. The moment the enemy uses strong AoE CC (like stuns or knockups), cast your Ultimate to cleanse your entire team and create an opportunity to counterattack.",
    "commonMistakes": "Common Beginner Mistakes: Panicking and casting your Ultimate when allies aren't CC'd or the CC isn't lethal, leaving your team defenseless against the enemy's truly dangerous CC."
  },
  "hero_016": {
    "earlyGame": "Early Game Strategy: Capitalize on the strong CC from Skill 1 and Skill 2 to aggressively invade the enemy jungle with your Jungler/Mid, or look for kills in lane. Make aggressive plays early on to expand your advantage.",
    "midGame": "Mid Game Strategy: Don't miss opportunities when your lane has a numbers advantage or the enemy recalls. Use your passive's tower interference ability to force tower dives, destroying towers and seizing map control.",
    "lateGame": "Late Game Strategy: Shift your role to peeling (protecting) your team's carries from enemy Assassins. Avoid unnecessary isolation, stick with your team, and reliably catch out any enemies who overstep with your skill combos.",
    "teamfight": "Teamfight Strategy: Stick to your carries and neutralize any diving enemies by landing your Skill 1 knockup and Skill 2 stun. When ahead, position yourself to block enemy escape routes, and during sieges, disable the tower to assist your allies in diving.",
    "commonMistakes": "Common Beginner Mistakes: Charging into the enemy team alone without your allies backing you up, only to get killed. Also, obsessing too much over destroying towers and failing to participate in teamfights."
  },
  "hero_017": {
    "earlyGame": "Early Game Strategy: Use Skill 1 in the Mid Lane to safely clear minions. Your combat power and range are low in the early game, so focus on dodging enemy poke and farming safely until Level 4 without forcing fights.",
    "midGame": "Mid Game Strategy: You truly shine in skirmishes once you unlock your Ultimate and build Spell Vamp items. Roam to the sidelanes with your Jungler to gank, using your Ultimate to secure kills and build an advantage.",
    "lateGame": "Late Game Strategy: Your destructive power in teamfights peaks. Charging in head-on will get you focus-fired, so wait for your Tank to bait out the enemy's key CC (crowd control) skills, or look for an opening from the enemy's blind spot to engage.",
    "teamfight": "Teamfight Strategy: Utilize Summoner Spells like Flash to dive directly into the center of the enemy backline (Marksmen and Mages). Cast your Ultimate and wreak havoc in the enemy formation, wiping them out with overwhelming AoE damage and self-healing.",
    "commonMistakes": "Common Beginner Mistakes: Diving into the enemy team all alone before your allies engage, getting chain CC'd, and dying instantly before you can utilize your Ultimate's healing."
  },
  "hero_018": {
    "earlyGame": "Early Game Strategy: Play as the Jungler and safely clear both sides of your jungle to hit Level 4 as fast as possible. You are very squishy early on, so if the enemy invades your jungle, wait for allies to rotate or prioritize safe farming.",
    "midGame": "Mid Game Strategy: Use your Ultimate's stealth to gank the lanes. Always attack enemies from behind to trigger guaranteed critical strikes, securing kills and aiming to snowball the game.",
    "lateGame": "Late Game Strategy: As enemies start to group up, it becomes harder to find isolated targets. Hide in the brush out of enemy vision and wait patiently for the perfect moment when the teamfight breaks out.",
    "teamfight": "Teamfight Strategy: Never be the one to initiate a fight. Wait until your allies engage, enemy CC and defensive skills are blown, and low-HP targets appear. Then, sneak up to their backline using stealth and aim for a kill streak (cooldown resets).",
    "commonMistakes": "Common Beginner Mistakes: Charging at enemies head-on or diving into a group of full-HP enemies alone. You won't benefit from the backstab damage bonus and will quickly be killed in return."
  },
  "hero_019": {
    "earlyGame": "Early Game Strategy: In the Clash Lane, leverage your high base damage to aggressively trade with your opponent. Landing the center of your Skill 2 deals massive damage, making it easy to seize lane priority.",
    "midGame": "Mid Game Strategy: After pushing your lane, actively secure vision in the jungle or roam to the Mid Lane to participate in skirmishes. Hide in the brush and launch surprise skill combos to secure kills.",
    "lateGame": "Late Game Strategy: Enemy durability and mobility increase, making solo kills difficult. Shift your mindset to acting as a secondary tank, protecting your carries or checking the enemy carries, and coordinate closely with your team.",
    "teamfight": "Teamfight Strategy: Move to split the enemy frontline and backline, or use Flash to dive straight into the enemy backline. Spin your Ultimate to scatter your petrification passive over a wide area, creating a favorable battlefield for your allies.",
    "commonMistakes": "Common Beginner Mistakes: Missing Skill 2 because of its long cast animation by failing to predict enemy movement. Also, recklessly diving in the late game with a full damage build and getting killed before the petrification triggers."
  },
  "hero_020": {
    "earlyGame": "Early Game Strategy: As a Roamer, help your Mid Laner clear minions and secure map vision. Harass enemies by throwing Skill 1 while safely supporting your Jungler's farming and ganks.",
    "midGame": "Mid Game Strategy: Always stick with your allies and utilize your Skill 2's movement speed boost and HP recovery to turn skirmishes in your favor. Make quick decisions on whether to engage or retreat to control your team's pacing.",
    "lateGame": "Late Game Strategy: Once you complete cooldown reduction items, you can spam Skill 2 frequently. Constantly boost your team's mobility to prevent enemies from catching out isolated allies, and organize your formation for map objective fights.",
    "teamfight": "Teamfight Strategy: Use Skill 2 to accelerate your entire team into favorable positions. The moment enemies try to use their key skills, deploy your Ultimate to inflict an AoE silence. Interrupt their combos and set up the counterattack for your team.",
    "commonMistakes": "Common Beginner Mistakes: Wasting Skill 2 merely for getting around, only for it to be on cooldown when actual burst damage comes in, leaving you unable to protect your allies. Using it right before taking damage is the most critical point."
  },
  "hero_021": {
    "earlyGame": "Early Game Strategy: In the Mid Lane, weave basic attacks and skills to stack poison on enemies while winning damage trades. Your healing skills grant you high sustain during early laning, allowing you to aggressively push the minion wave.",
    "midGame": "Mid Game Strategy: Group up with your allies, using Skill 2 and basic attacks to stack poison on enemies and healing stacks on your team. In skirmishes, your sustained healing and damage make you stronger the longer the fight drags on.",
    "lateGame": "Late Game Strategy: Enemy burst damage becomes very high, so positioning requires extreme caution. Position yourself behind your frontline, maintaining healing stacks on your team while continuing to spread poison from a safe distance.",
    "teamfight": "Teamfight Strategy: Position yourself to hit both allies and enemies with your skills to build up as many stacks (max 5) as possible. Trigger your Ultimate when stacks are maxed out or when your allies' HP is critically low for a massive burst of healing and damage.",
    "commonMistakes": "Common Beginner Mistakes: Getting so focused on stacking poison that you step too far forward due to your short range, becoming isolated and burst down before you can cast your Ultimate."
  },
  "hero_022": {
    "earlyGame": "Early Game Strategy: Farm steadily in the Clash Lane. Utilize your Skill 1's AoE damage and healing to clear minions, avoid forced fights, and prioritize farming gold and experience to rush Level 4.",
    "midGame": "Mid Game Strategy: Once you start completing defensive items, you gain overwhelming durability. Group up with your team and use your Ultimate's taunt to catch enemies, leading your team to secure kills, tower sieges, and Tyrants.",
    "lateGame": "Late Game Strategy: Stand at the very frontline of your team as the primary initiator. Always keep track of the enemy backline's (Marksmen and Mages) positions, and maintain a position where you can dive them the moment they show an opening.",
    "teamfight": "Teamfight Strategy: When the enemy carries are clumped up or your Assassins are ready to follow up, combine Flash with your Ultimate to dive in and taunt a large group of enemies to neutralize them. Wreak havoc in the enemy formation while healing with Skill 1.",
    "commonMistakes": "Common Beginner Mistakes: Initiating with your Ultimate alone when your allies are not following up or are too far away, successfully taunting the enemy but dying uselessly because no one can follow up with damage."
  },
  "hero_023": {
    "earlyGame": "Early Game Strategy: In the Clash Lane or Jungle, hit enemies or minions with your Skill 2 link to steal their stats, and seize lane priority with your overwhelming dueling power. Maintain your passive ravens and trade aggressively.",
    "midGame": "Mid Game Strategy: Capitalize on your strong 1v1 potential by relentlessly split pushing (pushing sidelanes solo). Invade the enemy jungle and draw the attention of multiple enemies to create advantageous situations for your team on the opposite side of the map.",
    "lateGame": "Late Game Strategy: Instead of joining teamfights, continue to apply relentless pressure on the sidelanes. If enemies come to defend, use your Ultimate's invincibility to escape safely, draining their time and disrupting their formation.",
    "teamfight": "Teamfight Strategy: If you must participate in a teamfight, do not engage from the front; flank from the side or behind. Connect your Skill 2 to the enemy carry to reduce their damage, and if focused, instantly use your Ultimate to drop aggro and survive tenaciously.",
    "commonMistakes": "Common Beginner Mistakes: Playing aggressively while your Skill 2 (chain) misses, resulting in a lack of both healing and damage, and getting killed in return. The golden rule is to back off obediently if Skill 2 misses."
  },
  "hero_024": {
    "earlyGame": "Early Game Strategy: In the Clash Lane, land your Skill 1 on the enemy to maintain your enchanted state while prioritizing safe farming. You are very squishy early on, so be wary of ganks and safely clear minions under your tower without forcing fights.",
    "midGame": "Mid Game Strategy: Once your core items (defense or attack items) are completed, you become a force in skirmishes. Group with your team, use your Ultimate to engage, and leverage your true damage to overwhelm the enemy frontline.",
    "lateGame": "Late Game Strategy: As a top-tier Fighter, you apply immense pressure on the entire enemy team. Stay behind your frontline and dominate the battlefield by engaging when the enemy initiates or when their carries are clumped together.",
    "teamfight": "Teamfight Strategy: Do not dive blindly. Follow up on your team's CC by diving the enemy backline with your Ultimate, or land it to split the enemy formation. Hit multiple enemies with Skill 1 to sweep through them while sustaining yourself with true damage and healing.",
    "commonMistakes": "Common Beginner Mistakes: Continuing to trade basic attacks when your enchanted state (weapon buff) has expired and you've missed Skill 1. Lu Bu's damage is low without his enchant, so you must keep your distance until your Skill 1 hits."
  },
  "hero_025": {
    "earlyGame": "Early Game Strategy: Your strength lies in fast wave clear by combining Skill 2's fire and Skill 1's wind. Since it's easy to gain Mid Lane priority, push the wave and then actively coordinate with your Jungler and Roamer to gank sidelanes or secure jungle vision.",
    "midGame": "Mid Game Strategy: You exhibit unmatched strength in tower sieges and defenses. Spread fire under the enemy tower to apply pressure and whittle down the tower from a safe position. In skirmishes around the Tyrant or Overlord, cover narrow chokepoints with fire to effectively block enemy entry.",
    "lateGame": "Late Game Strategy: You play the role of controlling the teamfight formation. Spread fire in terrain where enemies tend to clump up, restricting their movement while dealing continuous damage. Since your durability is low, always cast your skills from behind your allies and be mindful of your positioning to guard against Assassin ambushes.",
    "teamfight": "Teamfight Strategy: First, place fire with Skill 2, then use Skill 1 to spread the fire toward the enemy team. The ideal combo is to hit enemies standing on the fire with Skill 3 (Ultimate) to stun them. Rather than forcing kills, focus on spreading fire over a wide area to divide the enemy team and create a favorable 'zone' for your allies to fight.",
    "commonMistakes": "Common Beginner Mistakes: Beginners often cast Skill 1's wind in a random direction, failing to spread the fire where they want it. Since you can specify the wind's direction, practice spreading fire accurately toward enemy escape routes or towers. Also, be careful not to step too far forward and get easily killed by enemy Assassins due to poor positioning."
  }
}

input_file = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_6.json"
output_file = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_6_done.json"

with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

for hero_id, hero_data in data.items():
    if hero_id in translations and 'strategy' in hero_data:
        hero_data['strategy'].update(translations[hero_id])

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done")
