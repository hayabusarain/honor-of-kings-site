const fs = require('fs');
const readline = require('readline');

const parentLogPath = 'C:/Users/81901/.gemini/antigravity/brain/e8b7ecd2-02e7-415a-9624-b012415fa3d1/.system_generated/logs/transcript.jsonl';

if (!fs.existsSync(parentLogPath)) {
  console.error('Parent transcript not found!');
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(parentLogPath),
  output: process.stdout,
  terminal: false
});

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  try {
    const data = JSON.parse(line);
    // Let's check if the type is USER_INPUT or if it has user text
    if (data.source === 'USER_EXPLICIT' || data.type === 'USER_INPUT') {
      console.log(`[Line ${lineNum}] USER INPUT:`);
      console.log(data.content ? data.content.substring(0, 500) : '(no content)');
      console.log('--------------------------------------------------');
    }
  } catch (e) {
    // console.error(`Error parsing line ${lineNum}:`, e.message);
  }
});
