const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const spellsDir = 'C:\\Users\\81901\\Pictures\\サモナースペル';

async function main() {
  if (!fs.existsSync(spellsDir)) {
    console.error('Spells directory does not exist:', spellsDir);
    return;
  }

  const files = fs.readdirSync(spellsDir).filter(f => f.endsWith('.png'));
  console.log(`Found ${files.length} images.`);

  for (const file of files) {
    const filePath = path.join(spellsDir, file);
    const base64Image = fs.readFileSync(filePath, 'base64');
    
    console.log(`Analyzing ${file}...`);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this League of Legends: Wild Rift summoner spell screenshot. Output ONLY a valid JSON object (no markdown, no ```json blocks) containing:\n" +
                      "{\n" +
                      "  \"filename\": \"" + file + "\",\n" +
                      "  \"nameJa\": \"(Spell name in Japanese)\",\n" +
                      "  \"nameEn\": \"(Spell name in English)\",\n" +
                      "  \"cooldown\": (Cooldown in seconds, number),\n" +
                      "  \"descriptionJa\": \"(Full description in Japanese)\",\n" +
                      "  \"descriptionEn\": \"(Short translation of description in English)\"\n" +
                      "}"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        temperature: 0
      });

      console.log(response.choices[0].message.content.trim());
      console.log("-----------------------------------------");
    } catch (e) {
      console.error(`Error analyzing ${file}:`, e.message);
    }
  }
}

main().catch(console.error);
