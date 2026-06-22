const fs = require('fs');
const path = require('path');

const scratchDir = 'c:/Users/81901/Desktop/ワイリフサイト/scratch';
const destPath = 'c:/Users/81901/Desktop/ワイリフサイト/src/data/runes.json';

const groupFiles = [
  path.join(scratchDir, 'transcribed_group_1.json'),
  path.join(scratchDir, 'transcribed_group_2.json'),
  path.join(scratchDir, 'transcribed_group_3.json'),
  path.join(scratchDir, 'transcribed_group_4.json')
];

// Predefined English descriptions and meta details for the 52 runes
const runeMeta = {
  // Keystones
  "electrocute": {
    nameEn: "Electrocute",
    category: "Keystone",
    tree: "Domination",
    image: "/images/runes/electrocute.png",
    descriptionEn: "Hitting a champion with 3 separate attacks or abilities within 3 seconds deals bonus adaptive damage. Damage: 40 - 194 (+35% bonus AD, +20% AP) Cooldown: 20 - 13 seconds."
  },
  "dark_harvest": {
    nameEn: "Dark Harvest",
    category: "Keystone",
    tree: "Domination",
    image: "/images/runes/dark_harvest.png",
    descriptionEn: "Damaging a champion below 50% Health deals adaptive damage and harvests their soul, permanently increasing Dark Harvest's damage by 10. Damage: 40 (+10 per soul) (+25% bonus AD) (+15% AP). Cooldown: 20s (resets to 1s on takedown)."
  },
  "empowerment": {
    nameEn: "Empowerment",
    category: "Keystone",
    tree: "Precision",
    image: "/images/runes/empowerment.png",
    descriptionEn: "Basic attacks on enemy champions 3 consecutive times deals 60 - 200 bonus adaptive damage and increases damage dealt by 9% until exiting combat. Cooldown: 4 seconds. Damage amplification is only effective against champions."
  },
  "lethal_tempo": {
    nameEn: "Lethal Tempo",
    category: "Keystone",
    tree: "Precision",
    image: "/images/runes/lethal_tempo.png",
    descriptionEn: "Attacking an enemy champion grants you a stack of Attack Speed, up to 6. At max stacks, gain bonus attack range and exceed the Attack Speed limit. Stack bonus: 8 - 16% (melee) or 3 - 10% (ranged) Attack Speed for 6 seconds. Max stack bonus: +50 (melee) or +75 (ranged) range."
  },
  "fleet_footwork": {
    nameEn: "Fleet Footwork",
    category: "Keystone",
    tree: "Precision",
    image: "/images/runes/fleet_footwork.png",
    descriptionEn: "Moving and attacking builds Energy stacks. At 100 stacks, your next attack is Energized, healing you, granting movement speed, and restoring mana or energy. Healing: 15 - 85 (+30% bonus AD, +30% AP). Move speed: +20% for 1 second. Restores 8% missing mana or energy on champions. Healing is 35% effective for melee / 15% for ranged against minions or monsters."
  },
  "conqueror": {
    nameEn: "Conqueror",
    category: "Keystone",
    tree: "Precision",
    image: "/images/runes/conqueror.png",
    descriptionEn: "Hitting a champion with separate abilities or basic attacks grants stacks of Adaptive Force, up to 6. At max stacks, gain bonus Omnivamp. Stack bonus: 3 - 7 AD or 4 - 11 AP for 6 seconds. Max stack bonus: +9% (melee) / +5% (ranged) Omnivamp."
  },
  "grasp_of_the_undying": {
    nameEn: "Grasp of the Undying",
    category: "Keystone",
    tree: "Resolve",
    image: "/images/runes/grasp_of_the_undying.png",
    descriptionEn: "Every 3 seconds in combat, your next basic attack on a champion is empowered to deal 3% max health bonus magic damage, heal for 2.5% max health, and permanently increase your health by 10. Ranged champions: effects are reduced by 60%."
  },
  "guardian": {
    nameEn: "Guardian",
    category: "Keystone",
    tree: "Resolve",
    image: "/images/runes/guardian.png",
    descriptionEn: "Guard allies within 350 units and allies targeted by your abilities for 2.5s. If either takes damage, both gain a shield. Cooldown: 40 - 20s. Shield: 45 - 180 (+5% bonus health, +15% AP). Proc threshold: 70 - 240 post-mitigation damage."
  },
  "summon_aery": {
    nameEn: "Summon Aery",
    category: "Keystone",
    tree: "Sorcery",
    image: "/images/runes/summon_aery.png",
    descriptionEn: "Your attacks and abilities send Aery to target, shielding allies or damaging enemies. Damage: 15 - 70 (+20% bonus AD, +10% AP). Shield: 30 - 140 (+40% bonus AD, +20% AP). Aery cannot be sent out again until she returns."
  },
  "arcane_comet": {
    nameEn: "Arcane Comet",
    category: "Keystone",
    tree: "Sorcery",
    image: "/images/runes/arcane_comet.png",
    descriptionEn: "Damaging a champion with an ability hurls a comet at their location. Subsequent hits reduce comet cooldown. Damage: 18 - 95 (+3 per hit) (+35% bonus AD, +20% AP). Cooldown: 16 - 8 seconds (adaptive)."
  },
  "phase_rush": {
    nameEn: "Phase Rush",
    category: "Keystone",
    tree: "Sorcery",
    image: "/images/runes/phase_rush.png",
    descriptionEn: "Hitting a champion with 3 attacks or separate abilities within 4 seconds grants movement speed and basic ability cooldown reduction. Move Speed: 40% - 60% (melee) / 30% - 50% (ranged) for 3 seconds. Basic Ability Haste: +25. Cooldown: 12 seconds."
  },
  "first_strike": {
    nameEn: "First Strike",
    category: "Keystone",
    tree: "Inspiration",
    image: "/images/runes/first_strike.png",
    descriptionEn: "Damaging an enemy champion within 0.25 seconds of entering combat grants 10 gold and First Strike for 3 seconds, dealing 7% bonus true damage and converting damage dealt into gold. Gold converted: 100% (melee) / 85% (ranged) of bonus damage. Cooldown: 20 - 13 seconds."
  },
  "ice_overlord": {
    nameEn: "Ice Overlord",
    category: "Keystone",
    tree: "Resolve",
    image: "/images/runes/glacial_augment.png", // Map to Glacial Augment image since it's the reworked icon in WR, or aftershock if that's what it looks like. Let's make sure!
    descriptionEn: "Immobilizing an enemy champion creates an icy zone for 3 seconds that slows enemies by (20% + 1.5% bonus health). Additionally, gain a protective shield of 35 + 80% bonus resists for 2.5 seconds, exploding after a delay to deal 25 - 125 + 5% bonus health magic damage. Cooldown: 20 seconds."
  },

  // Domination
  "cheap_shot": {
    nameEn: "Cheap Shot",
    category: "Domination",
    tree: "Domination",
    image: "/images/runes/cheap_shot.png",
    descriptionEn: "Damaging movement-impaired champions deals 10 - 45 bonus true damage. Cooldown: 7s."
  },
  "sudden_impact": {
    nameEn: "Sudden Impact",
    category: "Domination",
    tree: "Domination",
    image: "/images/runes/sudden_impact.png",
    descriptionEn: "After exiting stealth or using a dash, leap, blink, or teleport, your next attack or ability within 4 seconds deals 10 - 80 bonus true damage. Cooldown: 10s. Level 5: deals +10 true damage. Level 9: deals +20 true damage and grants +10% move speed for 1.5 seconds."
  },
  "empowered_attack": {
    nameEn: "Empowered Attack",
    category: "Domination",
    tree: "Domination",
    image: "/images/runes/empowered_attack.png",
    descriptionEn: "Every 8 seconds, your next basic attack is empowered, dealing 35 - 50 bonus adaptive damage. 80% effective for ranged champions."
  },
  "chain_assault": {
    nameEn: "Chain Assault",
    category: "Domination",
    tree: "Domination",
    image: "/images/runes/chain_assault.png",
    descriptionEn: "Damaging an enemy champion with an active ability marks them. Your next 2 attacks or abilities deal 20 - 35 (+5% bonus AD, +2.5% AP) bonus adaptive damage. Cooldown: 15s."
  },
  "tyrant": {
    nameEn: "Tyrant",
    category: "Domination",
    tree: "Domination",
    image: "/images/runes/tyrant.png",
    descriptionEn: "Damaging an enemy champion below 50% health deals 30 - 50 (+7.5% bonus AD, +3.5% AP) bonus adaptive damage. Cooldown: 10 seconds."
  },
  "hubris": {
    nameEn: "Hubris",
    category: "Domination",
    tree: "Domination",
    image: "/images/runes/hubris.png",
    descriptionEn: "Takedowns on enemy champions within 3 seconds of damaging them grant 5 (+1 per champion killed) adaptive force for 30 seconds."
  },
  "eyeball_collector": {
    nameEn: "Eyeball Collector",
    category: "Domination",
    tree: "Domination",
    image: "/images/runes/eyeball_collector.png",
    descriptionEn: "Takedowns on champions or epic monsters permanently grant 2 Attack Damage or 4 Ability Power, stacking up to 8 times."
  },
  "ingenious_hunter": {
    nameEn: "Ingenious Hunter",
    category: "Domination",
    tree: "Domination",
    image: "/images/runes/ingenious_hunter.png",
    descriptionEn: "Gain 20 Item Ability Haste. Champion or epic monster takedowns grant an additional 5 Item Ability Haste, stacking up to 5 times."
  },
  "relentless_hunter": {
    nameEn: "Relentless Hunter",
    category: "Domination",
    tree: "Domination",
    image: "/images/runes/relentless_hunter.png",
    descriptionEn: "Gain 10 out-of-combat movement speed. Takedowns grant an additional 2 out-of-combat movement speed, stacking up to 5 times."
  },
  "zombie_ward": {
    nameEn: "Zombie Ward",
    category: "Domination",
    tree: "Domination",
    image: "/images/runes/zombie_ward.png",
    descriptionEn: "Clearing enemy wards spawns a friendly Zombie Ward for 120s. Grants 4 Attack Damage or 8 Ability Power per ward cleared, up to 5 stacks."
  },

  // Precision
  "brutal": {
    nameEn: "Brutal",
    category: "Precision",
    tree: "Precision",
    image: "/images/runes/brutal.png",
    descriptionEn: "Basic attacks on champions deal 6 (+8% bonus AD) bonus adaptive damage on-hit."
  },
  "triumph": {
    nameEn: "Triumph",
    category: "Precision",
    tree: "Precision",
    image: "/images/runes/triumph.png",
    descriptionEn: "Takedowns restore 10% of missing health and 10% of maximum mana/energy, and grant 35 movement speed for 2 seconds."
  },
  "battle_zeal": {
    nameEn: "Battle Zeal",
    category: "Precision",
    tree: "Precision",
    image: "/images/runes/battle-zeal.png", // Note: battle-zeal.png is on disk!
    descriptionEn: "While in combat with an enemy champion, gain 2% basic ability damage amplification every 1 second, stacking up to 3 times (maximum 6% amplification)."
  },
  "last_stand": {
    nameEn: "Last Stand",
    category: "Precision",
    tree: "Precision",
    image: "/images/runes/last_stand.png",
    descriptionEn: "Deal 5% - 11% increased damage to champions while you are below 60% health. Max damage gained at 30% health."
  },
  "cut_down": {
    nameEn: "Cut Down",
    category: "Precision",
    tree: "Precision",
    image: "/images/runes/cut_down.png",
    descriptionEn: "Deal 8% increased damage to champions who have more than 60% health."
  },
  "coup_de_grace": {
    nameEn: "Coup de Grace",
    category: "Precision",
    tree: "Precision",
    image: "/images/runes/coup_de_grace.png",
    descriptionEn: "Deal 8% more damage to champions who have less than 40% health."
  },
  "legend_alacrity": {
    nameEn: "Legend: Alacrity",
    category: "Precision",
    tree: "Precision",
    image: "/images/runes/legend_alacrity.png",
    descriptionEn: "Gain 3% Attack Speed. Takedowns on monsters, minions, or champions grant additional attack speed, up to 20%."
  },
  "legend_tenacity": {
    nameEn: "Legend: Tenacity",
    category: "Precision",
    tree: "Precision",
    image: "/images/runes/legend_tenacity.png",
    descriptionEn: "Gain 3% Tenacity and 3% Slow Resist. Takedowns grant progress up to an additional 15% Tenacity and 20% Slow Resist."
  },
  "legend_bloodline": {
    nameEn: "Legend: Bloodline",
    category: "Precision",
    tree: "Precision",
    image: "/images/runes/legend_bloodline.png",
    descriptionEn: "Gain 1% Omnivamp. Takedowns on monsters, minions, or champions grant additional Omnivamp, up to 7%."
  },

  // Resolve
  "demolish": {
    nameEn: "Demolish",
    category: "Resolve",
    tree: "Resolve",
    image: "/images/runes/demolish.png",
    descriptionEn: "While within 550 units of an enemy turret, charge an attack over 3s. The next attack deals 200 + 30% max health bonus physical damage. Cooldown: 35s."
  },
  "font_of_life": {
    nameEn: "Font of Life",
    category: "Resolve",
    tree: "Resolve",
    image: "/images/runes/font_of_life.png",
    descriptionEn: "Damaging a champion heals you and nearby allies. Ally heal: 3% max health + 15% AP. Self heal: 1% max health + 5% AP. Cooldown: 20s. 130% effective for melee champions. Will not trigger if health is full."
  },
  "courage_of_the_colossus": {
    nameEn: "Courage of the Colossus",
    category: "Resolve",
    tree: "Resolve",
    image: "/images/runes/courage_of_the_colossus.png",
    descriptionEn: "Immobilizing an enemy champion grants a shield of 25 - 45 + 1% max health for 3 seconds. Cooldown: 10 seconds."
  },
  "unshakeable": {
    nameEn: "Unshakeable",
    category: "Resolve",
    tree: "Resolve",
    image: "/images/runes/unshakeable.png",
    descriptionEn: "Gain 4% Armor and Magic Resistance. Gain an additional 3% Armor and Magic Resistance for each nearby enemy champion, stacking up to 3 times. When at maximum stacks, additionally gain 20% Slow Resist."
  },
  "second_wind": {
    nameEn: "Second Wind",
    category: "Resolve",
    tree: "Resolve",
    image: "/images/runes/second_wind.png",
    descriptionEn: "Regen 5 health every 5 seconds. Damaged by a champion heals 6 (+2% missing health) over 5 seconds. Double effect for melee."
  },
  "nullifying_orb": {
    nameEn: "Nullifying Orb",
    category: "Resolve",
    tree: "Resolve",
    image: "/images/runes/nullifying_orb.png",
    descriptionEn: "Taking damage from a champion that reduces your health below 35% grants a shield of 60 - 180 (adaptive) for 4s. Cooldown: 60s."
  },
  "bone_plating": {
    nameEn: "Bone Plating",
    category: "Resolve",
    tree: "Resolve",
    image: "/images/runes/bone_plating.png",
    descriptionEn: "After taking damage from a champion, the next 3 spells or attacks you receive from them within 1.5s deal 30 - 60 less damage. Cooldown: 30s."
  },
  "overgrowth": {
    nameEn: "Overgrowth",
    category: "Resolve",
    tree: "Resolve",
    image: "/images/runes/overgrowth.png",
    descriptionEn: "Permanently gain 3 max health for every 2 minions or 1 monster dying near you. At 30 stacks, gain an additional 3% max health."
  },
  "revitalize": {
    nameEn: "Revitalize",
    category: "Resolve",
    tree: "Resolve",
    image: "/images/runes/revitalize.png",
    descriptionEn: "Gain 5% Heal and Shield power. Heals and shields are 10% stronger on targets below 40% health."
  },
  "perseverance": {
    nameEn: "Perseverance",
    category: "Resolve",
    tree: "Resolve",
    image: "/images/runes/perseverance.png",
    descriptionEn: "Gain 10% Tenacity. When immobilized, gain 15 - 25 armor and magic resist for 1.5 seconds. Re-triggering resets the duration."
  },

  // Inspiration
  "axiom_arcanist": {
    nameEn: "Axiom Arcanist",
    category: "Inspiration",
    tree: "Inspiration",
    image: "/images/runes/axiom-arcanist.png", // axiom-arcanist.png is on disk!
    descriptionEn: "Ultimate damage, healing and shield increased by 10% (5% for AoE). Takedowns reduce ultimate remaining cooldown by 7%."
  },
  "manaflow_band": {
    nameEn: "Manaflow Band",
    category: "Inspiration",
    tree: "Inspiration",
    image: "/images/runes/manaflow_band.png",
    descriptionEn: "Hitting a champion with an ability permanently increases maximum mana by 30, up to 300 mana."
  },
  "botanist": {
    nameEn: "Botanist",
    category: "Inspiration",
    tree: "Inspiration",
    image: "/images/runes/botanist.png",
    descriptionEn: "Destroying plants grants 25 gold and empowers their effects. Soulflower: +100% gold. Honeyfruit: +20% healing. Scryer's Bloom: +20% vision duration. Blast Cone: +40% move speed for 2.5s after knockback."
  },
  "hextech_flashtraption": {
    nameEn: "Hextech Flashtraption",
    category: "Inspiration",
    tree: "Inspiration",
    image: "/images/runes/hextech_flashtraption.png",
    descriptionEn: "While Flash is on cooldown, it is replaced by Hexflash. Channel for up to 2s to blink. Cooldown: 25s."
  },
  "transcendence": {
    nameEn: "Transcendence",
    category: "Inspiration",
    tree: "Inspiration",
    image: "/images/runes/transcendence.png",
    descriptionEn: "Gain bonuses at levels: Level 1: +6 Ability Haste; Level 5: +6 Ability Haste; Level 9: Hitting a basic ability reduces its cooldown by 10% (cooldown 8s)."
  },
  "celerity": {
    nameEn: "Celerity",
    category: "Inspiration",
    tree: "Inspiration",
    image: "/images/runes/celerity.png",
    descriptionEn: "Gain 2% movement speed. All active movement speed bonuses are increased by 7%."
  },
  "absolute_focus": {
    nameEn: "Absolute Focus",
    category: "Inspiration",
    tree: "Inspiration",
    image: "/images/runes/absolute_focus.png",
    descriptionEn: "While above 65% health, gain 2 - 20 Attack Damage or 4 - 40 Ability Power (adaptive)."
  },
  "scorch": {
    nameEn: "Scorch",
    category: "Inspiration",
    tree: "Inspiration",
    image: "/images/runes/scorch.png",
    descriptionEn: "Damaging abilities burn enemy champions to deal 21 - 49 magic damage after 1 second. Cooldown: 8s."
  },
  "gathering_storm": {
    nameEn: "Gathering Storm",
    category: "Inspiration",
    tree: "Inspiration",
    image: "/images/runes/gathering_storm.png",
    descriptionEn: "Gain 2 AD or 4 AP (adaptive) after 6 minutes, increasing by 5/10, 9/18, 14/28 etc. every 3 minutes."
  },
  "ixtali_seedjar": {
    nameEn: "Ixtali Seedjar",
    category: "Inspiration",
    tree: "Inspiration",
    image: "/images/runes/ixtali_seedjar.png",
    descriptionEn: "Destroying a plant drops a seed you can collect to replace your trinket for 60s. Planting it grows a plant. Spawns after 2 minutes. Cooldown 30s per plant type. Blast Cone knockback range is increased."
  }
};

const finalRunes = [];

groupFiles.forEach((file, idx) => {
  const content = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(content);
  
  Object.entries(data).forEach(([key, val]) => {
    // Replace dashes with underscores for matching keys
    let normKey = key.replace(/-/g, '_');
    
    // Check if meta exists
    const meta = runeMeta[normKey];
    if (!meta) {
      console.log(`Warning: No meta found for key ${normKey} (${key})`);
      return;
    }

    // Clean up emojis and inline symbols in descriptionJa
    let desc = val.descriptionJa;
    desc = desc
      .replace(/💚/g, '体力') // replace green heart emoji with '体力'
      .replace(/🪄/g, '魔力')  // replace crystal wand emoji with '魔力'
      .replace(/\(◆\)/g, '(アダプティブ)')
      .replace(/◆/g, '(アダプティブ)')
      .replace(/\(🔼\)/g, '(レベルに応じて)')
      .replace(/🔼/g, '(レベルに応じて)')
      .trim();

    // Specific replacements for double terms if clean left some duplicates
    desc = desc
      .replace(/最大体力の(\d+)%体力/g, '最大体力の$1%')
      .replace(/減少体力の(\d+)%の体力/g, '減少体力の$1%')
      .replace(/最大体力の(\d+)%体力の耐久値/g, '最大体力の$1%の耐久値')
      .replace(/最大体力の(\d+)%の体力/g, '最大体力の$1%')
      .replace(/最大体力の35%未満になるダメージ/g, '最大体力の35%未満になるダメージ')
      .replace(/体力を回復する。味方:最大体力の3%/g, '味方を回復する。味方:最大体力の3%')
      .replace(/最大体力の(\d+)%未満の時に/g, '体力が$1%未満の時に')
      .replace(/最大体力最大体力/g, '最大体力')
      .replace(/体力回復効果またはシールドを付与した際に/g, '回復効果またはシールドを付与した際に')
      .replace(/最大体力回復量/g, '最大体力回復量')
      .replace(/レベル5:追加で10の確定ダメージを与える。レベル9:追加で20/g, 'レベル5: 追加で10の確定ダメージを与える。レベル9: 追加で20')
      .replace(/15-25\(レベル\)/g, '15-25(レベルに応じて)')
      .replace(/増加物理防御と増加魔法防御。/g, '増加物理防御と増加魔法防御。')
      .replace(/\+30%増加攻撃力\+30%魔力増加移動速度1秒間/g, '+30%増加攻撃力+30%魔力\n増加移動速度: 1秒間')
      .replace(/減少マナの8%または減少気の8%を回復する。ミニオン/g, '減少マナの8%または減少気の8%を回復する。\nミニオン')
      .replace(/3%増加する。周囲の敵チャンピオンの数が最大になると/g, '3%増加する。周囲の敵チャンピオンの数が最大になると')
      .replace(/最大体力が3%増加する/g, '最大体力が3%増加する')
      .replace(/最大💚/g, '最大体力')
      .replace(/最大体力/g, '最大体力')
      .replace(/最大体力の30%体力の物理ダメージ/g, '最大体力の30%の物理ダメージ')
      .replace(/最大体力の30%の物理ダメージ/g, '最大体力の30%の物理ダメージ')
      .replace(/最大体力の1%体力の耐久値/g, '最大体力の1%の耐久値')
      .replace(/最大体力の1%の耐久値/g, '最大体力の1%の耐久値')
      .replace(/体力回復量/g, '体力回復量')
      .replace(/5秒ごとに体力が5体力回復する/g, '5秒ごとに体力が5回復する')
      .replace(/5秒ごとに体力が5回復する/g, '5秒ごとに体力が5回復する')
      .replace(/5秒かけて6\(\+減少体力の2%\)の体力体力を回復する/g, '5秒かけて6(+減少体力の2%)の体力を回復する')
      .replace(/5秒かけて6\(\+減少体力の2%\)の体力を回復する/g, '5秒かけて6(+減少体力の2%)の体力を回復する')
      .replace(/増加攻撃力2-20\(レベル\)または魔力4-40\(レベル\)/g, '増加攻撃力2-20(レベルに応じて)または魔力4-40(レベルに応じて)')
      .replace(/増加攻撃力2-20\(レベルに応じて\)または魔力4-40\(レベルに応じて\)/g, '増加攻撃力2-20(レベルに応じて)または魔力4-40(レベルに応じて)')
      .replace(/最大体力の35%未満になるダメージ/g, '最大体力の35%未満になるダメージ');

    // Make sure nameJa is normalized (e.g. remove spaces or represent correctly)
    const officialNameJa = val.nameJa.replace(/\s+/g, '');

    finalRunes.push({
      id: normKey,
      nameJa: officialNameJa,
      nameEn: meta.nameEn,
      category: meta.category,
      tree: meta.tree,
      image: meta.image,
      descriptionJa: desc,
      descriptionEn: meta.descriptionEn
    });
  });
});

// Let's sort the final runes array: keystones first, then alphabetically, then others by tree
const categoryOrder = {
  "Keystone": 1,
  "Domination": 2,
  "Precision": 3,
  "Resolve": 4,
  "Inspiration": 5
};

finalRunes.sort((a, b) => {
  const orderA = categoryOrder[a.category] || 99;
  const orderB = categoryOrder[b.category] || 99;
  if (orderA !== orderB) return orderA - orderB;
  return a.id.localeCompare(b.id);
});

// Output formatted json to runes.json
fs.writeFileSync(destPath, JSON.stringify(finalRunes, null, 2), 'utf8');

console.log(`Successfully compiled ${finalRunes.length} runes to ${destPath}`);
