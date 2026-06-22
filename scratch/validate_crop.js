const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const filePath = 'scratch/test_spell_crop.png';
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
            text: "Does this cropped image contain the Summoner Spell icon (e.g. Ghost, Ignite, etc.)? If yes, which spell icon is it? If not, what does it contain?"
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
