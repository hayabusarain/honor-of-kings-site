const fs = require('fs');
const path = require('path');

const ddPath = path.join(__dirname, '../src/data/physical_items_dd.json');
const extDir = path.join(__dirname, '../scratch/extracted_items');
const finalPath = path.join(__dirname, '../src/data/physical_items_final.json');

// Master Data Dragon 物理アイテム
const ddItems = JSON.parse(fs.readFileSync(ddPath, 'utf8'));

// 有効なスクリーンショットのベース名リストを読み込む
const validBases = JSON.parse(fs.readFileSync(path.join(__dirname, 'valid_screenshot_bases.json'), 'utf8'));

// 全ての抽出JSONファイルを読み込む
const extFiles = fs.readdirSync(extDir).filter(f => f.endsWith('.json'));

const extDataList = [];
extFiles.forEach(file => {
    let base = file;
    if (base.endsWith('.png.json')) {
        base = base.substring(0, base.length - 9);
    } else if (base.endsWith('.json')) {
        base = base.substring(0, base.length - 5);
    }
    
    if (!validBases.includes(base)) {
        // ユーザー提供のスクリーンショットに無い古い/無関係なファイルはスキップ
        return;
    }

    try {
        const content = JSON.parse(fs.readFileSync(path.join(extDir, file), 'utf8'));
        if (content.item_name) {
            content._sourceFile = file;
            extDataList.push(content);
        }
    } catch (e) {
        console.error(`Failed to parse ${file}: ${e}`);
    }
});

console.log(`Loaded ${ddItems.length} items from Data Dragon.`);
console.log(`Loaded ${extDataList.length} items from OCR results (filtered by valid screenshots).`);

// レーベンシュタイン距離を用いた類似度計算
function editDistance(s1, s2) {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function getSimilarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

// マッチング用の正規化関数
function normalizeName(name) {
    if (!name) return '';
    return name.replace(/\s+/g, '')
               .replace(/[・＝\-\[\]]/g, '')
               .replace(/[ー]/g, '') // 長音も消して比較しやすくする
               .toLowerCase()
               .trim();
}

const finalItems = [];
const matchedOcr = new Set();

// 1. Data Dragonのアイテムをループし、OCR結果をマージする
ddItems.forEach(ddItem => {
    // 【オーンの傑作アイテム除外ルール】
    // IDが 7000 番台、または名前にオーン強化を示唆する特定のキーワードがある場合はスキップ
    if (ddItem.id.startsWith('7')) {
        console.log(`Skipping Ornn masterpiece item: ${ddItem.nameJa}`);
        return;
    }

    const normJa = normalizeName(ddItem.nameJa);
    const normEn = normalizeName(ddItem.nameEn);
    
    // OCR結果から最もマッチするものを探す (Fuzzy Match)
    let bestMatch = null;
    let maxSimilarity = 0.0;
    
    extDataList.forEach(ocr => {
        const ocrNorm = normalizeName(ocr.item_name);
        
        // 完全一致
        if (ocrNorm === normJa || ocrNorm === normEn) {
            bestMatch = ocr;
            maxSimilarity = 1.0;
            return;
        }
        
        // 類似度計算
        const simJa = getSimilarity(ocrNorm, normJa);
        const simEn = getSimilarity(ocrNorm, normEn);
        const sim = Math.max(simJa, simEn);
        
        if (sim > maxSimilarity) {
            maxSimilarity = sim;
            bestMatch = ocr;
        }
    });

    const merged = {
        id: ddItem.id,
        nameJa: ddItem.nameJa,
        nameEn: ddItem.nameEn,
        gold: ddItem.gold,
        image: ddItem.image,
        isCompleted: ddItem.gold >= 2000,
        stats: [],
        passives: []
    };

    // 類似度が 0.70 以上のときのみマッチとみなす
    if (bestMatch && maxSimilarity >= 0.70) {
        matchedOcr.add(bestMatch._sourceFile);
        merged.stats = bestMatch.stats || [];
        merged.passives = bestMatch.passives || [];
        
        // Use gold from OCR screenshot data, discard PC version fallback cost
        if (bestMatch.gold !== undefined && bestMatch.gold !== null) {
            merged.gold = Number(bestMatch.gold);
        }
        merged.isCompleted = merged.gold >= 2000;
        
        // OCRでの名前を優先するが、Data Dragonの綺麗な表記を優先
        if (maxSimilarity > 0.95 && bestMatch.item_name && bestMatch.item_name.length > 2) {
            merged.nameJa = bestMatch.item_name;
        }
        console.log(`Match success: ${ddItem.nameJa} <-> ${bestMatch.item_name} (Similarity: ${(maxSimilarity*100).toFixed(1)}%)`);
        finalItems.push(merged); // OCRマッチが成功したアイテムのみを登録！
    } else {
        // 【PC版LoLデータの混入防止】
        // OCRデータがマッチしなかったアイテムは、PC版フォールバックを載せるのではなく、完全に除外する！
        console.log(`No OCR match for ${ddItem.nameJa}. Excluded from list to prevent PC LoL data contamination.`);
    }
});

// 2. Data Dragonに載っていないが、OCR抽出できたアイテムを新規追加する
extDataList.forEach(ocrItem => {
    if (matchedOcr.has(ocrItem._sourceFile)) return;
    
    // オーンアイテムと思われるものを除外（ID判定できないため、名前等で簡易チェック）
    const name = ocrItem.item_name || '';
    const isOrnnName = name.includes('台風の目') || name.includes('ショウジンの誓い') || name.includes('ヘブンズフォール') || name.includes('傑作') || name.includes('オブシディアン');
    if (isOrnnName) {
        console.log(`Skipping non-DataDragon Ornn item: ${ocrItem.item_name}`);
        return;
    }

    const ocrNorm = normalizeName(ocrItem.item_name);
    // 同名アイテムがすでに登録されていないかチェック (類似度90%以上も重複とみなす)
    const alreadyAdded = finalItems.some(item => {
        const itemNorm = normalizeName(item.nameJa);
        return getSimilarity(itemNorm, ocrNorm) >= 0.90;
    });
    if (alreadyAdded) return;

    // 新規アイテムとして登録 (画像から直接読み取った情報のみなのでPC版の混入はない)
    console.log(`Adding non-DataDragon item from OCR: ${ocrItem.item_name}`);
    const itemGold = ocrItem.gold !== undefined && ocrItem.gold !== null ? Number(ocrItem.gold) : 500;
    finalItems.push({
        id: `ocr_${ocrItem._sourceFile.replace(/[^\d]/g, '') || Math.floor(Math.random() * 10000)}`,
        nameJa: ocrItem.item_name,
        nameEn: "",
        gold: itemGold,
        image: "default_item.png",
        isCompleted: itemGold >= 2000,
        stats: ocrItem.stats || [],
        passives: ocrItem.passives || []
    });
});

// JSONに書き出し
fs.writeFileSync(finalPath, JSON.stringify(finalItems, null, 2), 'utf8');
console.log(`Successfully merged and saved ${finalItems.length} items to ${finalPath}`);
