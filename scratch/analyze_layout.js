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
            text: "This is a 1920x1080 screenshot of a League of Legends: Wild Rift summoner spell screen (specifically Ghost).\n" +
                  "Look at the screen layout and tell me:\n" +
                  "1. Where is the main Summoner Spell icon located in the image?\n" +
                  "2. What are its exact/approximate bounding box coordinates (left, top, right, bottom) on a 1920x1080 canvas?\n" +
                  "Please give me a JSON format containing \"coordinates\": [left, top, right, bottom]."
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
