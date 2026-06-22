const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function processChampion(idStr) {
  const jsonPath = path.join(__dirname, `../src/data/parsed_skills/champ_${idStr}.json`);
  if (!fs.existsSync(jsonPath)) {
    console.log(`Skipping ${idStr}, no json found.`);
    return;
  }
  
  const currentJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const imagesDir = path.join(__dirname, '../scratch/screenshots');
  const imageFiles = fs.readdirSync(imagesDir).filter(f => f.startsWith(`champ_${idStr}_`) && f.endsWith('.png'));
  
  if (imageFiles.length === 0) {
    console.log(`No images for ${idStr}`);
    return;
  }

  const content = [
    {
      type: "text",
      text: `You are a high-precision OCR assistant.
I will provide you with screenshots of a champion's skills (Passive, Skill 1, Skill 2, Skill 3, Ultimate).
Some screenshots are text descriptions, others are tables.
Your task is to output ONLY a JSON object that matches the structure of the champion's skills.

Here is the current JSON structure for this champion (you must preserve the structure {"skills": [...]}, but update the contents):
${JSON.stringify(currentJson, null, 2)}

【厳守ルール】
1. パッシブのクールタイム等を \`cooldown_text\` に記載すること。
2. 画像のテキスト・数値をそのまま書き写すこと（PC版知識はNG）。
3. \`table.rows\` は \`{ "label": "...", "values": ["..."] }\` の形式で保存すること。
4. HTML span tags (e.g., <span class="text-orange-500 font-bold">) from the current JSON or similar should be used to format colored/bold text if you can infer it, but the text content MUST match the image exactly.
5. Provide ONLY valid JSON. No markdown formatting, no \`\`\`json blocks.
`
    }
  ];

  for (const file of imageFiles) {
    const filePath = path.join(imagesDir, file);
    const base64Image = fs.readFileSync(filePath, 'base64');
    content.push({
      type: "text",
      text: `Filename: ${file}`
    });
    content.push({
      type: "image_url",
      image_url: {
        url: `data:image/png;base64,${base64Image}`,
        detail: "high"
      }
    });
  }

  console.log(`Sending request for ${idStr}...`);
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: content
      }
    ],
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
    const newJson = JSON.parse(outText);
    fs.writeFileSync(jsonPath, JSON.stringify(newJson, null, 2), 'utf8');
    console.log(`Updated champ_${idStr}.json`);
  } catch (e) {
    console.error(`Failed to parse JSON for ${idStr}:`, e);
    fs.writeFileSync(path.join(__dirname, `../scratch/champ_${idStr}_error.txt`), outText, 'utf8');
  }
}

async function main() {
  const champions = ['097', '098', '099', '100', '101', '102', '103', '104', '105', '106'];
  for (const id of champions) {
    await processChampion(id);
  }
}

main().catch(console.error);
