import fs from 'fs';

const logPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const step = JSON.parse(line);
    if (step.step_index === 12096) {
      fs.writeFileSync('scratch/step_12096_dump.json', JSON.stringify(step, null, 2), 'utf8');
      console.log('Successfully dumped step 12096 to scratch/step_12096_dump.json');
      break;
    }
  } catch (e) {}
}
