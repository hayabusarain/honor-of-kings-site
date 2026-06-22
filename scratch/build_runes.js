const fs = require('fs');
const https = require('https');
const path = require('path');

const ocrPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\b480f433-46b1-471d-8680-a277fd5851f3\\\\ocr_results.json';
const ddragonJaPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\b480f433-46b1-471d-8680-a277fd5851f3\\\\runesReforged_ja.json';
const ddragonEnPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\b480f433-46b1-471d-8680-a277fd5851f3\\\\runesReforged_en.json';
const wikiIconsMapPath = 'scratch/rune_icons_map.json';

const targetRunesJson = 'src/data/runes.json';

const runeCatalog = [
  // Keystones
  { id: 'electrocute', nameEn: 'Electrocute', nameJa: '電撃', category: 'Keystone', tree: 'Domination' },
  { id: 'dark_harvest', nameEn: 'Dark Harvest', nameJa: '魂の収穫', category: 'Keystone', tree: 'Domination' },
  { id: 'phase_rush', nameEn: 'Phase Rush', nameJa: 'フェイズラッシュ', category: 'Keystone', tree: 'Sorcery' },
  { id: 'conqueror', nameEn: 'Conqueror', nameJa: '征服者', category: 'Keystone', tree: 'Precision' },
  { id: 'fleet_footwork', nameEn: 'Fleet Footwork', nameJa: 'フリートフットワーク', category: 'Keystone', tree: 'Precision' },
  { id: 'lethal_tempo', nameEn: 'Lethal Tempo', nameJa: 'リーサルテンポ', category: 'Keystone', tree: 'Precision' },
  { id: 'empowerment', nameEn: 'Empowerment', nameJa: 'エンパワーメント', category: 'Keystone', tree: 'Precision' },
  { id: 'grasp_of_the_undying', nameEn: 'Grasp of the Undying', nameJa: '不死者の握撃', category: 'Keystone', tree: 'Resolve' },
  { id: 'aftershock', nameEn: 'Aftershock', nameJa: 'アフターショック', category: 'Keystone', tree: 'Resolve' },
  { id: 'guardian', nameEn: 'Guardian', nameJa: 'ガーディアン', category: 'Keystone', tree: 'Resolve' },
  { id: 'summon_aery', nameEn: 'Summon Aery', nameJa: 'エアリー召喚', category: 'Keystone', tree: 'Sorcery', aliasesJa: ['エアリー'] },
  { id: 'arcane_comet', nameEn: 'Arcane Comet', nameJa: '秘儀の彗星', category: 'Keystone', tree: 'Sorcery' },
  { id: 'first_strike', nameEn: 'First Strike', nameJa: 'ファーストストライク', category: 'Keystone', tree: 'Inspiration' },
  { id: 'glacial_augment', nameEn: 'Glacial Augment', nameJa: '氷の暴君', category: 'Keystone', tree: 'Inspiration', aliasesJa: ['アイスオーバーロード'] },

  // Domination
  { id: 'cheap_shot', nameEn: 'Cheap Shot', nameJa: '追い打ち', category: 'Domination', tree: 'Domination' },
  { id: 'sudden_impact', nameEn: 'Sudden Impact', nameJa: 'サドンインパクト', category: 'Domination', tree: 'Domination' },
  { id: 'empowered_attack', nameEn: 'Empowered Attack', nameJa: '心撃', category: 'Domination', tree: 'Domination' },
  { id: 'chain_assault', nameEn: 'Chain Assault', nameJa: 'チェーンアサルト', category: 'Domination', tree: 'Domination' },
  { id: 'tyrant', nameEn: 'Tyrant', nameJa: 'タイラント', category: 'Domination', tree: 'Domination' },
  { id: 'hubris', nameEn: 'Hubris', nameJa: 'ヒュブリス', category: 'Domination', tree: 'Domination', aliasesJa: ['ヒュプリ', 'ヒュプリス'] },
  { id: 'eyeball_collector', nameEn: 'Eyeball Collector', nameJa: '目玉コレクター', category: 'Domination', tree: 'Domination' },
  { id: 'zombie_ward', nameEn: 'Zombie Ward', nameJa: 'ゾンビワード', category: 'Domination', tree: 'Domination' },
  { id: 'ingenious_hunter', nameEn: 'Ingenious Hunter', nameJa: '巧妙な賞金首狩り', category: 'Domination', tree: 'Domination', aliasesJa: ['巧妙な賞金'] },
  { id: 'relentless_hunter', nameEn: 'Relentless Hunter', nameJa: '執拗な賞金首狩り', category: 'Domination', tree: 'Domination', aliasesJa: ['執拗な賞金'] },

  // Precision
  { id: 'brutal', nameEn: 'Brutal', nameJa: 'ブルータル', category: 'Precision', tree: 'Precision', aliasesJa: ['プルータル'] },
  { id: 'triumph', nameEn: 'Triumph', nameJa: '凱旋', category: 'Precision', tree: 'Precision', aliasesJa: ['し旋'] },
  { id: 'giant_slayer', nameEn: 'Giant Slayer', nameJa: 'ジャイアントスレイヤー', category: 'Precision', tree: 'Precision' },
  { id: 'last_stand', nameEn: 'Last Stand', nameJa: '背水の陣', category: 'Precision', tree: 'Precision', aliasesJa: ['背水の邵'] },
  { id: 'cut_down', nameEn: 'Cut Down', nameJa: '切り崩し', category: 'Precision', tree: 'Precision' },
  { id: 'coup_de_grace', nameEn: 'Coup de Grace', nameJa: '最期の慈悲', category: 'Precision', tree: 'Precision' },
  { id: 'legend_alacrity', nameEn: 'Legend: Alacrity', nameJa: 'レジェンド: 迅速', category: 'Precision', tree: 'Precision' },
  { id: 'legend_tenacity', nameEn: 'Legend: Tenacity', nameJa: 'レジェンド: 強靭', category: 'Precision', tree: 'Precision', aliasesJa: ['強靭'] },
  { id: 'legend_bloodline', nameEn: 'Legend: Bloodline', nameJa: 'レジェンド: 血脈', category: 'Precision', tree: 'Precision' },

  // Resolve
  { id: 'demolish', nameEn: 'Demolish', nameJa: '打ちこわし', category: 'Resolve', tree: 'Resolve', aliasesJa: ['打ちこわし', '打ちはわし'] },
  { id: 'font_of_life', nameEn: 'Font of Life', nameJa: '生命の泉', category: 'Resolve', tree: 'Resolve' },
  { id: 'shield_bash', nameEn: 'Shield Bash', nameJa: 'シールドバッシュ', category: 'Resolve', tree: 'Resolve' },
  { id: 'courage_of_the_colossus', nameEn: 'Courage of the Colossus', nameJa: '巨人の勇気', category: 'Resolve', tree: 'Resolve' },
  { id: 'unshakeable', nameEn: 'Unshakeable', nameJa: '堅忍不抜', category: 'Resolve', tree: 'Resolve' },
  { id: 'second_wind', nameEn: 'Second Wind', nameJa: '息継ぎ', category: 'Resolve', tree: 'Resolve' },
  { id: 'nullifying_orb', nameEn: 'Nullifying Orb', nameJa: '魔除けのオーブ', category: 'Resolve', tree: 'Resolve', aliasesJa: ['魔除けのオ'] },
  { id: 'bone_plating', nameEn: 'Bone Plating', nameJa: 'ボーンアーマー', category: 'Resolve', tree: 'Resolve', aliasesJa: ['ポーンアーマー'] },
  { id: 'overgrowth', nameEn: 'Overgrowth', nameJa: '超成長', category: 'Resolve', tree: 'Resolve' },
  { id: 'revitalize', nameEn: 'Revitalize', nameJa: '生気付与', category: 'Resolve', tree: 'Resolve' },
  { id: 'perseverance', nameEn: 'Perseverance', nameJa: '忍耐', category: 'Resolve', tree: 'Resolve' },

  // Inspiration
  { id: 'sweet_tooth', nameEn: 'Sweet Tooth', nameJa: '甘党', category: 'Inspiration', tree: 'Inspiration' },
  { id: 'hextech_flashtraption', nameEn: 'Hextech Flashtraption', nameJa: 'ヘクスフラッシュ', category: 'Inspiration', tree: 'Inspiration', aliasesJa: ['ヘクスフラッシュ', 'クスフラッシュ'] },
  { id: 'item_crafting', nameEn: 'Item Crafting', nameJa: 'ポータブルヘイスト', category: 'Inspiration', tree: 'Inspiration' },
  { id: 'futures_market', nameEn: 'Future\'s Market', nameJa: '先行投資', category: 'Inspiration', tree: 'Inspiration' },
  { id: 'transcendence', nameEn: 'Transcendence', nameJa: '至高', category: 'Inspiration', tree: 'Inspiration', aliasesJa: ['至高', '〒高'] },
  { id: 'pathfinder', nameEn: 'Pathfinder', nameJa: '追跡者', category: 'Inspiration', tree: 'Inspiration' },
  { id: 'nimbus_cloak', nameEn: 'Nimbus Cloak', nameJa: 'ニンバスクローク', category: 'Inspiration', tree: 'Inspiration', aliasesJa: ['ニンバス', 'ニン′、ス'] },
  { id: 'scorch', nameEn: 'Scorch', nameJa: '追火', category: 'Inspiration', tree: 'Inspiration' },
  { id: 'gathering_storm', nameEn: 'Gathering Storm', nameJa: '強まる嵐', category: 'Inspiration', tree: 'Inspiration' }
];

const customDescriptionsEn = {
  chain_assault: "Dealing damage to an enemy champion with an active ability marks them. Your next 2 attacks or active abilities against them deal 20–35 (+5% bonus AD + 2.5% AP) bonus adaptive damage. (15s cooldown)",
  tyrant: "Dealing damage to an enemy champion below 50% health deals 30–50 (+7.5% bonus AD + 3.5% AP) bonus adaptive damage (10s cooldown).",
  hubris: "Takedowns on enemy champions within 3 seconds of damaging them grant 5 (+ 1 per champion killed) adaptive force for 30 seconds.",
  botanist: "Destroying a plant grants 25 gold and enhanced plant effects: Honeyfruit restores 20% more health; Scryer's Bloom reveals for 20% longer; Blast Cone grants 40% movement speed for 2.5 seconds after knockback; Soul Flowers near towers grant 100% bonus gold.",
  courage_of_the_colossus: "Immobilizing an enemy champion grants a shield of 25–45 (+8% bonus AD + 5% AP) (+3% max health) for 3 seconds. (10s cooldown)",
  perseverance: "Gain 10% Tenacity. Upon receiving an immobilizing effect, gain 15–25 armor and magic resist for 1.5 seconds. Re-triggering resets the duration.",
  item_crafting: "Allows you to purchase items outside the fountain for an extra 150 gold fee, but with a 150-second cooldown.",
  unshakeable: "Gain 5% Tenacity and Slow Resist, up to 20% based on missing health.",
  sweet_tooth: "Increases Honeyfruit healing by 20%. Each Honeyfruit eaten also grants 15 gold.",
  pathfinder: "Gain 9% increased movement speed in the river, brush, and jungle when out of combat.",
  shield_bash: "After gaining a shield, your next basic attack deals 5–30 (+2.5% bonus health) (+15% shield amount) bonus adaptive damage.",
  empowered_attack: "Every 10 seconds, your next basic attack is empowered, dealing 35-75 (+20% bonus AD + 10% AP) bonus adaptive damage.",
  item_crafting: "Allows you to purchase items outside the fountain for an extra 150 gold fee, but with a 150-second cooldown.",
  giant_slayer: "Deal up to 14% bonus physical and magic damage to champions based on how much more max health they have than you.",
  glacial_augment: "Immobilizing an enemy champion creates 3 icy beams that slow nearby enemies and reduce their damage to your allies."
};

const customDescriptionsJa = {
  chain_assault: "発動スキルで敵にダメージを与えると、その敵に印がつき、次の2回の攻撃または発動スキルで、(20-35 + 5%増加物理攻撃力 + 2.5%魔力)のアダプティブダメージを与える。(クールダウン15秒)",
  tyrant: "体力が50%未満のチャンピオンにダメージを与えると、(30-50 + 7.5%増加物理攻撃力 + 3.5%魔力)の追加アダプティブダメージを与える(クールダウン10秒)。",
  hubris: "敵チャンピオンにダメージを与えてから3秒以内にキルまたはアシストを奪うと、30秒間、(5 + 自分がキルしたチャンピオン1体ごとに1)のアダプティブフォースを獲得する。",
  botanist: "植物を破壊すると、25ゴールドと強化された植物の効果を獲得する。タワーの近くにあるソウルフラワーも追加ボーナスを付与する。\nソウルフラワー: 100%の追加ゴールドを獲得する。\nハニーフルーツ: 消費すると体力回復量が20%増加する。\nスクライヤープルーム: 破壊すると、視界確保の効果時間が20%増加する。\nブラストコーン: ノックバック後の2.5秒間、移動速度が40%増加する。",
  courage_of_the_colossus: "敵チャンピオンに移動不能効果を付与すると、3秒間、(25-45 + 8%増加物理攻撃力 + 5%魔力 + 最大体力の3%)のシールドを獲得する。(クールダウン10秒)",
  perseverance: "行動妨害耐性が10%増加する。移動不能効果を受けると1.5秒間、物理防御と魔法防御が15-25増加する。移動不能効果を複数回受けると効果時間がリセットされる。",
  item_crafting: "リスポーン地点（プラットフォーム）の外でもアイテムを購入できるようになる。ただし、購入ごとに150ゴールドの追加料金が発生し、150秒のクールダウンに入る。",
  unshakeable: "行動妨害耐性とスロウ耐性が5%増加する。自身の減少体力に応じて最大20%まで増加する。",
  sweet_tooth: "ハニーフルーツの回復効果が20%増加し、ハニーフルーツを食べるたびに15ゴールドを獲得する。",
  pathfinder: "非戦闘時に川、ブッシュ、ジャングルの中を移動する際、移動速度が9%増加する。",
  shield_bash: "シールドを獲得すると、敵チャンピオンに対する次の通常攻撃が強化され、(5-30 + 増加体力の2.5% + シールド量の15%)の追加アダプティブダメージを与える。",
  empowered_attack: "10秒ごとに次の通常攻撃が強化され、(35-75 + 20%増加物理攻撃力 + 10%魔力)の追加アダプティブダメージを与える。",
  giant_slayer: "対象の最大体力が自分より多い場合、その差に応じて与える物理・魔法ダメージが最大14%増加する。",
  glacial_augment: "敵チャンピオンに移動不能効果を与えると、対象から3本の冷気の光線が発射されてスロウゾーンを形成し、ゾーン内の敵のスロウ効果と、その敵が味方に与えるダメージを15%軽減させる。"
};

// Step 1: Read OCR data and DDragon reference
let ocrContent = fs.readFileSync(ocrPath, 'utf8');
if (ocrContent.charCodeAt(0) === 0xFEFF) ocrContent = ocrContent.slice(1);
const ocrResults = JSON.parse(ocrContent);

const jaDDragon = JSON.parse(fs.readFileSync(ddragonJaPath, 'utf8'));
const enDDragon = JSON.parse(fs.readFileSync(ddragonEnPath, 'utf8'));

// Flatten DDragon Perks
const ddragonMap = new Map();
jaDDragon.forEach(style => {
  const enStyle = enDDragon.find(s => s.id === style.id);
  style.slots.forEach((slot, slotIdx) => {
    slot.runes.forEach((rune, runeIdx) => {
      const enRune = enStyle.slots[slotIdx].runes.find(r => r.id === rune.id);
      ddragonMap.set(rune.name, {
        nameEn: enRune.name,
        nameJa: rune.name,
        shortDescEn: enRune.shortDesc,
        longDescEn: enRune.longDesc,
        shortDescJa: rune.shortDesc,
        longDescJa: rune.longDesc,
        icon: enRune.icon
      });
    });
  });
});

// Load wiki icons mapping if exists
let wikiIcons = {};
if (fs.existsSync(wikiIconsMapPath)) {
  wikiIcons = JSON.parse(fs.readFileSync(wikiIconsMapPath, 'utf8'));
}

function cleanTextForMatching(str) {
  if (!str) return '';
  return str.replace(/\s+/g, '').replace(/[・＝\-]/g, '');
}

// Compile final runes array
const finalRunes = runeCatalog.map(rune => {
  const normNames = [rune.nameJa, ...(rune.aliasesJa || [])].map(cleanTextForMatching);
  
  // Find OCR text matching name
  let bestOcr = null;
  for (const ocr of ocrResults) {
    const cleanOcr = cleanTextForMatching(ocr.text);
    if (normNames.some(n => cleanOcr.includes(n))) {
      bestOcr = ocr;
      break;
    }
  }

  // Extract description from OCR or DDragon or custom
  let descJa = '';
  let descEn = '';

  if (customDescriptionsJa[rune.id]) {
    descJa = customDescriptionsJa[rune.id];
  } else if (ddragonMap.has(rune.nameJa)) {
    const dd = ddragonMap.get(rune.nameJa);
    descJa = dd.longDescJa
      .replace(/<[^>]+>/g, '') // remove tags
      .replace(/&quot;/g, '"')
      .trim();
  } else if (bestOcr) {
    // Extract description from OCR lines
    const textLines = bestOcr.text.split('\n');
    const startIdx = textLines.findIndex(line => normNames.some(n => cleanTextForMatching(line).includes(n)));
    if (startIdx !== -1) {
      descJa = textLines.slice(startIdx + 1).join('\n').trim();
    } else {
      descJa = bestOcr.text;
    }
  }

  if (customDescriptionsEn[rune.id]) {
    descEn = customDescriptionsEn[rune.id];
  } else if (ddragonMap.has(rune.nameJa)) {
    const dd = ddragonMap.get(rune.nameJa);
    descEn = dd.longDescEn
      .replace(/<[^>]+>/g, '')
      .replace(/&quot;/g, '"')
      .trim();
  } else {
    descEn = descJa; // fallback
  }

  // Clean description HTML tags
  const cleanDesc = (text) => {
    return text
      .replace(/<lol-uikit-tooltipped-keyword[^>]*>/g, '')
      .replace(/<\/lol-uikit-tooltipped-keyword>/g, '')
      .replace(/<br>/g, '\n')
      .replace(/<font[^>]*>/g, '')
      .replace(/<\/font>/g, '')
      .replace(/<b>/g, '')
      .replace(/<\/b>/g, '')
      .replace(/<rules>/g, '')
      .replace(/<\/rules>/g, '')
      .replace(/&quot;/g, '"')
      .trim();
  };

  descJa = cleanDesc(descJa);
  descEn = cleanDesc(descEn);

  // Determine local image path
  const localImage = `/images/runes/${rune.id}.png`;

  return {
    id: rune.id,
    nameJa: rune.nameJa,
    nameEn: rune.nameEn,
    category: rune.category,
    tree: rune.tree,
    image: localImage,
    descriptionJa: descJa,
    descriptionEn: descEn
  };
});

// Save final JSON database
fs.writeFileSync(targetRunesJson, JSON.stringify(finalRunes, null, 2), 'utf8');
console.log(`Saved ${finalRunes.length} runes to ${targetRunesJson}`);

// Download icons task
async function download(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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
  });
}

async function downloadAllIcons() {
  console.log("Downloading icon files to public/images/runes/...");
  const targetDir = 'public/images/runes';
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const rune of runeCatalog) {
    const targetFile = `${targetDir}/${rune.id}.png`;
    let url = '';

    // Check if wikiIcon url exists
    if (wikiIcons[rune.nameEn]) {
      url = wikiIcons[rune.nameEn];
    } else if (wikiIcons[rune.nameJa]) {
      url = wikiIcons[rune.nameJa];
    } else if (ddragonMap.has(rune.nameJa)) {
      const dd = ddragonMap.get(rune.nameJa);
      url = `https://ddragon.leagueoflegends.com/cdn/img/${dd.icon}`;
    }

    if (url) {
      try {
        console.log(`Downloading icon for ${rune.nameEn} (${rune.nameJa}) from ${url}...`);
        await download(url, targetFile);
      } catch (err) {
        console.error(`Failed to download icon for ${rune.nameEn}: ${err.message}`);
        // Fallback to local default if download fails
      }
    } else {
      console.log(`No icon URL found for ${rune.nameEn} (${rune.nameJa})`);
    }
  }
  console.log("Icon downloads finished!");
}

downloadAllIcons();
