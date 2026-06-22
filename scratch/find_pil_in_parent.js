const fs = require('fs');
const readline = require('readline');

const transPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\.system_generated\\logs\\transcript.jsonl';

async function main() {
  if (!fs.existsSync(transPath)) {
    console.error('Transcript not found!');
    return;
  }
  
  const fileStream = fs.createReadStream(transPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    if (line.includes('.crop(') || line.includes('crop_box') || line.includes('crop(')) {
      console.log(`Line ${index} matches:`);
      console.log(line.substring(0, 1000));
      console.log('---');
    }
    index++;
  }
}

main();
