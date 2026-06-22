const fs = require('fs');
const transcriptPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

lines.forEach((line, idx) => {
  if (line.includes('"step_index":1274') || line.includes('"step_index":1273')) {
    console.log(line);
  }
});
