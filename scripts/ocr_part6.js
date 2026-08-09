 
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Load reference data
const itemsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/hok_items.json'), 'utf8'));
const spellsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/hok_spells.json'), 'utf8'));
const arcanasData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/hok_arcanas.json'), 'utf8'));

const validItems = itemsData.map(i => ({ id: i.id, name: i.name.ja }));
const validSpells = spellsData.map(s => ({ id: s.id, name: s.name.ja }));
const validArcanas = arcanasData.map(a => ({ id: a.id, name: a.name.ja }));

const promptText = `You are an expert OCR and data extractor for Honor of Kings.
I will give you 11 screenshots from a set:
- Image 1: Contains the hero name, win rate (勝率, e.g., 52.3%), and victories (勝利数, e.g., 120).
- Images 2 to 7: Each contains a recommended item. Extract its name and match it strictly to the provided valid item IDs.
- Image 8: Contains a summoner spell. Extract its name and match it to the valid spell IDs.
- Images 9 to 11: Each contains a recommended arcana (usually x10). Extract its name and match it to the valid arcana IDs.

Valid Items (JSON array of id and name):
${JSON.stringify(validItems)}

Valid Spells (JSON array of id and name):
${JSON.stringify(validSpells)}

Valid Arcanas (JSON array of id and name):
${JSON.stringify(validArcanas)}

Your output must be ONLY a valid JSON object with the following structure:
{
  "heroName": "Extracted hero name",
  "winRate": "Extracted win rate (e.g. 52.3%)",
  "victories": "Extracted victories (e.g. 120)",
  "items": [
    { "extractedName": "...", "matchedId": "...", "flag": false }, // 6 items
    ...
  ],
  "spell": { "extractedName": "...", "matchedId": "...", "flag": false },
  "arcanas": [
    { "extractedName": "...", "matchedId": "...", "count": 10, "flag": false }, // 3 arcanas
    ...
  ]
}

Set "flag": true if you cannot confidently match the extracted name to one of the valid names exactly (ignoring minor OCR errors). If you set flag to true, leave matchedId as null or best guess.
Output ONLY valid JSON. No markdown blocks.`;

async function processSet(setName) {
  const setDir = path.join('C:\\Users\\81901\\Pictures\\Screenshots', setName);
  if (!fs.existsSync(setDir)) {
    console.log(`Directory not found: ${setDir}`);
    return null;
  }

  const files = fs.readdirSync(setDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg')).sort();
  if (files.length !== 11) {
    console.log(`Warning: Set ${setName} has ${files.length} images, expected 11.`);
  }

  const content = [
    { type: "text", text: promptText }
  ];

  for (const file of files) {
    const filePath = path.join(setDir, file);
    const base64Image = fs.readFileSync(filePath, 'base64');
    content.push({
      type: "image_url",
      image_url: {
        url: `data:image/png;base64,${base64Image}`,
        detail: "high"
      }
    });
  }

  console.log(`Sending request for ${setName}...`);
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: content }],
      temperature: 0,
      response_format: { type: "json_object" }
    });

    let outText = response.choices[0].message.content.trim();
    const result = JSON.parse(outText);
    result.setId = setName;
    console.log(`Successfully processed ${setName}`);
    return result;
  } catch (e) {
    console.error(`Failed to process ${setName}:`, e);
    return { setId: setName, error: e.message };
  }
}

async function main() {
  const results = [];
  // Set_056 to Set_066
  for (let i = 56; i <= 66; i++) {
    const setName = `Set_${String(i).padStart(3, '0')}`;
    const res = await processSet(setName);
    if (res) results.push(res);
  }

  const outPath = path.join(__dirname, '../scratch/ocr_extracted_part6.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Results saved to ${outPath}`);
}

main().catch(console.error);
