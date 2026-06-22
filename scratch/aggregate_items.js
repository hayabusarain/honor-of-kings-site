const fs = require('fs');
const path = require('path');

const ddPath = path.resolve(__dirname, '../src/data/physical_items_dd.json');
const extractedDir = path.resolve(__dirname, '../scratch/extracted_items');
const outputPath = path.resolve(__dirname, '../src/data/physical_items_final.json');

function cleanName(name) {
  if (!name) return '';
  return name.toLowerCase().replace(/[\s・'`’()（）]/g, '');
}

function parseStatsFromDescription(description) {
  const stats = [];
  if (!description) return stats;
  
  // Extract stats between <stats> and </stats>
  const match = description.match(/<stats>([\s\S]*?)<\/stats>/);
  if (match) {
    const rawStats = match[1].split('<br>');
    rawStats.forEach(s => {
      // Remove tags like <attention> and strip HTML
      const cleaned = s.replace(/<[^>]*>/g, '').trim();
      if (cleaned) {
        stats.push(cleaned);
      }
    });
  }
  return stats;
}

function parsePassivesFromDescription(description) {
  const passives = [];
  if (!description) return passives;
  
  // Remove stats block first to avoid confusion
  const content = description.replace(/<stats>[\s\S]*?<\/stats>/, '');
  
  // Look for patterns like <passive>Name</passive><br>Description
  // or <li><passive>Name:</passive> Description
  const passiveRegex = /<passive>([^<]+)<\/passive>([\s\S]*?)(?=(?:<passive>|<active>|<li><passive>|$))/g;
  let match;
  while ((match = passiveRegex.exec(content)) !== null) {
    const name = match[1].replace(/[:：]/g, '').trim();
    const desc = match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (name && desc) {
      passives.push({ name, description: desc });
    }
  }
  
  // Also look for <active>Actives
  const activeRegex = /<active>([^<]+)<\/active>\s*(?:[^<]*\s*<active>([^<]+)<\/active>)?([\s\S]*?)(?=(?:<passive>|<active>|<li><passive>|$))/g;
  while ((match = activeRegex.exec(content)) !== null) {
    const title = match[1].trim();
    const name = match[2] ? match[2].trim() : title;
    const desc = match[3].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (name && desc) {
      passives.push({ name: `発動効果 - ${name}`, description: desc });
    }
  }

  // Also match standard list-based passives: <li><passive>Name:</passive> Description
  const listPassiveRegex = /<li><passive>([^<]+)<\/passive>([\s\S]*?)(?=(?:<li>|<passive>|<active>|$))/g;
  while ((match = listPassiveRegex.exec(content)) !== null) {
    const name = match[1].replace(/[:：]/g, '').trim();
    const desc = match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (name && desc) {
      // Check if we already added it
      if (!passives.some(p => p.name === name)) {
        passives.push({ name, description: desc });
      }
    }
  }

  return passives;
}

function main() {
  console.log('Starting aggregation of physical items...');
  
  // 1. Load Data Dragon items
  if (!fs.existsSync(ddPath)) {
    console.error(`Error: Data Dragon base file not found at ${ddPath}`);
    process.exit(1);
  }
  const ddItems = JSON.parse(fs.readFileSync(ddPath, 'utf8'));
  console.log(`Loaded ${ddItems.length} items from Data Dragon schema.`);
  
  // Create mapping maps
  const ddByNameJa = new Map();
  const ddByNameEn = new Map();
  
  ddItems.forEach(item => {
    ddByNameJa.set(cleanName(item.nameJa), item);
    ddByNameEn.set(cleanName(item.nameEn), item);
  });
  
  // 2. Load all extracted OCR files
  const extractedItems = [];
  if (fs.existsSync(extractedDir)) {
    const files = fs.readdirSync(extractedDir).filter(f => f.endsWith('.json') && !f.endsWith('.metadata.json'));
    console.log(`Found ${files.length} OCR extracted JSON files.`);
    
    files.forEach(file => {
      const filePath = path.join(extractedDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        if (data.item_name) {
          extractedItems.push({
            fileName: file,
            itemName: data.item_name,
            stats: data.stats || [],
            passives: data.passives || []
          });
        }
      } catch (e) {
        console.error(`Error reading/parsing ${file}: ${e.message}`);
      }
    });
  } else {
    console.warn(`Warning: Extracted directory not found at ${extractedDir}`);
  }
  
  // 3. Merge data
  const finalItems = [];
  const mergedNames = new Set();
  
  // Start with Data Dragon items and enhance them with OCR data
  ddItems.forEach(ddItem => {
    const nameJaKey = cleanName(ddItem.nameJa);
    const nameEnKey = cleanName(ddItem.nameEn);
    
    // Find matching OCR item
    let ocrMatch = extractedItems.find(ocr => cleanName(ocr.itemName) === nameJaKey || cleanName(ocr.itemName) === nameEnKey);
    
    // Fallback: search for partial matches
    if (!ocrMatch) {
      ocrMatch = extractedItems.find(ocr => {
        const ocrKey = cleanName(ocr.itemName);
        return nameJaKey.includes(ocrKey) || ocrKey.includes(nameJaKey);
      });
    }
    
    const mergedItem = {
      id: ddItem.id,
      nameJa: ddItem.nameJa,
      nameEn: ddItem.nameEn,
      gold: ddItem.gold,
      image: ddItem.image || 'default_item.png',
      isCompleted: ddItem.gold >= 2500 || ddItem.id.startsWith('7'),
      stats: [],
      passives: []
    };
    
    if (ocrMatch) {
      console.log(`Match: Data Dragon "${ddItem.nameJa}" <-> OCR "${ocrMatch.itemName}"`);
      // Use extracted stats and passives
      mergedItem.stats = ocrMatch.stats;
      mergedItem.passives = ocrMatch.passives;
      mergedNames.add(cleanName(ocrMatch.itemName));
    } else {
      console.log(`No OCR match for Data Dragon "${ddItem.nameJa}". Using parsed Data Dragon fallback.`);
      // Parse from Data Dragon description as fallback
      mergedItem.stats = parseStatsFromDescription(ddItem.description);
      mergedItem.passives = parsePassivesFromDescription(ddItem.description);
    }
    
    finalItems.push(mergedItem);
  });
  
  // 4. Add any OCR items that didn't match any Data Dragon item
  extractedItems.forEach(ocr => {
    const ocrKey = cleanName(ocr.itemName);
    if (!mergedNames.has(ocrKey)) {
      // Find if we already added it through partial matches or similar
      const isAlreadyAdded = finalItems.some(item => cleanName(item.nameJa) === ocrKey || cleanName(item.nameEn) === ocrKey);
      if (!isAlreadyAdded) {
        console.log(`OCR Item not in Data Dragon: "${ocr.itemName}". Adding as new custom item.`);
        
        // Generate a pseudo-ID
        const pseudoId = '9' + Math.floor(1000 + Math.random() * 9000);
        
        finalItems.push({
          id: pseudoId,
          nameJa: ocr.itemName,
          nameEn: ocr.itemName, // Fallback to Japanese name if English is unknown
          gold: 3000, // Default to a standard legendary price
          image: 'default_item.png',
          isCompleted: true,
          stats: ocr.stats,
          passives: ocr.passives
        });
      }
    }
  });
  
  // 5. Save the output
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(finalItems, null, 2), 'utf8');
  console.log(`Successfully compiled and saved ${finalItems.length} items to ${outputPath}`);
}

main();
