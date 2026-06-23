import json
import codecs

with codecs.open('c:/Users/81901/Desktop/オナーオブキングスサイト/chunk_5.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

roles_map = {
    "マークスマン": "Marksman",
    "ファイター/タンク": "Fighter/Tank",
    "タンク/ファイター": "Tank/Fighter",
    "アサシン/メイジ": "Assassin/Mage",
    "ファイター": "Fighter",
    "メイジ": "Mage",
    "ファイター/メイジ": "Fighter/Mage",
    "タンク/メイジ": "Tank/Mage",
    "アサシン": "Assassin"
}

diff_map = {"イージー": "Easy", "ノーマル": "Normal", "ハード": "Hard", "ベリーハード": "Very Hard"}

generic_map = {
    "ダメージ": "Damage",
    "移動速度減少": "Slow",
    "ピュリファイ": "Purify",
    "CC": "CC",
    "ウィークネス": "Weakness",
    "移動": "Mobility",
    "回復": "Recovery",
    "不屈": "Indomitable",
    "強化": "Enhance",
    "被ダメージ軽減": "Damage Reduction",
    "束縛": "Bind",
    "CD短縮": "CD Reduction",
    "移動速度増加": "Speed Up",
    "シールド": "Shield",
    "ワープ": "Teleport",
    "スーパーアーマー": "Super Armor",
    "視界": "Vision",
    "クールダウン": "Cooldown",
    "閃現": "Flash",
    "弱化": "Weaken",
    "懲撃": "Smite",
    "疾跑": "Sprint",
    "浄化": "Purify"
}

label_map = {
    "クールダウン": "Cooldown",
    "基本ダメージ": "Base Damage",
    "移動速度減少": "Movement Speed Reduction",
    "赤令牌ダメージ": "Red Token Damage",
    "スタック間隔": "Stack Interval",
    "HP回復": "HP Recovery",
    "物理・魔法防御": "Physical/Magical Defense",
    "回復増加": "Recovery Increase",
    "初回ダメージ": "Initial Damage",
    "幽影の力上限": "Shadow Power Limit",
    "移動速度": "Movement Speed",
    "ノックバックダメージ": "Knockback Damage",
    "薙ぎ払いダメージ": "Sweep Damage",
    "突撃ダメージ": "Charge Damage",
    "移動速度増加": "Movement Speed Increase",
    "被ダメージ軽減": "Damage Reduction",
    "持続時間": "Duration",
    "確定ダメージ": "True Damage",
    "攻撃速度増加": "Attack Speed Increase",
    "防御力減少": "Defense Reduction",
    "最大ダメージ": "Max Damage",
    "シールド増加": "Shield Increase",
    "チャージダメージ": "Charge Damage",
    "追加ダメージ": "Additional Damage",
    "基本シールド": "Base Shield",
    "破壊ダメージ": "Destruction Damage",
    "氷柱ダメージ": "Icicle Damage",
    "攻撃速度減少": "Attack Speed Reduction"
}

def translate_tags(tags):
    return [generic_map.get(t, t) for t in tags]

def translate_table(table):
    if not table: return table
    for row in table.get('rows', []):
        row['label'] = label_map.get(row['label'], row['label'])
    return table

def translate_status(st):
    reps = {
        "見習い": "Apprentice ",
        "最大HP": "Max HP",
        "最大MP": "Max MP",
        "物理攻撃": "Physical Attack",
        "魔法攻撃": "Magical Attack",
        "物理防御": "Physical Defense",
        "魔法防御": "Magical Defense",
        "移動速度": "Movement Speed",
        "物理防御貫通": "Physical Pierce",
        "魔法防御貫通": "Magical Pierce",
        "攻撃速度ボーナス": "Attack Speed Bonus",
        "クリティカル率": "Critical Rate",
        "クリティカル効果": "Critical Damage",
        "物理ライフスティール": "Physical Lifesteal",
        "魔法ライフスティール": "Magical Lifesteal",
        "クールダウン短縮": "Cooldown Reduction",
        "攻撃範囲": "Attack Range",
        "遠距離": "Ranged",
        "近距離": "Melee",
        "耐性": "Resistance",
        "5秒ごとのHP回復": "HP Regen/5s",
        "5秒ごとのMP回復": "MP Regen/5s",
        "難易度：": "Difficulty: "
    }
    for k, v in roles_map.items():
        reps[k] = v
    for k, v in diff_map.items():
        reps[k] = v
    
    # Needs to replace from longest to shortest if there's overlap, but standard dict iteration is fine here
    for k, v in reps.items():
        st = st.replace(k, v)
        
    return st

def set_text(hid, hn, ht, sr, pn, pd, s1n, s1d, s2n, s2d, s3n, s3d, ss, sw, sp, syn0n, syn0r, syn1n, syn1r, ct0n, ct0r, ct1n, ct1r):
    h = data[hid]
    h['hero_name'] = hn
    h['hero_title'] = ht
    h['role'] = roles_map.get(h['role'], h['role'])
    h['sub_role'] = sr
    h['difficulty'] = diff_map.get(h['difficulty'], h['difficulty'])
    
    if 'passive' in h:
        h['passive']['name'] = pn
        h['passive']['description'] = pd
    if 'skill1' in h:
        h['skill1']['name'] = s1n
        h['skill1']['description'] = s1d
    if 'skill2' in h:
        h['skill2']['name'] = s2n
        h['skill2']['description'] = s2d
    if 'skill3' in h:
        h['skill3']['name'] = s3n
        h['skill3']['description'] = s3d
        
    h['status_text'] = translate_status(h['status_text'])
    
    # replace sub roles in status_text that might be specific
    h['status_text'] = h['status_text'].replace('連射型マークスマン', 'Continuous DPS Marksman').replace('遠距離ポーク', 'Long-Range Poke').replace('バランス', 'Balanced')
    h['status_text'] = h['status_text'].replace('突撃型ファイター', 'Charge Fighter').replace('突進/CC', 'Dash/CC')
    h['status_text'] = h['status_text'].replace('防衛型タンク', 'Vanguard Tank').replace('CC/被ダメージ', 'CC/Damage Taking').replace('終盤', 'Late Game')
    h['status_text'] = h['status_text'].replace('高ダメージ型アサシン', 'Burst Assassin').replace('突進', 'Dash').replace('序盤', 'Early Game')
    h['status_text'] = h['status_text'].replace('狂戦士型ファイター', 'Berserker Fighter')
    h['status_text'] = h['status_text'].replace('突進/先手', 'Dash/Initiator')
    h['status_text'] = h['status_text'].replace('範囲攻撃型メイジ', 'AoE Mage').replace('持続攻撃/確定ダメージ', 'Continuous Damage/True Damage')
    h['status_text'] = h['status_text'].replace('砲台型メイジ', 'Artillery Mage')
    h['status_text'] = h['status_text'].replace('ローム型アサシン', 'Roaming Assassin')
    h['status_text'] = h['status_text'].replace('CC型メイジ', 'CC Mage')
    
    h['strategy']['strengths'] = ss
    h['strategy']['weaknesses'] = sw
    h['strategy']['playstyle'] = sp
    
    h['meta']['summoner_spells'] = [generic_map.get(s, s) for s in h['meta']['summoner_spells']]
    h['meta']['synergy'][0]['hero_name'] = syn0n
    h['meta']['synergy'][0]['reason'] = syn0r
    h['meta']['synergy'][1]['hero_name'] = syn1n
    h['meta']['synergy'][1]['reason'] = syn1r
    
    h['meta']['counters'][0]['hero_name'] = ct0n
    h['meta']['counters'][0]['reason'] = ct0r
    h['meta']['counters'][1]['hero_name'] = ct1n
    h['meta']['counters'][1]['reason'] = ct1r
    
    for sk in ['passive', 'skill1', 'skill2', 'skill3']:
        if sk in h:
            if 'tags' in h[sk]:
                h[sk]['tags'] = translate_tags(h[sk]['tags'])
            if 'table' in h[sk]:
                h[sk]['table'] = translate_table(h[sk]['table'])

# 034 Di Renjie
set_text("hero_034", "Di Renjie", "Magistrate", "Continuous DPS Marksman / Long-Range Poke / Balanced",
"Swiftness", "Basic attacks grant 1 stack of Swiftness, each increasing Attack Speed by 3.5%-7% and Movement Speed by 5% (up to 5 stacks).\nEvery 3rd basic attack fires a random red or blue token.",
"Six Commands: Pursuit", "Fires 6 random red or blue tokens in a designated direction, dealing 150 (+18% Physical Attack) physical damage.\nIf multiple tokens hit the same target, subsequent tokens deal 30% damage.\nRed Token: Explodes on hit, dealing an additional 90 (+18% Physical Attack) magical damage.\nBlue Token: Deals an additional 45 (+9% Physical Attack) magical damage and reduces Movement Speed by 15% for 1s.\nThe 6 tokens count as 1 basic attack. Damage to the same target is reduced to 30%, and skill cast speed scales with Attack Speed.",
"Law and Order", "Throws 8 tokens nearby, gaining brief invincibility, removing all debuffs, and increasing Movement Speed by 25% for 1s.\nToken damage and effects are identical to 'Six Commands: Pursuit'.",
"Dynasty's Mandate", "Fires a golden mandate in a designated direction. The first enemy hero hit takes 300 (+60% Magical Attack) (+120% Extra Physical Attack) physical damage and equal magical damage, and is stunned for 1s. The target's Physical and Magical Defense is reduced by 50% for 5s, and their vision is revealed. Allies moving toward the target gain 10% Movement Speed.",
["Greatly reduces enemy defenses with Ult, crippling even tanky frontlines.", "Strong continuous long-range poke and fast tower pushing capabilities.", "Synergizes well with bruiser builds, giving him higher survivability than other marksmen."],
["Lacks a mobility (blink) skill, making him vulnerable to hard engages from assassins.", "Highly reliant on positioning; being isolated or mispositioned usually leads to death.", "Requires core items to deal significant damage, making it tough to play from behind in gold."],
"In the early game, farm safely from behind your support and rush core items. In team fights, always position behind allied tanks. Use your Ult on the most threatening enemy carry or tank to reduce their defenses, and focus them down quickly. If the enemy has many diving assassins, incorporate defensive items into your build and play flexibly.",
"Zhang Fei", "Provides massive shields and CC, creating a safe environment for dealing damage.",
"Doloria", "Her healing and skill cooldown resets greatly improve stability in laning and team fights.",
"Lanling", "His stealth and high burst damage make it easy to assassinate Di Renjie before he can react.",
"Han Xin", "High mobility allows him to close the gap instantly, making it hard to escape."
)

# 035 Dharma
set_text("hero_035", "Dharma", "Martial Monk", "Charge Fighter / Dash/CC / Balanced",
"Mantra: Heart", "Casting skills grants a stack of Mantra's Blessing, increasing Physical Defense by 32 and Magical Defense by 32 for 5s (up to 3 stacks).\nAfter using Skill 1 and 3, he gains 1 enhanced basic attack (an additional one if hitting a target). Enhanced basic attacks deal an extra 28 (+30% Extra Physical Attack) physical damage and reduce target Movement Speed by 15% for 2s.",
"Mantra: Formless", "Dashes forward with a punch, dealing 150 (+100% Extra Physical Attack) physical damage to enemies in the path and knocking them up for 0.5s. This skill stores 1 charge every 9s (max 2 charges). If an enemy is knocked into a wall by his Ultimate, using this skill within 8s transforms it into a flying kick, dealing additional physical damage equal to 15% of the target's lost HP.",
"Mantra: Illumination", "Unleashes 5 punches per second for 4s (20 punches total). Each punch deals 65 physical damage (+50% to non-heroes) and physical damage equal to 0.35% of the target's max HP (increases by 0.25% per 100 Extra Physical Attack). Heals 65 (+2.5% Extra HP) HP per hit. During casting, you can change direction with the joystick, automatically firing enhanced basic attacks that apply the same effect as his passive. Healing is halved against non-heroes. Canceling the skill refunds 50%-100% cooldown based on duration cast.",
"Mantra: Truth", "Punches forward, dealing 200 (+100% Extra Physical Attack) physical damage and knocking enemies back. Enemies knocked into a wall take an additional 200 (+100% Extra Physical Attack) physical damage and are stunned for 1s.",
["Possesses game-changing potential with his Ult's massive AoE wall-stun.", "Combines tank-like durability with fighter-level damage to pressure the frontline.", "Dash skills and strong CC make it easy to isolate and burst down enemy mages or marksmen."],
["Heavily reliant on team follow-up; struggles to secure kills alone after engaging.", "Vulnerable to hard CC before engaging, which can completely shut him down.", "High mana consumption makes resource management difficult during laning and extended fights."],
"Positioning near terrain is crucial to maximize your wall-stuns. The ideal engage is using Flash combined with Skill 1 to close the gap on the enemy backline, followed by an Ultimate to stun multiple targets against a wall. Play safely in the early game. Once you acquire cooldown reduction items in the mid-game, actively look to initiate team fights and catch isolated enemies.",
"Zhao Yun", "Both heroes possess knock-ups, allowing them to chain powerful CC effectively.",
"Daji", "Her reliable stun stops enemies, guaranteeing an easy wall-stun with your Ultimate.",
"Zhuangzi", "His Ultimate cleanses AoE CC, completely nullifying Dharma's wall-stun.",
"Di Renjie", "His Skill 2 removes CC, allowing him to escape and counterattack."
)

# 036 Xiang Yu
set_text("hero_036", "Xiang Yu", "The Conqueror", "Vanguard Tank / CC/Damage Taking / Late Game",
"Victor's Resolve", "When HP drops below 30%, reduces incoming damage by 40% for 6s (90s cooldown). Casting 'Fearless Charge' or 'No Escape' grants an enhanced basic attack with different effects (up to 2 stacks).",
"Fearless Charge", "Dashes forward, knocking enemies back, and performs a slash at the end, knocking them up for 0.75s. The dash and slash deal 225 (+5% Extra HP) physical damage and enhance his basic attack. The vertical slash deals 445 (+100% Physical Attack) (+80% Extra Physical Attack) physical damage (guaranteed critical hit with 150% base critical damage).",
"No Escape", "Roars, reducing nearby enemies' Movement Speed by 15% for 2s, dealing 275 (+90% Extra Physical Attack) magical damage, and reducing their Attack Damage by 30% for 3.5s. Enhances basic attack and grants 25% Movement Speed (decays over 2s). The enhanced sweep restores 350 (+7% Extra HP) HP (halved against non-heroes; heals more at lower HP, up to +50%) and deals 235 (+100% Physical Attack) physical damage.",
"Overlord's Halberd", "Fights with back to the river. Gains Super Armor and 'Indomitable' while casting. Charges up and unleashes a shockwave dealing 900 (+260% Extra Physical Attack) physical damage. Enemies hit by the blade take an additional 50% damage and are stunned for 0.75s. Damage increases as HP decreases (up to +50%). Restores HP equal to 20% of damage dealt.\nIndomitable: HP cannot drop below 1 and prevents death.",
["Incredible survivability due to his massive damage reduction when below 30% HP.", "Strong CC skills like the dash-knockup and AoE stun can lock down enemies.", "Deals true damage based on max HP through his passive, making him a threat to tanks and towers."],
["Low mobility outside of Skill 1 makes him susceptible to getting kited by highly mobile heroes.", "High skill reliance; missing his engage skills leaves him wide open.", "Percent-damage or heavy armor-piercing builds can easily bypass his durability."],
"As the main tank, dive deep into the enemy lines during team fights to lock down key targets. To maximize your passive's damage reduction, you must have the courage to hold the frontline while maintaining low HP. Your Ultimate not only deals high damage but grants 'CC Immunity' and 'Undying', so using it to endure powerful enemy bursts is highly effective.",
"Luban No.7", "Can push enemies away to keep distance, protecting the immobile marksman.",
"Nakoruru", "Xiang Yu leads the charge and restricts enemies, creating an opening for Nakoruru to burst them down safely.",
"Lan", "High mobility allows him to bypass defenses, making Xiang Yu's durability less effective.",
"Di Renjie", "His defense reduction debuff significantly mitigates Xiang Yu's tankiness."
)

# 037 Sima Yi
set_text("hero_037", "Sima Yi", "Dark Shadow", "Burst Assassin / Dash / Early Game",
"Silent Whispers", "Gains vision of enemy heroes casting skills within a 2000 range and restores 10 Shadow Power (max 50).\nCasting skills summons a scythe with Shadow Power, enhancing basic attacks and granting 20 Movement Speed for 5s. The first enhanced attack consumes all Shadow Power, teleporting behind the target to deal 300 (+60% Magical Attack) magical damage (true damage is doubled). Each scythe hit deals 230 (+46% Magical Attack) magical damage and true damage equal to the Shadow Power consumed.\nEvery 20 Shadow Power consumed increases the enhanced attack's range by 3%.",
"Shadow Bite", "Controls a fast-moving spirit for 2.5s, gaining CC immunity. The spirit deals 115 (+23% Magical Attack) magical damage to enemies it touches. Upon basic attacking or when the effect ends, Sima Yi dashes to the spirit's location, dealing 115 (+23% Magical Attack) magical damage to enemies in his path and reducing their Movement Speed by 25% for 1s.",
"Desolate Ruin", "Unleashes spiritual energy to suppress the surrounding area, dealing 250 (+50% Magical Attack) magical damage and silencing enemies for 0.75s. Healing is increased by 10% while inside the suppression area.\nPassive: Taking magical damage restores 25% of the damage taken as HP over 3s (halved for physical damage).",
"Death's Descent", "Steps back and charges briefly before dashing to a targeted location, dealing 500 (+100% Magical Attack) magical damage (halved for enemies in the path). If interrupted, the cooldown is reduced by 90%.",
["Overwhelming burst damage capable of instantly assassinating the enemy backline.", "Ultimate provides long-range mobility for fast map rotations and ganks.", "AoE silence on Skill 2 prevents enemy counterattacks, and energy system means no mana issues."],
["Extremely squishy; if caught by CC, he dies without being able to act.", "Highly reliant on gold and snowballing; becomes severely useless if behind.", "Struggles in extended team fights or against durable team comps with many tanks and fighters."],
"Focus on farming early game, using your high mobility to actively gank out-of-position enemies and snowball. Never engage first in team fights; wait patiently for enemies to blow their CC skills. Time your Ultimate or Skill 1 to dive the enemy marksman or mage, burst them down with Skill 2's silence and enhanced attacks, then immediately disengage like a true assassin.",
"Zhuge Liang", "Great at following up after enemies are poked down, and their high mobility secures multiple kills.",
"Guiguzi", "Groups enemies together, making it easier for Sima Yi to land his Ultimate and AoE silence.",
"Han Xin", "Has higher mobility, allowing him to easily escape or counterattack Sima Yi.",
"Zhang Fei", "His massive shields and CC can completely protect the targeted squishy from burst damage."
)

# 038 Fuzi
set_text("hero_038", "Fuzi", "Old Master", "Berserker Fighter / Dash / Late Game",
"Master's Lesson", "Basic attacks grant 1 stack of Admonition for 5s (max 5 stacks).\nAt max stacks, enters an enhanced state for 5s, increasing Movement Speed by 60 and Attack Speed by 30%. Basic attacks deal 80 (+28% Extra Physical Attack) true damage and reduce the cooldown of Skill 1 and 2 by 1s.",
"Sage's Admonition", "Swings his ruler in a target direction, pulling enemies in front of him. Deals 320 (+100% Extra Physical Attack) physical damage and reduces their Movement Speed by 25% for 1.5s - 2.5s (duration scales with skill level).",
"Righteous Anger", "Enhances himself for 2s, gaining 25% Movement Speed and 45% Damage Reduction.\nIf hit by an enemy hero's basic attack during this time, reflects 50% of the damage back to the attacker and reduces their Movement Speed by 15% for 2s. The reflected damage applies basic attack effects.\nPassive: Basic attacks have a 25% chance to trigger an extra basic attack dealing 50% damage and applying basic attack effects.",
"Sage's Authority", "Dashes in a target direction, tying the first enemy hero hit to a lantern, dealing 600 (+200% Extra Physical Attack) physical damage, and restricting their movement to the lantern's vicinity for 5s.\nThe tied target's damage output is reduced by 20%.",
["Unrivaled 1v1 dueling strength due to the massive damage reduction from Skill 2.", "Extremely fast tower pushing speed thanks to true damage and attack speed from his passive.", "Ultimate forcibly locks down enemy carries or highly mobile heroes in a specific area."],
["Weak early game fighting power; requires careful farming until items are built.", "Vulnerable to chain CC; can be bursted down before casting his damage reduction.", "Hard to reach the enemy backline in team fights; can be easily kited if not positioned well."],
"Avoid forced fights early and farm safely until core items are completed. In the mid-to-late game, utilize his overwhelming 1v1 potential to split-push side lanes and take down towers, creating map pressure. When joining team fights, time your Skill 2 damage reduction properly, lock down the most important target with your Ultimate, and burst them down with your team.",
"Daqiao", "The combination of split-pushing and recalling allows for a relentless strategy that constantly confuses the enemy.",
"Li Bai", "Fuzi's long lockdown creates the perfect window for Li Bai to safely unleash max burst damage.",
"Charlotte", "Her high mobility and damage reduction gives her the edge in basic attack trades.",
"Guan Yu", "Can easily push Fuzi away, making it hard for him to close the gap and stack his passive."
)

# 039 Guan Yu
set_text("hero_039", "Guan Yu", "Unstoppable Force", "Charge Fighter / Dash/Initiator / Balanced",
"One Against a Thousand", "Passive: Continuous movement increases Movement Speed by 2% per 100 units moved. Enters Charge State upon moving 2000 units. Stopping or dropping below 375 Movement Speed cancels the Charge State.\nBasic attacks in Charge State knock enemies back and deal physical damage equal to 10% of max HP. Moving towards enemies grants 20% increased Movement Speed.",
"Azure Dragon Cleave", "Swings the Azure Dragon Crescent Blade, dealing 215 (+127% Physical Attack) physical damage to nearby enemies.\nCharge State: Dashes forward, knocking enemies back and dealing physical damage equal to 10% max HP. Cleaves at the end of the dash, dealing 250 (+150% Physical Attack) physical damage.",
"Azure Dragon Assault", "Cleanses all CC and increases Movement Speed by 30% (decays over 2s).\nCharge State: Cleanses all CC, leaps forward to knock enemies back, and deals 200 (+112% Physical Attack) physical damage.",
"God of War Descent", "Ignites fighting spirit, reducing the movement distance required to enter Charge State by 50% for 10s.\nCharge State: Summons a cavalry charge forward, knocking enemies back and dealing physical damage equal to 10% of max HP. Then reduces the movement distance required to enter Charge State by 50% for 10s.",
["Exceptional rotation speed across the map thanks to his passive 'Charge State'.", "Powerful knockbacks from his Charge State disrupt enemy formations and isolate targets.", "Built-in CC cleanse on Skill 2 allows him to escape interruptions and counterattack."],
["Damage plummets if movement stops; must keep moving constantly, making him very hard to play.", "Weak to chain CC and heavy slows; stopping his charge completely shuts him down.", "Heavily relies on team follow-up; disrupting formations is useless if allies can't capitalize."],
"The key is to constantly move the joystick to maintain your 'Charge State' and never stop. In the early game, use your high mobility to gank other lanes and support allies. In team fights, never engage from the front; flank from the side or rear and knock the enemy backline towards your team to isolate them. Be wary of enemy CC skills and rely on your Skill 2 cleanse to remain unstoppable.",
"Sun Bin", "His movement speed buffs make it much easier for Guan Yu to maintain his Charge State.",
"Yao", "Her shields and CC provide protection, allowing safe engages and disengages.",
"Fuzi", "His ultimate restricts movement, completely denying Guan Yu his Charge State.",
"Daji", "Her guaranteed stun immediately stops his charge, leaving him vulnerable to heavy damage."
)

# 040 Diaochan
set_text("hero_040", "Diaochan", "The Peerless Dancer", "AoE Mage / Continuous Damage/True Damage / Late Game",
"Explosion of Lotus", "Hitting enemies with skills applies 1 stack of Floral Mark (lasts 8s). At 4 stacks, the mark detonates, restoring 120 (+12% Magical Attack) HP.\nDetonating the mark deals 160 (+64% Magical Attack) true damage to nearby enemies and reduces their Movement Speed by 50% for 1s.",
"Falling Petals", "Throws a lotus flower in a target direction. The lotus deals 180 (+57% Magical Attack) magical damage to enemies in its path both as it flies out and returns.",
"Petal Dance", "Teleports to a targeted location and scatters 3 flower orbs at nearby enemies. Each orb deals 140 (+28% Magical Attack) magical damage. Hitting an enemy with an orb reduces the cooldown of Skill 2 by 4s.",
"Flowery Array", "Creates a formation at her current location. When the formation appears and disappears, it deals 210 (+50% Magical Attack) magical damage to enemies within.\nWhile Diaochan remains inside the formation, the cooldowns of Skill 1 and Skill 2 recover significantly faster.",
["Unmatched strength in extended team fights due to passive healing and true damage.", "The invincibility frame on Skill 2's dash allows her to dodge enemy attacks and CC.", "Ultimate drastically reduces skill cooldowns, allowing her to spam high damage output."],
["Extremely vulnerable to hard CC (especially suppression); she will die instantly if locked down.", "Must fight in close-to-mid range despite being a Mage, which is highly risky.", "Very mana-hungry, and anti-heal items significantly drop her survivability."],
"Unlike standard Mages, she fights in close quarters. In team fights, wait for the enemy to use their hard CC (like suppression or stuns) before going in. Deploy your Ultimate and spam Skill 1 and 2 rapidly within its range, constantly applying true damage and healing yourself. Mastering the invincibility frames of Skill 2 to dodge attacks is mandatory, and pairing it with the 'Purify' spell is crucial for staying alive.",
"Zhuangzi", "His AoE CC cleanse allows her to dance uninterrupted inside her Ultimate.",
"Bai Qi", "His strong AoE taunt groups enemies together, maximizing her AoE damage.",
"Zhang Liang", "His suppression Ultimate cannot be cleansed by Purify, completely locking her down.",
"Mulan", "Her high burst damage and silence can easily kill Diaochan before she can spam her skills."
)

# 041 Luna
set_text("hero_041", "Luna", "Moonlight Blade", "Charge Fighter",
"Moonlight Dance", "Has two basic attack modes. If the target is outside melee range, she automatically switches to ranged. The first of every 3 basic attacks is a charge if in melee mode. The 3rd basic attack deals an additional 150 (+35% Magical Attack) magical damage and marks the target for 5s (cannot mark towers/crystal). Every 1 Magical Attack increases Attack Speed by 0.03%.",
"Crescent Moon Splice", "Unleashes a moonlight shockwave in a designated direction, dealing 400 (+65% Magical Attack) magical damage and marking enemies.",
"Searing Sword", "Pulls nearby enemies in, dealing 120 (+31% Magical Attack) magical damage and stunning them for 0.5s. She also gains a 450 (+80% Magical Attack) shield, reduces enemy Movement Speed by 25% for 2s, and marks the pulled enemies.",
"New Moon", "Dashes, dealing 420 (+65% Magical Attack) magical damage to enemies in her path. Hitting a marked enemy resets the cooldown of New Moon.",
["Extremely high mobility and continuous dashes using Ultimate resets.", "Can hit-and-run against enemy backlines, possessing massive outplay potential.", "Incredible sustained damage in the mid-to-late game once core items and CDR are acquired."],
["Extremely vulnerable to CC; easily bursted down if stunned or silenced.", "Very high difficulty; failing to reset her Ultimate leaves her isolated in the enemy team.", "Highly item-dependent; struggles to make an impact if she falls behind in early farming."],
"Farm efficiently in the early game as a standard jungler, looking for secure ganks to gain resources. In team fights, do not engage first; wait for your tanks to absorb enemy CC before diving the backline. Utilize skill combos to repeatedly reset your Ultimate, performing hit-and-run attacks to weave in and out of the fight.",
"Guiguzi", "Groups enemies together, making it easier for Luna to hit multiple targets and reset her Ultimate.",
"Zhuangzi", "Provides CC cleanse and immunity, allowing squishy Luna to dive the enemy team safely.",
"Zhang Liang", "Hard locks her with point-and-click CC, completely shutting down her mobility.",
"Heino", "Reliable CC and burst damage can interrupt her combos and burst her down."
)

# 042 Jiang Ziya
set_text("hero_042", "Jiang Ziya", "The Sanctifier", "Artillery Mage",
"Sanctification", "If a damaged target dies within 3s, gains 1-3 EXP orbs. Upon reaching Lv.15, gains a one-time 'Divine Bestowal'. Casting it increases his max level to 25 and grants 20 Magical Attack per level up. If cast on an ally, that ally gains 1200 EXP, an increased level cap, and a chance to gain EXP orbs. If playing Roam, grants additional sanctification effects based on the ally's role.",
"Divine Seal", "Seals the area with divine power, dealing 70 (+14% Magical Attack) magical damage. Then deals 60 (+12% Magical Attack) magical damage every 0.4s for 7 hits. Sealed enemies suffer gradually decreasing Movement Speed (up to 30%), Physical Defense (up to 10%), and Magical Defense (up to 10%). Upon hit, gains 30% Movement Speed for 1s (decays).",
"Divine Punishment", "Punishes the insolent by creating a magical circle, dealing 60 (+12% Magical Attack) magical damage 3 times. The circle explodes shortly after, dealing 300 (+70% Magical Attack) magical damage and knocking enemies up for 0.75s.",
"Heavenly Law", "Gathers power and unleashes 3 shockwaves forward. The first 2 deal 120 (+20% Magical Attack) magical damage each; the final wave deals 560 (+80% Magical Attack) magical damage. Upon reaching Lv.15 and unlocking Sanctification, gains a 20% chance (+20% per level) to enter 'Heavenly Mode', allowing him to move while casting. Can be charged for up to 2s, firing upon moving or recasting. Attack range increases with charge time (max 1800). Deals 10% damage to structures.",
["Passive increases his max level to 25 and allows one ally to break their level 15 cap.", "Strong poke potential with Skill 1's continuous damage, slow, and defense reduction.", "The longer the game goes, the stronger his team becomes due to the level cap breakthrough."],
["Very weak early game before reaching level 4 and collecting EXP orbs.", "Lacks mobility skills, making him vulnerable to assassin dives and close combat.", "Low playmaking potential on his own; heavily relies on the frontline for protection and space."],
"Farm safely from a distance early on, tagging minions and enemies with skills to efficiently collect EXP orbs and rush to level 15. In team fights, poke from the backline, using your skills to reduce enemy defenses and apply slows to support your team. Save your Flash and use it purely for survival when enemies dive you.",
"Zhang Fei", "Provides a strong frontline and CC, allowing Jiang Ziya to safely poke from behind.",
"Erin", "Benefits greatly from the level cap unlock, massively boosting her late-game damage.",
"Lanling", "His stealth and mobility let him easily close the gap and instantly assassinate immobile Jiang Ziya.",
"Gan & Mo", "Can safely poke and deal burst damage from an even longer range."
)

# 043 Liu Bang
set_text("hero_043", "Liu Bang", "The Double-Faced Monarch", "Vanguard Tank",
"Monarch's Ambition", "Gains 1 stack of mark per second. Basic attacks consume all marks, dealing an additional 80 (+10% Magical Attack) magical damage per stack. At 4 stacks, his next basic attack becomes ranged, dealing 474 (+100% Physical Attack) (+42% Magical Attack) magical damage.",
"Hegemon's Shield", "Gains a 600 (+18% Extra Max HP) shield for 5s. When it ends, deals 600 (+80% Magical Attack) magical damage to nearby enemies. Can be recast after 1.5s to manually detonate. If the shield is broken, damage is halved.",
"Double Intimidation", "Charges and dashes 275-550 units, dealing 300 (+40% Magical Attack) to 600 (+80% Magical Attack) magical damage to enemies in the path and stunning them for 0.75s. Effect scales with charge time (max 1s). If interrupted or canceled, cooldown is reduced by 40%.",
"Battlefield Command", "Selects an ally, channeling for 2.2s before teleporting to them. Immediately grants the ally a shield absorbing 480 (+12% of Target's Extra Max HP) to 960 (+24% of Target's Extra Max HP). After teleporting, heals himself and nearby allies for 300 (+8% Extra Max HP), gains 30% Movement Speed, and fully charges 'Double Intimidation' for 10s. Recasting after 0.4s teleports instantly, removes the ally's shield, and deals 200 (+40% Magical Attack) to 400 (+80% Magical Attack) magical damage to nearby enemies, but negates the healing effect. Shield and damage scale with channel time.",
["Global presence with an Ultimate that allows him to teleport and shield allies anywhere on the map.", "Excellent CC and peel with his Skill 2 dash-stun, protecting his carries.", "Despite being a tank, his passive and skills deal high magical damage, making him a solid threat."],
["Weak against anti-tank heroes or items that deal percentage damage or possess high armor penetration.", "Highly reliant on skills; wasting his Ultimate or CC greatly diminishes his impact.", "Requires good team coordination; struggles to shine if his team's composition or macro is lacking."],
"Play as a Roamer (Support) or Clash Laner. In the early game, focus on securing vision and protecting your carry. In the mid-to-late game, push side lanes and use your Ultimate to instantly join team fights or save allies, turning the tide of battle. During team fights, dive into the enemy formation with Skill 2 and hold the frontline with your shield.",
"Di Renjie", "A powerful marksman who fully maximizes the benefits of Liu Bang's global protection.",
"Butterfly", "Can dive deep with her and follow up instantly with CC.",
"Marco Polo", "His true damage and percentage damage easily shred through Liu Bang's shields and high durability.",
"Lu Bu", "His high true damage ignores shields and defenses, dominating Liu Bang in the laning phase."
)

# 044 Han Xin
set_text("hero_044", "Han Xin", "The Invincible", "Roaming Assassin",
"Spear of Killing Intent", "The 4th basic attack knocks enemies up for 0.5s, dealing an additional 90 (+35% Extra Physical Attack) physical damage, and grants 20% Physical Lifesteal. Hitting an enemy with a skill or enhanced basic attack increases Attack Speed by 25%-50%.",
"Merceless Assault", "Leaps to a designated location, dealing 250 (+85% Extra Physical Attack) physical damage and knocking enemies up for 0.5s. Can be recast within 5s to leap again and deal the same physical damage.",
"Back to the Wall", "Dashes backward and enhances the next basic attack into a sweep for 3s. The sweep deals an additional 120 (+50% Extra Physical Attack) physical damage. If the sweep triggers the 4th basic attack, it applies the 4th attack's extra effects.",
"The Unrivaled", "Swings his spear 4 times in a fan shape, dealing 250 (+65% Extra Physical Attack) physical damage per hit, with the final hit knocking enemies up for 0.5s. Gains Super Armor and 30% Damage Reduction while casting.",
["Unparalleled mobility with multiple dashes, allowing him to traverse the map at lightning speed.", "Strong early jungle clear and ganks, making it easy to snowball and build a gold lead.", "Excels at solo objective taking and split-pushing, applying relentless macro pressure on the enemy."],
["Extremely squishy; highly susceptible to being bursted down if caught by CC.", "Poor in direct 5v5 team fights, especially against teams with strong peel or hard CC.", "High difficulty; misjudging dash distances or order can easily result in isolation and death."],
"Reach level 4 quickly in the early game, utilizing your mobility for aggressive ganks to farm gold. Avoid head-on 5v5 team fights in the mid-to-late game. Instead, employ guerilla tactics by assassinating the enemy backline and escaping immediately. Exploit enemy gaps to counter-jungle, take objectives, and split-push towers—macro play is your key to victory.",
"Zhang Liang", "Reliable lockdown creates an opening for Han Xin to safely burst targets down.",
"Mozi", "Long-range stuns stop enemies, strongly supporting Han Xin's engages and escapes.",
"Fuzi", "His Ultimate traps him completely, neutralizing Han Xin's mobility and leading to certain death.",
"Diaochan", "Her high mobility and invincibility frames allow her to dodge his attacks and counter-kill him with sustained damage."
)

# 045 Wang Zhaojun
set_text("hero_045", "Wang Zhaojun", "The Frost Princess", "CC Mage",
"Freezing Soul", "Leaving combat grants a 450 (+58% Magical Attack) shield. Enemies dealing physical damage to the shield are afflicted with Chilled. When the shield breaks, deals 400 (+75% Magical Attack) magical damage to nearby enemies and applies Chilled. The 3rd basic attack is enhanced, firing 3 icicles dealing 180 (+36% Magical Attack) magical damage (triggers 100% basic attack effects). Active skills and enhanced basic attacks apply Chilled, reducing Movement Speed and Attack Speed by 25%-50% for 2s (decays over time).",
"Shattered Ice", "Summons an ice crystal at a target location, dealing 350 (+50% Magical Attack) magical damage to enemies and applying Chilled. Grants vision of the area and hit enemies for 2s.",
"Ice Prison", "Summons frost power at a target location, dealing 250 (+50% Magical Attack) magical damage after a short delay and freezing enemies for 2.5s. Frozen enemies take an additional 150 (+20% Magical Attack) magical damage.",
"Winter's Grasp", "Summons a blizzard at a target location for 5s, dealing 200 (+35% Magical Attack) magical damage every 0.5s and applying Chilled. Casting the blizzard instantly refreshes her passive shield.",
["Excellent slow and freeze (stun) skills, highly capable of locking down enemies and creating kill opportunities.", "Ultimate deals massive AoE sustained damage and slow, excelling at team fight control and zone denial.", "Possesses relatively high self-peel among mages due to the passive shield gained out of combat."],
["Low base movement speed and lacks dash skills, making her vulnerable to highly mobile assassins.", "Skills have delayed casting times; landing her Ice Prison requires prediction and precise timing.", "Weak against enemies with CC immunity, cleanse, or high mobility to dodge her skills."],
"Farm safely to push waves early on, establishing mid-lane priority before roaming to support side lanes. In team fights, position behind your frontline. Do not blindly aim for a freeze; instead, apply slows with your Ultimate or Skill 1 first, making it much easier to land Skill 2. When defending towers or fighting in narrow jungle paths, use your Ultimate to completely block enemy entry.",
"Zhang Fei", "Draws aggro and locks down enemies at the front, making it easier for her to land Ice Prison.",
"Zhou Yu", "Layering their massive AoE magic damage decimates enemies in team fights.",
"Mai Shiranui", "High mobility lets her easily dodge freezes and instantly burst Zhaojun down.",
"Zhuangzi", "His strong AoE CC cleanse and immunity completely neutralizes Zhaojun's freezing strengths."
)

with codecs.open('c:/Users/81901/Desktop/オナーオブキングスサイト/chunk_5_translated.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Translation completed and saved.")
