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
            text: "This is a 1920x1080 screenshot of the Wild Rift summoner spell selection screen. Please describe in detail where the icons are located:\n" +
                  "1. Is there a large detail panel on the right? If yes, where is the large icon of the selected spell (Ghost/Ignite/etc.)?\n" +
                  "2. Is there a list of icons on the left/middle? If yes, what are their coordinates?\n" +
                  "Please give coordinates for both the selected spell's detail icon and the grid icons."
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
