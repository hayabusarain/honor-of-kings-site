const fs = require('fs');

const logPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\3fbb6f18-a4b2-4ffc-bc8e-911c86bcd204\\.system_generated\\logs\\transcript_full.jsonl';
const statsPath = 'C:\\Users\\81901\\Desktop\\オナーオブキングスサイト\\src\\data\\hero_stats_camp.json';

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.trim().split('\n');

let lastUserInput = null;
for (let i = lines.length - 1; i >= 0; i--) {
  try {
    const obj = JSON.parse(lines[i]);
    if (obj.type === 'USER_INPUT') {
      lastUserInput = obj.content;
      break;
    }
  } catch (e) {
    // ignore
  }
}

if (!lastUserInput) {
  console.error("Could not find USER_INPUT in transcript.");
  process.exit(1);
}

// Extract JSON string from the user input
// It should start with { and end with }
const jsonStart = lastUserInput.indexOf('{');
const jsonEnd = lastUserInput.lastIndexOf('}');

if (jsonStart === -1 || jsonEnd === -1) {
  console.error("Could not find JSON payload in the user input.");
  process.exit(1);
}

const jsonString = lastUserInput.substring(jsonStart, jsonEnd + 1);

let tierData;
try {
  tierData = JSON.parse(jsonString);
} catch (e) {
  console.error("Error parsing JSON:", e.message);
  process.exit(1);
}

if (!tierData.data || !tierData.data.list) {
  console.error("Parsed JSON does not match expected Camp API format.");
  process.exit(1);
}

const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8'));

// Create a mapping from jpName to hero_id
const nameToId = {};
for (const [heroId, data] of Object.entries(statsData)) {
  if (data.jpName) {
    nameToId[data.jpName] = heroId;
  }
}

const aliases = {
  // Add any needed aliases here
};

const list = tierData.data.list;
let updatedCount = 0;
let missing = [];

for (const item of list) {
  let heroName = item.heroInfo.heroName;
  if (aliases[heroName]) heroName = aliases[heroName];

  let matchedId = nameToId[heroName];

  if (!matchedId) {
    for (const [jpName, id] of Object.entries(nameToId)) {
      if (jpName.includes(heroName) || heroName.includes(jpName)) {
        matchedId = id;
        break;
      }
    }
  }

  if (matchedId) {
    const tRank = item.tRank;
    let newTier = "C";
    if (tRank === 0) newTier = "S";
    else if (tRank === 1) newTier = "A";
    else if (tRank === 2) newTier = "B";
    else if (tRank >= 3) newTier = "C";

    const winRate = parseFloat((item.winRate * 100).toFixed(2));
    const pickRate = parseFloat((item.showRate * 100).toFixed(2));
    const banRate = parseFloat((item.banRate * 100).toFixed(2));

    statsData[matchedId].tier = newTier;
    statsData[matchedId].win_rate = winRate;
    statsData[matchedId].pick_rate = pickRate;
    statsData[matchedId].ban_rate = banRate;
    updatedCount++;
  } else {
    missing.push(heroName);
  }
}

fs.writeFileSync(statsPath, JSON.stringify(statsData, null, 2), 'utf8');
console.log(`Successfully updated ${updatedCount} heroes with Camp API data.`);
if (missing.length > 0) {
  console.log(`Could not find these heroes:`, missing);
}
