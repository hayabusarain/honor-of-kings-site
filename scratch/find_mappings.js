const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\0606f4df-8054-47b4-a618-e7dfa4d4d7ac\\.system_generated\\logs\\transcript.jsonl';
const mediaDir = 'C:\\Users\\81901\\.gemini\antigravity\\brain\\0606f4df-8054-47b4-a618-e7dfa4d4d7ac\\.tempmediaStorage';

// Read all PNG files from mediaDir
const files = fs.readdirSync(mediaDir)
  .filter(f => f.endsWith('.png'))
  .map(f => {
    const filePath = path.join(mediaDir, f);
    const stat = fs.statSync(filePath);
    return { name: f, path: filePath, mtime: stat.mtimeMs };
  })
  .sort((a, b) => a.mtime - b.mtime);

console.log(`Found ${files.length} PNG files in tempmediaStorage.`);

// Read transcript to find view_file calls
const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
const viewFileCalls = [];

for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'PLANNER_RESPONSE' && obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'view_file') {
          const absPath = call.args.AbsolutePath;
          const match = absPath.match(/スクリーンショット\s*\((\d+)\)\.png/);
          if (match) {
            viewFileCalls.push({
              screenshotNum: parseInt(match[1], 10),
              step: obj.step_index,
              time: new Date(obj.created_at).getTime()
            });
          }
        }
      }
    }
  } catch (e) {
    // Ignore invalid JSON lines
  }
}

// Sort view file calls by time or step
viewFileCalls.sort((a, b) => a.step - b.step);

console.log(`Found ${viewFileCalls.length} view_file calls in transcript.`);

// Zip them
const mappings = [];
for (let i = 0; i < Math.min(files.length, viewFileCalls.length); i++) {
  mappings.push({
    screenshot: `スクリーンショット (${viewFileCalls[i].screenshotNum}).png`,
    mediaFile: files[i].name,
    mediaPath: files[i].path
  });
}

console.log(JSON.stringify(mappings, null, 2));
fs.writeFileSync('scratch/mappings.json', JSON.stringify(mappings, null, 2));
