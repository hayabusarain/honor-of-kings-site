const fs = require('fs');

const enPath = 'public/data/guide/en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

en.glossary = [
  {
    term: "CS (Creep Score)",
    definition: "The total number of enemy minions and jungle monsters slain by a player, essential for computing last hits and farming efficiency."
  },
  {
    term: "Gank",
    definition: "An ambush maneuver where junglers or roamers surprise an enemy lane to create a numerical advantage and secure kills."
  },
  {
    term: "Roam",
    definition: "Leaving one's assigned lane to travel across the map and assist teammates in other lanes or invade the enemy jungle."
  },
  {
    term: "CC (Crowd Control)",
    definition: "Abilities that restrict or impede enemy movement and actions, including Stuns, Knockups, Silences, Taunts, and Slows."
  },
  {
    term: "Kiting",
    definition: "Attacking while moving backward or sideways to maintain a safe distance from enemy melee threats, heavily used by Marksmen."
  },
  {
    term: "Invade",
    definition: "Entering the enemy's jungle territory to steal neutral camps (especially Red/Blue buffs) or kill the enemy jungler."
  },
  {
    term: "Freeze (Lane Control)",
    definition: "Holding the minion clash point right outside your turret range to farm safely while denying the enemy farm and experience."
  },
  {
    term: "Peel",
    definition: "Using crowd control or defensive abilities to keep enemy assassins and divers away from your vulnerable Marksman/Mage carries."
  },
  {
    term: "Dive (Turret Dive)",
    definition: "Aggressively pursuing and killing an enemy champion under their own turret while taking turret damage."
  },
  {
    term: "Scaling",
    definition: "How much a hero increases in power as the game progresses with levels and core item purchases."
  },
  {
    term: "Snowball",
    definition: "Leveraging small early advantages (kills, last hits, plates) into exponentially larger leads to swiftly close out the game."
  },
  {
    term: "Sustain",
    definition: "A hero's ability to regenerate health and mana over time to remain active on the map without constantly recalling."
  },
  {
    term: "Poke",
    definition: "Using long-range abilities to deal damage and wear down enemy health bars safely before initiating a teamfight."
  },
  {
    term: "Burst Damage",
    definition: "Dealing a massive amount of damage in a fraction of a second, typically executed by Assassins and Mages."
  },
  {
    term: "Engage",
    definition: "Intentionally initiating a teamfight using hard CC or initiation spells, typically performed by Tank frontliners."
  },
  {
    term: "Disengage",
    definition: "Using mobility, shields, or CC to escape an unfavorable teamfight or reset the engagement."
  },
  {
    term: "Frontline",
    definition: "High-durability heroes (Tanks/Fighters) who stand at the front to absorb enemy damage and protect their backline."
  },
  {
    term: "Backline",
    definition: "Fragile high-damage carries (Marksmen/Mages) who position safely behind frontliners to output sustained DPS."
  },
  {
    term: "Flank",
    definition: "Approaching a teamfight from the side or behind to bypass the enemy tank frontline and assassinate squishy carries."
  },
  {
    term: "Turtling",
    definition: "Adopting a defensive playstyle by remaining safely under turrets or inside the base when playing from behind."
  },
  {
    term: "Inhibitor Turret",
    definition: "The final inner turret protecting the base crystal. Destroying it spawns powerful Super Minions in that lane."
  },
  {
    term: "Leash",
    definition: "Helping your jungler clear their first jungle buff faster by dealing a few initial hits without stealing XP or gold."
  },
  {
    term: "Macro",
    definition: "Overall high-level strategic awareness, including map control, objective timing, split-pushing, and lane rotations."
  },
  {
    term: "Micro",
    definition: "Individual mechanical skill, including skillshot accuracy, reaction time, dodging, and animation canceling."
  },
  {
    term: "Meta",
    definition: "The Most Effective Tactic Available—the current optimal strategies, hero picks, and builds in the current game patch."
  }
];

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');

// Verify 0 Japanese characters remaining
const str = JSON.stringify(en, null, 2);
const jaRegex = /[\u3040-\u30ff\u4e00-\u9faf]/g;
const matches = str.match(jaRegex);

console.log('Japanese characters count in en.json AFTER fix:', matches ? matches.length : 0);
