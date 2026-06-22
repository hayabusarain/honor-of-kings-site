const fs = require('fs');
const subTranscriptPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e3616c4c-cd9e-45b9-9e7a-2b61650ce957\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const lines = fs.readFileSync(subTranscriptPath, 'utf8').split('\n').filter(Boolean);
for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'PLANNER_RESPONSE') {
      console.log(`PLANNER_RESPONSE Keys:`, Object.keys(obj));
      console.log(JSON.stringify(obj, null, 2));
      break;
    }
  } catch(e) {}
}
