import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const version = '14.24.1';
const spells = [
  { name: 'barrier', file: 'SummonerBarrier.png' },
  { name: 'cleanse', file: 'SummonerBoost.png' },
  { name: 'exhaust', file: 'SummonerExhaust.png' },
  { name: 'flash', file: 'SummonerFlash.png' },
  { name: 'ghost', file: 'SummonerHaste.png' },
  { name: 'heal', file: 'SummonerHeal.png' },
  { name: 'ignite', file: 'SummonerDot.png' },
  { name: 'smite', file: 'SummonerSmite.png' },
  { name: 'teleport', file: 'SummonerTeleport.png' }
];

const targetDir = path.join(__dirname, '../public/images/spells');

// Ensure directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function downloadImages() {
  for (const spell of spells) {
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.file}`;
    const dest = path.join(targetDir, `${spell.name}.png`);
    console.log(`Downloading ${url} to ${dest}...`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(dest, buffer);
      console.log(`Successfully saved ${spell.name}.png`);
    } catch (error) {
      console.error(`Error downloading ${spell.name}:`, error);
    }
  }
}

downloadImages().then(() => {
  console.log('All downloads completed!');
});
