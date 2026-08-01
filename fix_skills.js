const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'public/data/skills/en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Fix Japanese text and some basic empty fields
const textFixes = {
  "108": { "strategy.lateGame": "In the late game, with full equipment, skill 2's magic damage and stun become a huge threat. Poke from a distance before team fights to whittle down enemy HP. If you can land skill 2 and stun the enemy carry, you can instantly turn the tide in your favor. Avoid pushing too far forward and make sure to position yourself to take full advantage of your range." },
  "109": { "hero_name": "Daji" },
  "117": { "meta.synergy.[0].hero_name": "Daji" },
  "134": { "meta.synergy.[1].hero_name": "Daji" },
  "135": { "meta.counters.[0].hero_name": "Lan" },
  "140": { "meta.counters.[1].hero_name": "Daji" },
  "172": { "meta.counters.[1].hero_name": "Lan" },
  "198": { "skill2.table.headers.[0]": "Lv.1" },
  "199": { "meta.counters.[1].hero_name": "Daji" },
  "501": { "meta.counters.[1].hero_name": "Daji" },
  "514": { "meta.synergy.[0].hero_name": "Lan" },
  "528": { "hero_name": "Lan" },
  "538": { "skill2.forms.[1].form_name": "Resonance - 2 stacks: Eagerness - Castle Destruction" },
  "558": { "meta.counters.[1].hero_name": "Daji" }
};

for (const [id, fixes] of Object.entries(textFixes)) {
  for (const [pathStr, value] of Object.entries(fixes)) {
    const keys = pathStr.split('.').map(k => k.replace(/\[(\d+)\]/, '$1'));
    let obj = enData[id];
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
  }
}

// Fix missing skill data for 174 (Consort Yu)
if (enData["174"]) {
  enData["174"].hero_name = "Consort Yu";
  enData["174"].passive = {
    name: "Leaves of Autumn",
    description: "Consort Yu has a 25% chance to shoot 2 arrows at the same time, dealing physical damage and reducing enemy movement speed by 15% for 2s.",
    cooldown: "0s"
  };
  enData["174"].skill1 = {
    name: "Piercing Arrow",
    cooldown: "5s",
    description: "Consort Yu charges up and fires a penetrating arrow, dealing physical damage to enemies in its path."
  };
  enData["174"].skill2 = {
    name: "Wind of the West",
    cooldown: "10s",
    description: "Consort Yu gains increased movement speed and becomes immune to physical damage for 2 seconds."
  };
  enData["174"].skill3 = {
    name: "Array of the East",
    cooldown: "20s",
    description: "Consort Yu leaps backwards from the target, stunning them, dealing physical damage, and gaining attack speed."
  };
}

// Fix missing skill data for 175 (Zhong Kui)
if (enData["175"]) {
  enData["175"].hero_name = "Zhong Kui";
  enData["175"].passive = {
    name: "Soul Eater",
    description: "Zhong Kui's skills heal him.",
    cooldown: "0s"
  };
  enData["175"].skill1 = {
    name: "Void Quake",
    cooldown: "4s",
    description: "Zhong Kui stomps the ground, dealing magic damage and slowing enemies in an area."
  };
  enData["175"].skill2 = {
    name: "Demon Catcher",
    cooldown: "12s",
    description: "Zhong Kui throws a hook in a direction, pulling the first enemy hit towards him and dealing magic damage."
  };
  enData["175"].skill3 = {
    name: "Domain of Devour",
    cooldown: "40s",
    description: "Zhong Kui channels and repeatedly swallows enemies in front of him, dealing magic damage and giving himself a shield."
  };
}

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
console.log('Fixed en.json');
