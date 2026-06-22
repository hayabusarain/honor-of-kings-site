const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const content = [
    {
      type: "text",
      text: "You are a games database assistant. Here are 12 cropped images from the Wild Rift summoner spells grid, ordered from Row 1 to Row 3, Column 1 to Column 4.\n" +
            "Please analyze each image and identify which Summoner Spell icon it contains (e.g. Flash, Ignite, Heal, Barrier, Exhaust, Smite, Ghost, Teleport, Cleanse, etc. or if it is empty/background).\n" +
            "List them like: \n" +
            "r1_c1: Ghost\n" +
            "r1_c2: Heal\n" +
            "..."
    }
  ];

  for (let r = 1; r <= 3; r++) {
    for (let c = 1; c <= 4; c++) {
      const filename = `r${r}_c${c}.png`;
      const filePath = path.join('scratch/spells_grid_test', filename);
      if (fs.existsSync(filePath)) {
        const base64Image = fs.readFileSync(filePath, 'base64');
        content.push({
          type: "text",
          text: `Filename: ${filename}`
        });
        content.push({
          type: "image_url",
          image_url: {
            url: `data:image/png;base64,${base64Image}`,
            detail: "low"
          }
        });
      }
    }
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: content
      }
    ],
    temperature: 0
  });

  console.log(response.choices[0].message.content.trim());
}

main().catch(console.error);
