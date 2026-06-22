const fs = require('fs');
const https = require('https');
const path = require('path');

async function download(url, filePath) {
  return new Promise((resolve, reject) => {
    function get(url) {
      https.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          get(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', reject);
    }
    get(url);
  });
}

const runesList = [
  // Keystones
  { id: "electrocute", file: "electrocute.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png" },
  { id: "dark_harvest", file: "dark_harvest.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png" },
  { id: "empowerment", file: "empowerment.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png" },
  { id: "lethal_tempo", file: "lethal_tempo.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png" },
  { id: "fleet_footwork", file: "fleet_footwork.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png" },
  { id: "conqueror", file: "conqueror.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Conqueror/Conqueror.png" },
  { id: "grasp_of_the_undying", file: "grasp_of_the_undying.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png" },
  { id: "guardian", file: "guardian.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Guardian/Guardian.png" },
  { id: "summon_aery", file: "summon_aery.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/SummonAery/SummonAery.png" },
  { id: "arcane_comet", file: "arcane_comet.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png" },
  { id: "phase_rush", file: "phase_rush.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/PhaseRush/StormraidersSurgeRuneIcon2.png" },
  { id: "first_strike", file: "first_strike.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png" },
  { id: "ice_overlord", file: "glacial_augment.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png" },

  // Domination
  { id: "cheap_shot", file: "cheap_shot.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/CheapShot/CheapShot.png" },
  { id: "sudden_impact", file: "sudden_impact.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png" },
  { id: "empowered_attack", file: "empowered_attack.png", url: "https://static.wikia.nocookie.net/leagueoflegends/images/1/19/Empowered_Attack_%28Wild_Rift%29_rune.png/revision/latest" },
  { id: "chain_assault", file: "chain_assault.png", url: "https://static.wikia.nocookie.net/leagueoflegends/images/f/fa/Chain_Assault_rune.png/revision/latest" },
  { id: "tyrant", file: "tyrant.png", url: "https://static.wikia.nocookie.net/leagueoflegends/images/b/b3/Tyrant_rune.png/revision/latest" },
  { id: "hubris", file: "hubris.png", url: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/6697.png" },
  { id: "eyeball_collector", file: "eyeball_collector.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/EyeballCollector/EyeballCollector.png" },
  { id: "ingenious_hunter", file: "ingenious_hunter.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/IngeniousHunter/IngeniousHunter.png" },
  { id: "relentless_hunter", file: "relentless_hunter.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/RelentlessHunter/RelentlessHunter.png" },
  { id: "zombie_ward", file: "zombie_ward.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/ZombieWard/ZombieWard.png" },

  // Precision
  { id: "brutal", file: "brutal.png", url: "https://static.wikia.nocookie.net/leagueoflegends/images/c/ca/Brutal_%28Wild_Rift%29_rune.png/revision/latest" },
  { id: "triumph", file: "triumph.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Triumph.png" },
  { id: "battle_zeal", file: "battle-zeal.png", url: "https://static.wikia.nocookie.net/leagueoflegends/images/a/a2/Battle_Zeal_rune.png/revision/latest" },
  { id: "last_stand", file: "last_stand.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/LastStand/LastStand.png" },
  { id: "cut_down", file: "cut_down.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/CutDown/CutDown.png" },
  { id: "coup_de_grace", file: "coup_de_grace.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png" },
  { id: "legend_alacrity", file: "legend_alacrity.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png" },
  { id: "legend_tenacity", file: "legend_tenacity.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendTenacity/LegendTenacity.png" },
  { id: "legend_bloodline", file: "legend_bloodline.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendBloodline/LegendBloodline.png" },

  // Resolve
  { id: "demolish", file: "demolish.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Demolish/Demolish.png" },
  { id: "font_of_life", file: "font_of_life.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/FontOfLife/FontOfLife.png" },
  { id: "courage_of_the_colossus", file: "courage_of_the_colossus.png", url: "https://static.wikia.nocookie.net/leagueoflegends/images/f/f3/Courage_of_the_colossus_%28Wild_Rift%29_rune.png/revision/latest" },
  { id: "unshakeable", file: "unshakeable.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Unflinching/Unflinching.png" },
  { id: "second_wind", file: "second_wind.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/SecondWind/SecondWind.png" },
  { id: "nullifying_orb", file: "nullifying_orb.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/NullifyingOrb/NullifyingOrb.png" },
  { id: "bone_plating", file: "bone_plating.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/BonePlating/BonePlating.png" },
  { id: "overgrowth", file: "overgrowth.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Overgrowth/Overgrowth.png" },
  { id: "revitalize", file: "revitalize.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Revitalize/Revitalize.png" },
  { id: "perseverance", file: "perseverance.png", url: "https://static.wikia.nocookie.net/leagueoflegends/images/3/3e/Perseverance_%28Wild_Rift%29_rune.png/revision/latest" },

  // Inspiration
  { id: "axiom_arcanist", file: "axiom-arcanist.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/NullifyingOrb/Axiom_Arcanist.png" },
  { id: "manaflow_band", file: "manaflow_band.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png" },
  { id: "botanist", file: "botanist.png", url: "https://static.wikia.nocookie.net/leagueoflegends/images/a/ab/Botanist_rune.png/revision/latest" },
  { id: "hextech_flashtraption", file: "hextech_flashtraption.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/HextechFlashtraption/HextechFlashtraption.png" },
  { id: "transcendence", file: "transcendence.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Transcendence/Transcendence.png" },
  { id: "celerity", file: "celerity.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Celerity/CelerityTemp.png" },
  { id: "absolute_focus", file: "absolute_focus.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png" },
  { id: "scorch", file: "scorch.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Scorch/Scorch.png" },
  { id: "gathering_storm", file: "gathering_storm.png", url: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png" },
  { id: "ixtali_seedjar", file: "ixtali_seedjar.png", url: "https://static.wikia.nocookie.net/leagueoflegends/images/e/e1/Ixtali_Seedjar_rune.png/revision/latest" }
];

async function main() {
  const targetDir = 'public/images/runes';
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`Starting to download ${runesList.length} high-res rune images to ${targetDir}...`);

  let count = 0;
  for (const item of runesList) {
    const dest = path.join(targetDir, item.file);
    try {
      console.log(`[${++count}/${runesList.length}] Downloading ${item.id} -> ${dest}...`);
      await download(item.url, dest);
      console.log(`  Success: ${item.file}`);
    } catch (e) {
      console.error(`  Failed to download ${item.file}: ${e.message}`);
    }
  }

  console.log("All high-res downloads completed!");
}

main();
