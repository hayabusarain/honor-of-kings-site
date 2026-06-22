const fs = require('fs');
const path = require('path');

const subTranscriptPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e3616c4c-cd9e-45b9-9e7a-2b61650ce957\\\\.system_generated\\\\logs\\\\transcript.jsonl';
const targetNames = [
  '女神の涙', 'シーン', 'ヴァンパイア セプター', 'ジール', 'キルヒアイス シャード',
  'ヌーンクィヴァー', 'リカーブ ボウ', 'B. F. ソード', 'アジリティ クローク',
  'ラスト ウィスパー', 'エクスキューショナー コーリング', 'ファージ',
  'スティンガー', 'ヘクスドリンカー', 'コールフィールド ウォーハンマー'
];

if (!fs.existsSync(subTranscriptPath)) {
  console.log("Subagent log not found.");
  process.exit(1);
}

const lines = fs.readFileSync(subTranscriptPath, 'utf8').split('\n').filter(Boolean);
const mappings = {};
let currentMedia = null;

for (let i = 0; i < lines.length; i++) {
  try {
    const obj = JSON.parse(lines[i]);
    
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'view_file') {
          const absPath = call.args.AbsolutePath;
          if (absPath && absPath.includes('media__')) {
            const match = absPath.match(/media__\d+\.png/);
            if (match) {
              currentMedia = match[0];
            }
          }
        }
      }
    }
    
    if (obj.type === 'PLANNER_RESPONSE' && currentMedia) {
      const isInitiating = obj.tool_calls && obj.tool_calls.some(c => c.name === 'view_file');
      
      if (!isInitiating) {
        const text = (obj.thinking || '') + ' ' + (obj.content || '');
        
        if (Object.keys(mappings).length < 3) {
          console.log(`Debug text for ${currentMedia}: ${text.substring(0, 300)}`);
        }
        
        for (const name of targetNames) {
          if (text.includes(name)) {
            mappings[currentMedia] = name;
            console.log(`Matched: ${currentMedia} => ${name}`);
            currentMedia = null;
            break;
          }
        }
      }
    }
  } catch (e) {}
}

console.log("\nFinal Extracted Mappings count:", Object.keys(mappings).length);
console.log(JSON.stringify(mappings, null, 2));

fs.writeFileSync('./scratch/media_name_mappings.json', JSON.stringify(mappings, null, 2), 'utf8');
console.log("Saved mappings to scratch/media_name_mappings.json");
