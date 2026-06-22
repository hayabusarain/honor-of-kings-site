const fs = require('fs');

const parentLogPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\.system_generated\\logs\\transcript.jsonl';

const lines = fs.readFileSync(parentLogPath, 'utf8').split('\n').filter(Boolean);

for (let i = 0; i < lines.length; i++) {
  try {
    const step = JSON.parse(lines[i]);
    if (step.created_at && step.created_at.startsWith('2026-05-29T16:')) {
      console.log(`Step ${step.step_index}: ${step.created_at} - Type: ${step.type} - Source: ${step.source}`);
      if (step.source === 'USER_EXPLICIT' && step.content) {
        console.log(`  Content: ${step.content.substring(0, 300)}`);
      }
      console.log('--------------------------------------------------');
    }
  } catch (e) {}
}
