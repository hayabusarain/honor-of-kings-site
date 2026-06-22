import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Fetching DataDragon champion data...");
  // 最新のバージョンを取得
  const verRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
  const versions = await verRes.json();
  const latest = versions[0];
  
  // championFull (日本語) を取得
  const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/ja_JP/championFull.json`);
  const champData = await champRes.json();
  const champions = champData.data;

  // 比較しやすいように、スキル名とキャラクターキーのマッピングを作る
  // skillMap["断固たる一撃"] = "Garen"
  const nameToId = {};
  const champIconMap = {}; // championId -> { P: "...", Q: "..." }

  for (const [key, champ] of Object.entries(champions)) {
    // パッシブ
    if (champ.passive && champ.passive.name) {
      nameToId[champ.passive.name] = key;
    }
    // アクティブスキル
    champ.spells.forEach(spell => {
      nameToId[spell.name] = key;
    });

    // アイコンのマッピング (DataDragonベース)
    champIconMap[key] = {
      P: champ.passive ? `https://ddragon.leagueoflegends.com/cdn/${latest}/img/passive/${champ.passive.image.full}` : null,
      Q: champ.spells[0] ? `https://ddragon.leagueoflegends.com/cdn/${latest}/img/spell/${champ.spells[0].image.full}` : null,
      W: champ.spells[1] ? `https://ddragon.leagueoflegends.com/cdn/${latest}/img/spell/${champ.spells[1].image.full}` : null,
      E: champ.spells[2] ? `https://ddragon.leagueoflegends.com/cdn/${latest}/img/spell/${champ.spells[2].image.full}` : null,
      R: champ.spells[3] ? `https://ddragon.leagueoflegends.com/cdn/${latest}/img/spell/${champ.spells[3].image.full}` : null,
    };
  }

  const parsedDir = path.join(__dirname, '../src/data/parsed_skills');
  const files = fs.readdirSync(parsedDir).filter(f => f.endsWith('.json'));
  
  const allSkills = {};
  const unmapped = [];

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(parsedDir, file), 'utf-8'));
    let matchedId = null;

    // スキルのどれか一つの名前が nameToId にあれば、そのキャラと断定する
    for (const skill of data.skills) {
      if (nameToId[skill.name]) {
        matchedId = nameToId[skill.name];
      }
    }
    // 手動フォールバック (PCとワイリフで名前が違う、あるいはPCにいないキャラ)
    const manualMap = {
      "champ_005.json": "Shyvana",
      "champ_075.json": "Jhin",
      "champ_103.json": "Norra"
    };

    if (manualMap[file]) {
      matchedId = manualMap[file];
    }

    if (matchedId) {
      // アイコンURLを付与
      for (const skill of data.skills) {
        if (champIconMap[matchedId] && champIconMap[matchedId][skill.id]) {
          skill.icon = champIconMap[matchedId][skill.id];
        } else {
          skill.icon = null;
        }
      }
      allSkills[matchedId] = data.skills;
    } else {
      unmapped.push({ file, skills: data.skills.map(s => s.name) });
    }
  }

  // 出力
  const outPath = path.join(__dirname, '../public/data/all_skills.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(allSkills, null, 2));

  console.log(`✅ Mapped ${Object.keys(allSkills).length} champions.`);
  if (unmapped.length > 0) {
    console.log(`❌ Unmapped ${unmapped.length} champions:`);
    unmapped.forEach(u => {
      console.log(`  - ${u.file}: ${u.skills.join(', ')}`);
    });
  }
}

main().catch(console.error);
