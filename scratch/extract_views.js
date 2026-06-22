import fs from 'fs';

const logPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const step = JSON.parse(line);
    if (step.step_index === 11980 || step.step_index === 11982) {
      console.log(`Dumping Step ${step.step_index}`);
      fs.writeFileSync(`scratch/step_${step.step_index}.json`, JSON.stringify(step, null, 2), 'utf8');
    }
  } catch (e) {}
}
