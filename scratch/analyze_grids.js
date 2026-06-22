const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const ghostGridBase64 = fs.readFileSync('scratch/grid_ghost.png', 'base64');
  const cleanseGridBase64 = fs.readFileSync('scratch/grid_cleanse.png', 'base64');
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "These are the cropped summoner spell grids from two screenshots of Wild Rift (width=550, height=450, corresponding to original canvas x=50 to 600, y=150 to 600).\n" +
                  "Look at both grids and answer:\n" +
                  "1. Are the grids identical in order and positioning? (Describe the rows and columns layout, e.g. 3x4 grid of icons).\n" +
                  "2. Identify each spell in the grid by its row and column (e.g. Row 1 Col 1: Ghost, Row 1 Col 2: Heal, etc.).\n" +
                  "3. For each unique spell, calculate its exact coordinates [left, top, right, bottom] on the original 1920x1080 canvas.\n" +
                  "Please list all summoner spells and their coordinates in a JSON format at the end."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${ghostGridBase64}`,
              detail: "high"
            }
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${cleanseGridBase64}`,
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
