const fs = require('fs');
const path = require('path');

async function main() {
  const latest = "14.10.1"; // Or fetch from ddragon
  const verRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
  const versions = await verRes.json();
  const currentVer = versions[0];

  const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${currentVer}/data/ja_JP/championFull.json`);
  const champData = await champRes.json();
  const champions = champData.data;

  const nameToId = {};
  const champIconMap = {};

  for (const [key, champ] of Object.entries(champions)) {
    if (champ.passive && champ.passive.name) {
      nameToId[champ.passive.name] = key;
    }
    champ.spells.forEach(spell => {
      nameToId[spell.name] = key;
    });

    champIconMap[key] = {
      P: champ.passive ? `https://ddragon.leagueoflegends.com/cdn/${currentVer}/img/passive/${champ.passive.image.full}` : null,
      Q: champ.spells[0] ? `https://ddragon.leagueoflegends.com/cdn/${currentVer}/img/spell/${champ.spells[0].image.full}` : null,
      W: champ.spells[1] ? `https://ddragon.leagueoflegends.com/cdn/${currentVer}/img/spell/${champ.spells[1].image.full}` : null,
      E: champ.spells[2] ? `https://ddragon.leagueoflegends.com/cdn/${currentVer}/img/spell/${champ.spells[2].image.full}` : null,
      R: champ.spells[3] ? `https://ddragon.leagueoflegends.com/cdn/${currentVer}/img/spell/${champ.spells[3].image.full}` : null,
    };
  }

  const parsedDir = path.join(__dirname, '../src/data/parsed_skills');
  const allSkillsPath = path.join(__dirname, '../public/data/all_skills.json');
  const jaPath = path.join(__dirname, '../public/data/skills/ja.json');

  const allSkills = JSON.parse(fs.readFileSync(allSkillsPath, 'utf-8'));
  const jaData = JSON.parse(fs.readFileSync(jaPath, 'utf-8'));

  function removeHtmlTags(text) {
    if (!text) return text;
    let plain = text.replace(/<br\s*\/?>/gi, '\n');
    plain = plain.replace(/<[^>]+>/g, '');
    return plain;
  }

  const targets = [];
  for (let i = 17; i <= 26; i++) {
    targets.push(`champ_0${i}.json`);
  }

  for (const file of targets) {
    const data = JSON.parse(fs.readFileSync(path.join(parsedDir, file), 'utf-8'));
    let matchedId = null;

    for (const skill of data.skills) {
      if (nameToId[skill.name]) {
        matchedId = nameToId[skill.name];
        break;
      }
    }

    if (!matchedId) {
      console.log(`❌ Could not map ${file}`);
      continue;
    }

    console.log(`✅ Mapped ${file} to ${matchedId}`);

    for (const skill of data.skills) {
      if (champIconMap[matchedId] && champIconMap[matchedId][skill.id]) {
        skill.icon = champIconMap[matchedId][skill.id];
      } else {
        skill.icon = null;
      }
      if (skill.description) {
        skill.description = removeHtmlTags(skill.description);
      }
    }

    allSkills[matchedId] = data.skills;
    jaData[matchedId] = data.skills;
  }

  fs.writeFileSync(allSkillsPath, JSON.stringify(allSkills, null, 2));
  fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2));

  console.log('Update complete!');
}

main().catch(console.error);
