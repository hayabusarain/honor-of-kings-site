const fs = require('fs');
const path = require('path');

const ddPath = path.join(__dirname, '../src/data/physical_items_dd.json');
const extDir = path.join(__dirname, '../scratch/extracted_items');
const screenshotsDir = 'C:/Users/81901/Pictures/Screenshots';
const finalPath = path.join(__dirname, '../src/data/physical_items_final.json');

// Hardcoded Data Dragon icon mapping for non-physical items (AP, Tank, Support, Boot Enchants, etc.)
const extraIconMap = {
  'ルーデンエコー': '3285.png',
  'モレロノミコン': '3165.png',
  'ラバドンデスキャップ': '3089.png',
  'リーライクリスタルセプター': '3116.png',
  'ライアンドリーの仮面': '3151.png',
  'ロッドオブエイジス': '3027.png',
  'リッチベイン': '3100.png',
  'アークエンジェルスタッフ': '3003.png',
  'セラフエンブレイス': '3040.png',
  'インフィニティオーブ': '3116.png',
  'バンシーヴェール': '3102.png',
  'バンシークラウン': '3102.png',
  'シャッタードクイーンクラウン': '4644.png',
  'コズミックドライブ': '4629.png',
  'リフトメーカー': '4633.png',
  'アビサルマスク': '3001.png',
  '終わりなき絶望': '6664.png',
  'ホロウレディアンス': '6665.png',
  'ホロウレディアンス.png': '6665.png',
  '騎士の誓い': '3050.png',
  '覇王のブラッドメイル': '3083.png',
  'リデンプション': '3107.png',
  'サンファイアイージス': '3068.png',
  'ソーンメイル': '3075.png',
  'ワーモグアーマー': '3083.png',
  'デッドマンプレート': '3074.png',
  'アイスボーンガントレット': '3025.png',
  '冬の訪れ': '3111.png',
  'フィンブルウィンター': '3121.png',
  '自然の力': '4401.png',
  'ドーンシュラウド': '3075.png',
  'アマランスツインガード': '6662.png',
  '背水のマント': '3074.png',
  '焦炎の王冠': '3068.png',
  '心の鋼': '3084.png',
  'ジークコンバージェンス': '3052.png',
  'ケイニックルーケルン': '6667.png',
  'ヨードルトラップ': '3025.png',
  '暁光の美徳': '3083.png',
  'バミシンダー': '3068.png',
  'スペクターカウル': '3211.png',
  'ジャイアントベルト': '1011.png',
  'ワーデンメイル': '3082.png',
  'チェインベスト': '1031.png',
  'ブランブルベスト': '3076.png',
  'ジャウリムフィスト': '3051.png',
  '翼 of ムーンプレート': '3066.png',
  '翼のムーンプレート': '3066.png',
  'ネガトロンクローク': '1057.png',
  'グレイシャルシュラウド': '3024.png',
  '波打つ鱗': '1031.png',
  'クロースアーマー': '1029.png',
  'ヌルマジックマント': '1033.png',
  'シマリングスパーク': '3068.png',
  'ナッシャーの牙': '3115.png',
  '三相の力': '3078.png',
  'マグネティックブラスター': '3094.png',
  'ディヴァインサンダラー': '6632.png',
  '魂の転移': '3046.png',
  'ヴァンパイアセプター': '1053.png',
  'ジール': '3086.png',
  'キルヒアイスシャード': '2015.png',
  'ヌーンクィヴァー': '6670.png',
  'セレイテッドダーク': '3134.png',
  'リカーブボウ': '1043.png',
  'bfソード': '1038.png',
  'アジリティクローク': '1051.png',
  'ラストウィスパー': '3035.png',
  'エクスキューショナーコーリング': '3123.png',
  'ファージ': '3044.png',
  'ヘクスドリンカー': '3155.png',
  'コールフィールドウォーハンマー': '3133.png',
  'ロングソード': '1036.png',
  '喧嘩屋のグローブ': '1051.png',
  'ダガー': '1042.png',
  'オケアノストライデント': '3116.png',
  'オセアヌストライデント': '3116.png',
  'ホライゾンフォーカス': '4628.png',
  '超能力プロジェクター': '4633.png',
  '覚醒したソウルスティーラー': '3041.png',
  '悪意': '6655.png',
  'マリグナンス': '6655.png',
  'バンドルファンタジー': '3504.png',
  'ハイドラントコア': '3068.png',
  'メジャイソウルスティーラー': '3041.png',
  '女神の涙': '3070.png',
  'エーテルウィスプ': '3113.png',
  'ロストチャプター': '3802.png',
  'フィンディッシュの古書': '3108.png',
  'ブラスティングワンド': '1026.png',
  'ムダニデカイロッド': '1058.png',
  '悲愴な仮面': '3136.png',
  '久遠のカタリスト': '3010.png',
  '忘却のオーブ': '3114.png',
  '予言者のペンダント': '3136.png',
  'ヘクステックオルタネーター': '4626.png',
  'フォビドゥンアイドル': '3114.png',
  'ナッシャータロン': '3115.png',
  '増魔の書': '1052.png',
  '天啓の輪': '3108.png',

  // Newly missing mappings
  'ドラクサーダスクブレード': '3147.png',
  '実験的ヘクスプレート': '6690.png',
  'フローウォータースタッフ': '4005.png',
  '帝国の指令': '4005.png',
  'マーキュリーステイシス': '3157.png',
  'マーキュリークイックシルバー': '3140.png',
  'マーキュリーゲイルフォース': '6671.png',
  'マーキュリードリームメーカー': '3864.png',
  'マーキュリーグローリー': '3800.png',
  'マーキュリーゴアドリンカー': '6630.png',
  'マーキュリーストライドブレイカー': '6631.png',
  'マーキュリーストーンプレート': '3193.png',
  'マーキュリープロトベルト': '3152.png',
  'マーキュリーロケット': '3190.png',
  'スティンガー': '3101.png',
  'キンドルジェム': '3067.png',
  'アイオニアブーツ': '3158.png',
  'グラトナスブーツ': '3006.png',
  'ダイナミズムブーツ': '3009.png',
  'バーサーカーブーツ': '3006.png',
  'プレートスチールキャップ': '3047.png',
  'マーキュリーブーツ': '3111.png',
  'マナブーツ': '3020.png',
  'レリックシールド': '3858.png',
  '黒き霧の大鎌': '3862.png',
  '霊者の鎌': '3850.png',
  '霊峰の砦': '3860.png',
  'ブーツ': '1001.png',
  'マーキュリーヴェール': '3102.png',
  'サファイアクリスタル': '1027.png',
  'ルビークリスタル': '1028.png',
  'ハーモニックエコー': '3285.png'
};

function normalizeName(name) {
  if (!name) return '';
  return name.replace(/\s+/g, '')
             .replace(/[・＝\-\[\]\.]/g, '')
             .replace(/[ー]/g, '')
             .toLowerCase()
             .trim();
}

function main() {
  console.log('Compiling database of screenshotted items...');

  // 1. Get all screenshots in the user's Screenshots folder
  if (!fs.existsSync(screenshotsDir)) {
    console.error(`Screenshots folder not found at ${screenshotsDir}`);
    process.exit(1);
  }
  const screenshotFiles = fs.readdirSync(screenshotsDir).filter(f => f.toLowerCase().endsWith('.png'));
  console.log(`Found ${screenshotFiles.length} screenshots in user Screenshots folder.`);

  // Create a set of base names (e.g. "スクリーンショット (100)")
  const validBases = new Set(screenshotFiles.map(f => path.basename(f, '.png')));

  // 2. Load all OCR files that correspond to these valid screenshots
  if (!fs.existsSync(extDir)) {
    console.error(`OCR extracted items folder not found at ${extDir}`);
    process.exit(1);
  }
  
  const extFiles = fs.readdirSync(extDir).filter(f => f.endsWith('.json') && !f.includes('.metadata.json'));
  console.log(`Found ${extFiles.length} JSON files in extracted_items.`);

  const itemMap = new Map(); // nameJa -> item object
  const passivesPool = new Map(); // normName -> Array of { passiveName, desc, scrNum }

  function mergeTexts(t1, t2) {
    t1 = t1.trim();
    t2 = t2.trim();
    if (!t1) return t2;
    if (!t2) return t1;

    // 1. Substring containment checks
    if (t1.includes(t2)) return t1;
    if (t2.includes(t1)) return t2;

    // 2. Similarity check using 3-grams to detect duplicate screens of the same text
    const set1 = new Set();
    const set2 = new Set();
    for (let i = 0; i < t1.length - 2; i++) set1.add(t1.substring(i, i + 3));
    for (let i = 0; i < t2.length - 2; i++) set2.add(t2.substring(i, i + 3));
    
    let intersection = 0;
    set1.forEach(gram => {
      if (set2.has(gram)) intersection++;
    });
    
    const similarity = (set1.size === 0 || set2.size === 0) ? 0 : intersection / Math.max(set1.size, set2.size);
    if (similarity > 0.45) {
      // Return the longer one (which usually has more complete OCR details)
      return t1.length >= t2.length ? t1 : t2;
    }

    // 3. Suffix-Prefix overlap check (for scrolled texts)
    const minLen = Math.min(t1.length, t2.length);
    let maxOverlap = 0;
    for (let len = 5; len <= minLen; len++) {
      const endPart = t1.substring(t1.length - len);
      const startPart = t2.substring(0, len);
      if (endPart === startPart) {
        maxOverlap = len;
      }
    }

    if (maxOverlap > 0) {
      return t1 + t2.substring(maxOverlap);
    }

    return t1 + t2;
  }

  extFiles.forEach(file => {
    // Determine the screenshot base name
    let base = file;
    if (base.endsWith('.png.json')) {
      base = base.substring(0, base.length - 9);
    } else if (base.endsWith('.json')) {
      base = base.substring(0, base.length - 5);
    }

    // Skip if this screenshot is not present in the user's Screenshots folder
    if (!validBases.has(base)) {
      return;
    }

    try {
      const filePath = path.join(extDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Skip if it doesn't contain a valid item name (like settings/UI screenshots)
      if (!data.item_name || data.item_name === 'null' || data.item_name === 'N/A' || data.item_name.trim() === '') {
        return;
      }

      let itemJa = data.item_name.trim();
      if (itemJa.startsWith('マーキュリー ') && itemJa !== 'マーキュリー ブーツ') {
        itemJa = itemJa.replace('マーキュリー ', '');
      }
      const EXCLUDE_ITEMS = ['三相の力', 'ナッシャーの牙', 'バンシークラウン', 'バンシー クラウン', '悪意', 'オセアヌストライデント', 'オセアヌス トライデント', 'ハイドラントコア', 'ハイドラント・コア', 'ナッシャータロン', 'ナッシャー タロン', 'バンシーヴェール', 'バンシー ヴェール'];
      const EXCLUDE_NORM = EXCLUDE_ITEMS.map(normalizeName);
      const normName = normalizeName(itemJa);

      if (EXCLUDE_ITEMS.includes(itemJa) || EXCLUDE_NORM.includes(normName)) {
        return; // Skip this excluded/incorrect item
      }

      const itemGold = data.gold !== undefined && data.gold !== null ? Number(data.gold) : 0;
      const numMatch = base.match(/\((\d+)\)/);
      const scrNum = numMatch ? parseInt(numMatch[1]) : 99999;
      
      const itemObj = {
        nameJa: itemJa,
        gold: itemGold,
        stats: data.stats || [],
        passives: [], // Will be populated after merging
        sourceFile: file,
        baseName: base,
        scrNum: scrNum
      };

      // Collect all passives into the pool to merge later
      if (!passivesPool.has(normName)) {
        passivesPool.set(normName, []);
      }
      const pool = passivesPool.get(normName);
      if (data.passives) {
        data.passives.forEach(p => {
          if (p.name && p.description && p.name !== 'null' && p.description !== 'null') {
            pool.push({
              name: p.name.trim(),
              description: p.description.trim(),
              scrNum: scrNum
            });
          }
        });
      }

      // Deduplicate items for base details (prefer gold > 0, then prefer LOWER screenshot number)
      if (itemMap.has(normName)) {
        const existing = itemMap.get(normName);
        
        let overwrite = false;
        if (itemObj.gold > 0 && existing.gold === 0) {
          overwrite = true;
        } else if (itemObj.gold === 0 && existing.gold > 0) {
          overwrite = false;
        } else {
          // Keep the one with the smaller screenshot number (typically the unscrolled 1st page)
          overwrite = (itemObj.scrNum < existing.scrNum);
        }
        
        if (overwrite) {
          itemMap.set(normName, itemObj);
        }
      } else {
        itemMap.set(normName, itemObj);
      }
    } catch (e) {
      console.error(`Error parsing ${file}: ${e.message}`);
    }
  });

  // Now perform passive merging for each deduplicated item
  for (const [normName, item] of itemMap.entries()) {
    const pool = passivesPool.get(normName) || [];
    
    // Group passives by name
    const grouped = new Map();
    pool.forEach(p => {
      if (!grouped.has(p.name)) {
        grouped.set(p.name, []);
      }
      grouped.get(p.name).push(p);
    });
    
    // For each unique passive, sort description fragments by screenshot number and merge
    const mergedPassives = [];
    for (const [passiveName, fragments] of grouped.entries()) {
      // Sort fragments ascending by screenshot number
      fragments.sort((a, b) => a.scrNum - b.scrNum);
      
      let finalDesc = '';
      fragments.forEach(f => {
        finalDesc = mergeTexts(finalDesc, f.description);
      });
      
      mergedPassives.push({
        name: passiveName,
        description: finalDesc
      });
    }
    item.passives = mergedPassives;
    // Clean up temporary fields
    delete item.scrNum;
  }

  // Load manual overrides if exists
  const overridePath = path.join(__dirname, 'item_override_configs.json');
  let overrides = {};
  if (fs.existsSync(overridePath)) {
    try {
      overrides = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
      console.log(`Loaded ${Object.keys(overrides).length} item overrides from item_override_configs.json`);
    } catch (e) {
      console.error(`Error loading overrides: ${e.message}`);
    }
  }

  // Apply overrides to itemMap entries
  const normalizedOverrides = {};
  for (const [key, val] of Object.entries(overrides)) {
    normalizedOverrides[key] = val;
    normalizedOverrides[normalizeName(key)] = val;
  }

  for (const [normName, item] of itemMap.entries()) {
    const override = normalizedOverrides[item.nameJa] || normalizedOverrides[normName];
    if (override) {
      if (override.baseName) {
        console.log(`Overriding baseName for ${item.nameJa}: ${item.baseName} -> ${override.baseName}`);
        item.baseName = override.baseName;
      }
      if (override.gold !== undefined) {
        console.log(`Overriding gold for ${item.nameJa}: ${item.gold} -> ${override.gold}`);
        item.gold = override.gold;
      }
      if (override.stats) {
        console.log(`Overriding stats for ${item.nameJa}`);
        item.stats = override.stats;
      }
      if (override.passives) {
        console.log(`Overriding passives for ${item.nameJa}`);
        item.passives = override.passives;
      }
    }
  }

  console.log(`Deduplicated and merged into ${itemMap.size} unique items from screenshots.`);

  // 3. Load Data Dragon items for matching icons
  let ddItems = [];
  if (fs.existsSync(ddPath)) {
    ddItems = JSON.parse(fs.readFileSync(ddPath, 'utf8'));
  }

  const ddMap = new Map();
  ddItems.forEach(item => {
    ddMap.set(normalizeName(item.nameJa), item.image);
    ddMap.set(normalizeName(item.nameEn), item.image);
  });

  // Prepare normalized version of extraIconMap
  const normalizedExtraIconMap = {};
  for (const [key, val] of Object.entries(extraIconMap)) {
    normalizedExtraIconMap[normalizeName(key)] = val;
  }

  // 4. Build final items list
  const finalItems = [];

  for (const [normName, item] of itemMap.entries()) {
    // Determine icon
    let iconName = 'default_item.png';
    if (ddMap.has(normName)) {
      iconName = ddMap.get(normName);
    } else if (normalizedExtraIconMap[normName]) {
      iconName = normalizedExtraIconMap[normName];
    } else {
      // Try to find a partial match in ddMap
      let found = false;
      for (const [ddNormName, ddIcon] of ddMap.entries()) {
        if (ddNormName.includes(normName) || normName.includes(ddNormName)) {
          iconName = ddIcon;
          found = true;
          break;
        }
      }
      if (!found) {
        // Try partial match in normalizedExtraIconMap
        for (const [extraNormName, extraIcon] of Object.entries(normalizedExtraIconMap)) {
          if (extraNormName.includes(normName) || normName.includes(extraNormName)) {
            iconName = extraIcon;
            found = true;
            break;
          }
        }
      }
    }

    const enchantments = [
      'ステイシス', 'クイックシルバー', 'ヴェール', 'グローリー', 'ゲイルフォース', 
      'ゴアドリンカー', 'ストーンプレート', 'ストライドブレイカー', 'ドリームメーカー', 
      'プロトベルト', 'ロケット'
    ];
    const isEnchantment = enchantments.includes(item.nameJa);

    finalItems.push({
      id: `ocr_${item.baseName.replace(/[^\d]/g, '') || Math.floor(Math.random() * 10000)}`,
      nameJa: item.nameJa,
      nameEn: '',
      gold: item.gold,
      image: iconName,
      isCompleted: item.gold >= 2000,
      stats: isEnchantment ? [] : item.stats,
      passives: item.passives
    });
  }

  // Sort by gold cost descending, then name
  finalItems.sort((a, b) => {
    if (b.gold !== a.gold) {
      return b.gold - a.gold;
    }
    return a.nameJa.localeCompare(b.nameJa);
  });

  // Save the output
  fs.writeFileSync(finalPath, JSON.stringify(finalItems, null, 2), 'utf8');
  console.log(`Saved ${finalItems.length} items to ${finalPath}`);
}

main();
