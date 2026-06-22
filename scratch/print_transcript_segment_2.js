const fs = require('fs');
const readline = require('readline');

const parentLogPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/logs/transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(parentLogPath),
  output: process.stdout,
  terminal: false
});

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  if (lineNum >= 7480 && lineNum <= 7545) {
    try {
      const data = JSON.parse(line);
      console.log(`[Line ${lineNum}] Source: ${data.source}, Type: ${data.type}`);
      if (data.content) {
        console.log(data.content.substring(0, 500));
      }
      if (data.tool_calls) {
        console.log('Tool calls:', JSON.stringify(data.tool_calls));
      }
      console.log('--------------------------------------------------');
    } catch (e) {}
  }
});
