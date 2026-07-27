const fs = require('fs');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const ocrData = JSON.parse(fs.readFileSync('./scratch/hok_items_ocr.json', 'utf8'));
  const cnData = JSON.parse(fs.readFileSync('./scratch/cn_items.json', 'utf8'));

  // Pre-filter cnData to only necessary fields to reduce tokens
  const cnSimplified = cnData.map(item => ({
    item_id: item.item_id,
    item_name: item.item_name,
    total_price: item.total_price,
    des1: item.des1 ? item.des1.replace(/<[^>]+>/g, '') : '',
    des2: item.des2 ? item.des2.replace(/<[^>]+>/g, '') : ''
  }));

  const prompt = `You are a data mapping assistant.
I have two JSON arrays of game items for Honor of Kings.
Array A (ocrData) contains 110 Japanese items extracted via OCR.
Array B (cnData) contains 121 Chinese items from the official API.

Your task:
Match each item in Array A to the corresponding item in Array B based on their price (Price == total_price) and stats. 
Since Chinese names are garbled (GBK decoding issues) in cnData, rely mostly on total_price and stat values (e.g. +80 AD, +500 HP).

For each matched item from Array A, generate a JSON object with this exact structure:
{
  "id": item_id_from_B,
  "name": "Item Name from A",
  "price": price_from_A_as_number,
  "totalPrice": price_from_A_as_number,
  "stats": "Base Stats from A",
  "passive": "Passive Effects from A",
  "active": "Active Effects from A",
  "icon": "/images/items/" + item_id_from_B + ".jpg"
}

Output ONLY the final JSON array containing all 110 mapped items. Do not include markdown \`\`\`json blocks. Return valid JSON only.

Array A:
${JSON.stringify(ocrData, null, 2)}

Array B:
${JSON.stringify(cnSimplified, null, 2)}
`;

  console.log('Sending request to OpenAI...');
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  let outText = response.choices[0].message.content.trim();
  if (outText.startsWith('\`\`\`json')) {
    outText = outText.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
  }
  if (outText.startsWith('\`\`\`')) {
    outText = outText.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
  }

  try {
    const parsed = JSON.parse(outText);
    fs.writeFileSync('./src/data/hok_items.json', JSON.stringify(parsed, null, 2), 'utf8');
    console.log(`Successfully mapped and saved ${parsed.length} items to src/data/hok_items.json`);
  } catch (e) {
    console.error('Failed to parse response:', e);
    fs.writeFileSync('./scratch/map_error.txt', outText, 'utf8');
  }
}

main().catch(console.error);
