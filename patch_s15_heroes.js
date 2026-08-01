const fs = require('fs');

const en = JSON.parse(fs.readFileSync('public/data/skills/en.json', 'utf8'));

// 631: Florentino
en['631'] = {
  passive: {
    name: "Passive: Sword Dance",
    description: "When striking an enemy with a basic attack after exiting combat or using skills, gains an enhanced basic attack that dashes and deals physical damage. Picking up a flower restores energy, reduces Skill 2 cooldown, and enhances the next basic attack.",
    table: { headers: ["Lv.1", "Lv.15"], rows: [{ label: "Bonus AD", values: ["100%", "150%"] }] },
    cooldown_text: ""
  },
  skill1: {
    name: "Skill 1: Blossom Burst",
    description: "Throws a dart forward, dealing 250 (+80% Extra AD) physical damage and stunning the first enemy hit. Creates 3 flowers around the target upon hitting.",
    table: { headers: ["Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5", "Lv.6"], rows: [{ label: "Cooldown", values: ["8.5", "8.0", "7.5", "7.0", "6.5", "6.0"] }, { label: "Base Damage", values: ["250", "300", "350", "400", "450", "500"] }] },
    cooldown_text: "CD: 8.5s / Mana: 40"
  },
  skill2: {
    name: "Skill 2: Triple Threat",
    description: "Strikes 3 times in rapid succession, dealing 225 (+50% Extra AD) physical damage per hit and slowing the target. The 3rd hit knocks up enemies in range.",
    table: { headers: ["Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5", "Lv.6"], rows: [{ label: "Cooldown", values: ["4", "3.8", "3.6", "3.4", "3.2", "3.0"] }, { label: "Base Damage", values: ["225", "260", "295", "330", "365", "400"] }] },
    cooldown_text: "CD: 4s / Mana: 30"
  },
  skill3: {
    name: "Skill 3: Duel of Honor",
    description: "Challenges the targeted enemy hero to a duel for 5 seconds, dealing 400 (+110% Extra AD) physical damage and gaining CC immunity against all other enemies.",
    table: { headers: ["Lv.1", "Lv.2", "Lv.3"], rows: [{ label: "Cooldown", values: ["40", "35", "30"] }, { label: "Base Damage", values: ["400", "550", "700"] }] },
    cooldown_text: "CD: 40s / Mana: 80"
  },
  strategy: {
    earlyGame: "Use Skill 1 to hit the enemy, pick up the spawned flowers to reset Skill 2 and dash around your target. Dominate early 1v1 trades in Clash Lane.",
    midGame: "Roam and look for duels. In skirmishes, use your flowers to continuously dance around enemies while avoiding incoming skillshots.",
    lateGame: "Look for flank opportunities to target the enemy backline carry. Use Skill 3 to isolate the main target and gain CC immunity from the rest of the team.",
    teamfight: "Challenge the enemy carry with Skill 3, neutralizing CC from other enemy heroes while shredding the target with flower dashes.",
    combos: [
      { title: "Flower Dance Combo", description: "Skill 1 -> Dash -> Pick flower -> Skill 2 -> Repeat flower pickup for infinite dashes." }
    ]
  },
  meta: { summoner_spells: [], synergy: [], counters: [] },
  skins: []
};

// 635: Lorion
en['635'] = {
  passive: {
    name: "Passive: Dark Affinity",
    description: "When skills hit enemies, Lorion gains Dark Orbs that float around him, dealing periodic magical damage to nearby enemies and restoring HP.",
    table: { headers: ["Lv.1", "Lv.15"], rows: [{ label: "Base Dmg", values: ["120", "280"] }] },
    cooldown_text: ""
  },
  skill1: {
    name: "Skill 1: Dark Sphere",
    description: "Launches the Dark Orb to a designated location, dealing 240 (+45% AP) magical damage to enemies in its path. Can be recast to reposition the orb.",
    table: { headers: ["Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5", "Lv.6"], rows: [{ label: "Cooldown", values: ["6", "5.6", "5.2", "4.8", "4.4", "4.0"] }, { label: "Base Damage", values: ["240", "280", "320", "360", "400", "440"] }] },
    cooldown_text: "CD: 6s / Mana: 45"
  },
  skill2: {
    name: "Skill 2: Dark Shift",
    description: "Teleports to the location of the Dark Orb, dealing 300 (+50% AP) magical damage to surrounding enemies and gaining a shield.",
    table: { headers: ["Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5", "Lv.6"], rows: [{ label: "Cooldown", values: ["8", "7.6", "7.2", "6.8", "6.4", "6.0"] }, { label: "Base Damage", values: ["300", "350", "400", "450", "500", "550"] }] },
    cooldown_text: "CD: 8s / Mana: 50"
  },
  skill3: {
    name: "Skill 3: Dark Singularity",
    description: "Channels dark energy at the Dark Orb's location, creating a singularity that suspends and knocks up all nearby enemies for 1.5 seconds, dealing 600 (+80% AP) magical damage.",
    table: { headers: ["Lv.1", "Lv.2", "Lv.3"], rows: [{ label: "Cooldown", values: ["45", "40", "35"] }, { label: "Base Damage", values: ["600", "850", "1100"] }] },
    cooldown_text: "CD: 45s / Mana: 90"
  },
  strategy: {
    earlyGame: "Clear Mid lane waves with Skill 1. Poke enemy mages from range and use Skill 2 to reposition safely when ambushed.",
    midGame: "Participate in river teamfights. Place your orb into narrow choke points with Skill 1 and use Skill 3 (Ultimate) to suspend multiple enemies.",
    lateGame: "Act as the primary teamfight controller. Stay positioned behind your frontline, launch the orb into enemy clumps, and trigger Ultimate to setup easy kills.",
    teamfight: "Position your orb inside enemy ranks with Skill 1, then cast Skill 3 to knock up the entire team for your allies to follow up.",
    combos: [
      { title: "Orb Setup Burst", description: "Skill 1 (Place Orb) -> Skill 3 (Suspend enemies) -> Skill 2 (Teleport in) -> Basic Attack" }
    ]
  },
  meta: { summoner_spells: [], synergy: [], counters: [] },
  skins: []
};

// 640: Annette
en['640'] = {
  passive: {
    name: "Passive: Whispering Wind",
    description: "Moving reduces skill cooldowns and restores Mana. Gains +25 Movement Speed when near ally heroes.",
    table: { headers: ["Lv.1", "Lv.15"], rows: [{ label: "Movement Speed", values: ["25", "50"] }] },
    cooldown_text: ""
  },
  skill1: {
    name: "Skill 1: Tempest Field",
    description: "Summons a wind circle at the target location for 4s (ticks every 0.5s). Deals 160 (+28% AP) magical damage to enemies and slows them by 5% (up to 5 stacks). Increases ally movement speed by 5% (up to 5 stacks).",
    table: { headers: ["Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5", "Lv.6"], rows: [{ label: "Cooldown", values: ["12.5", "12", "11.5", "11", "10.5", "10"] }, { label: "Base Damage", values: ["160", "192", "224", "256", "288", "320"] }] },
    cooldown_text: "CD: 12.5s / Mana: 40"
  },
  skill2: {
    name: "Skill 2: Wind Shield",
    description: "Fires a wind orb forward (dashes backward), gaining a 400 (+6% AP) shield and +75 Movement Speed for 2s. Deals 300 (+50% AP) magical damage to enemies and grants allies hit a 400 shield. Moves Skill 1's field if contacted.",
    table: { headers: ["Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5", "Lv.6"], rows: [{ label: "Cooldown", values: ["15", "14.4", "13.8", "13.2", "12.6", "12"] }, { label: "Base Damage", values: ["300", "360", "420", "480", "540", "600"] }] },
    cooldown_text: "CD: 15s / Mana: 60"
  },
  skill3: {
    name: "Skill 3: Spring Wind Barrier",
    description: "Creates a wind barrier around herself for 4s, knocking back nearby enemies and dealing 300 (+50% AP) magical damage and 1.25s stun upon contact. Grants allies inside the barrier Super Armor (CC immunity).",
    table: { headers: ["Lv.1", "Lv.2", "Lv.3"], rows: [{ label: "Cooldown", values: ["75", "67.5", "60"] }, { label: "Base Damage", values: ["300", "450", "600"] }] },
    cooldown_text: "CD: 75s / Mana: 120"
  },
  strategy: {
    earlyGame: "Use Skill 1 to speed up wave clear in Mid lane. Roam with your jungler and shield them with Skill 2 during ganks.",
    midGame: "Stick close to your ADC or carries. Use Skill 3 to knock back enemy assassins whenever they try to dive your backline.",
    lateGame: "Maintain vision with your passive movement speed. Keep your allies shielded and immune to CC inside your Skill 3 barrier during objective fights.",
    teamfight: "Stand near your carries and cast Skill 3 to knock back diving fighters/assassins, creating a safe zone with Super Armor.",
    combos: [
      { title: "Poke & Shield Combo", description: "Skill 1 (Place field) -> Skill 2 (Move field to target & gain shield)" }
    ]
  },
  meta: { summoner_spells: [], synergy: [], counters: [] },
  skins: []
};

fs.writeFileSync('public/data/skills/en.json', JSON.stringify(en, null, 2), 'utf8');
console.log('Successfully updated 631, 635, and 640 in en.json!');
