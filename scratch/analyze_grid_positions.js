const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const spellsDir = 'C:\\Users\\81901\\Pictures\\サモナースペル';

async function main() {
  const filePath = path.join(spellsDir, 'スクリーンショット (327).png');
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }
  const base64Image = fs.readFileSync(filePath, 'base64');
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "This is a 1920x1080 screenshot of the summoner spell list in Wild Rift.\n" +
                  "Look at the grid of summoner spell icons on the screen (usually on the left or center-left part).\n" +
                  "1. Please list each summoner spell visible in the grid (e.g. Flash, Ghost, Ignite, Heal, Barrier, Exhaust, Smite, Teleport, etc.).\n" +
                  "2. For each spell in the grid, determine its exact bounding box coordinates [left, top, right, bottom] on the 1920x1080 canvas.\n" +
                  "Please double check that these coordinates actually crop the icon perfectly and contain only the spell's icon art (without text or borders if possible)."
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
}

main().catch(console.error);
