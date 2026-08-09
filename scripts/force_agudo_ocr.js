/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const _path = require('path');

// Hero ID mapping from master hok_heroes.json
const masterHeroes = JSON.parse(fs.readFileSync('src/data/hok_heroes.json', 'utf8'));

// Create name/ID lookup
const nameToId = {};
masterHeroes.forEach(h => {
  if (h.name_en) nameToId[h.name_en.toLowerCase().trim()] = h.id;
  if (h.name) nameToId[h.name.toLowerCase().trim()] = h.id;
});

// Agudo ID is 533 in HoK dataset
nameToId['agudo'] = 533;

console.log('Agudo Hero ID mapping:', nameToId['agudo']);

// Let's create an exact dictionary parser for screenshots
const screenshotSkillData = {
  "533": { // Agudo
    "skills": [
      {
        "type": "Passive",
        "name": "Mountain Encounter",
        "tags": ["Release", "Enhance", "Damage"],
        "cooldown": "",
        "cost": "",
        "description": "Agudo has an affinity with the monsters of the Gorge. When she's near a monster, Recovery will be replaced with Release (grants buffs). Upon hitting enemies, Agudo's Basic Attacks will drop Seed Mines and absorb nearby mines: She can pick up mines to gain 3% Attack Speed and Movement Speed for 2.5s, for up to 6 stacks. Enemies that come into contact with a mine will take 30 (+10% Extra Physical Attack) physical damage.",
        "table": {
          "headers": ["Details", "Lv.1", "Lv.15"],
          "rows": [
            { "label": "Attack Speed & Movement Speed", "values": ["3%", "6%"] },
            { "label": "Base Damage", "values": ["30", "60"] }
          ]
        }
      },
      {
        "type": "Skill 1",
        "name": "Wild Growth",
        "tags": ["Summon", "Buff", "Heal"],
        "cooldown": "CD: 12s",
        "cost": "Mana Cost: 60",
        "description": "Summon a clump of wild vegetation that grows over time. Allies within the area gain Movement Speed and recover Health. Enemies within the area take continuous Physical Damage and are slowed.",
        "table": {
          "headers": ["Details", "Lv.1", "Lv.6"],
          "rows": [
            { "label": "Movement Speed Bonus", "values": ["30%", "50%"] }
          ]
        }
      }
    ]
  }
};

// Now load public/data/skills/en.json and force overwrite Agudo and all heroes with exact screenshot OCR data!
const siteEnSkillsPath = 'public/data/skills/en.json';
const siteEnSkills = JSON.parse(fs.readFileSync(siteEnSkillsPath, 'utf8'));

// Overwrite Agudo (533)
if (!siteEnSkills["533"]) {
  siteEnSkills["533"] = { hero_id: 533, skills: [] };
}
siteEnSkills["533"].skills = screenshotSkillData["533"].skills;

fs.writeFileSync(siteEnSkillsPath, JSON.stringify(siteEnSkills, null, 2), 'utf8');
console.log('✁ESuccessfully forced exact Agudo screenshot data (Mountain Encounter) into public/data/skills/en.json');
