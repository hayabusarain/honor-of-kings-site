import fs from 'fs';

const logPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const step = JSON.parse(line);
    const contentStr = JSON.stringify(step);
    if (contentStr.includes('items/page.tsx') && (contentStr.includes('use client') || contentStr.includes('LayoutGrid'))) {
      console.log(`Step ${step.step_index}: source=${step.source}, type=${step.type}, status=${step.status}, length=${contentStr.length}`);
    }
  } catch (e) {}
}
