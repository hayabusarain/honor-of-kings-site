const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const leftBase64 = fs.readFileSync('scratch/left.png', 'base64');
  const rightBase64 = fs.readFileSync('scratch/right.png', 'base64');
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Here are the left and right halves of a Wild Rift summoner spell selection screen for Ghost.\n" +
                  "Look at them and tell me:\n" +
                  "1. Which half contains the main description and information about Ghost? (e.g. left or right)\n" +
                  "2. Where in that half is the name 'ゴースト' written? What are its approximate coordinates?\n" +
                  "3. Where is the icon for Ghost located? Please find the icon of the selected spell (Ghost) that represents it on the screen, and estimate its coordinates (left, top, right, bottom relative to the 1920x1080 canvas)."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${leftBase64}`,
              detail: "high"
            }
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${rightBase64}`,
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
