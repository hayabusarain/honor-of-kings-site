const fs = require('fs');
const subTranscriptPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e3616c4c-cd9e-45b9-9e7a-2b61650ce957\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const lines = fs.readFileSync(subTranscriptPath, 'utf8').split('\n').filter(Boolean);
let count = 0;
for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'VIEW_FILE' && obj.content) {
      count++;
      if (count <= 3) {
        console.log(`=== VIEW_FILE Step ${obj.step_index} ===`);
        console.log(obj.content.substring(0, 1000));
        console.log('====================================\n');
      }
    }
  } catch(e) {}
}
