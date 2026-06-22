const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const filePath = 'scratch/strip.png';
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
            text: "This is a cropped vertical strip (width=150, height=800) from x=1350 to 1500, y=100 to 900 of the original 1920x1080 screen.\n" +
                  "Look at this strip and find if there is a square Summoner Spell icon (like Ghost or similar).\n" +
                  "If so, what are the local coordinates of the icon inside this image? (e.g. left, top, right, bottom relative to this 150x800 image).\n" +
                  "Also calculate what these coordinates would be on the original 1920x1080 image (x = local_x + 1350, y = local_y + 100)."
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
