const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const spellsDir = 'C:\\Users\\81901\\Pictures\\サモナースペル';

async function main() {
  const filePath = path.join(spellsDir, 'スクリーンショット (331).png');
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
            text: "This is a 1920x1080 screenshot of the summoner spell selection screen in Wild Rift (Cleanse selected).\n" +
                  "Look at the grid of summoner spells on the left.\n" +
                  "1. What is the grid size (e.g. 3 rows, 4 columns)?\n" +
                  "2. In which row and column is \"クレンズ\" (Cleanse) located in this grid?\n" +
                  "3. What are the approximate coordinates [left, top, right, bottom] of Cleanse's grid slot?\n" +
                  "Please give coordinates for Cleanse and describe if there is a Row 3."
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
