const fs = require('fs');
const path = require('path');

const logPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\\\.system_generated\\\\logs\\\\transcript.jsonl';
const brainDir = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e8b7ecd2-02e7-415a-9624-b012415fa3d1';
const tempmediaDir = path.join(brainDir, '.tempmediaStorage');

let mediaFiles = [];

if (fs.existsSync(brainDir)) {
  fs.readdirSync(brainDir).forEach(file => {
    if (file.endsWith('.png')) {
      const p = path.join(brainDir, file);
      mediaFiles.push({ name: file, path: p, mtime: fs.statSync(p).mtimeMs });
    }
  });
}

if (fs.existsSync(tempmediaDir)) {
  fs.readdirSync(tempmediaDir).forEach(file => {
    if (file.endsWith('.png')) {
      const p = path.join(tempmediaDir, file);
      mediaFiles.push({ name: file, path: p, mtime: fs.statSync(p).mtimeMs });
    }
  });
}

mediaFiles.sort((a, b) => a.mtime - b.mtime);
console.log(`Total media files found: ${mediaFiles.length}`);

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
const viewFileCalls = [];
let parseErrors = 0;
let toolCallsCount = 0;
let viewFileCallsCount = 0;

for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    
    // Check if the step has tool calls
    if (obj.tool_calls) {
      toolCallsCount++;
      for (const call of obj.tool_calls) {
        if (call.name === 'view_file') {
          viewFileCallsCount++;
          const absPath = call.args.AbsolutePath;
          if (absPath) {
            // Let's print one to see what it looks like
            if (viewFileCallsCount <= 5) {
              console.log(`Sample AbsolutePath: ${absPath}`);
            }
            const match = absPath.match(/スクリーンショット\s*\((\d+)\)\.png/);
            if (match) {
              const num = parseInt(match[1], 10);
              viewFileCalls.push({
                screenshotNum: num,
                step: obj.step_index,
                time: new Date(obj.created_at || Date.now()).getTime(),
                path: absPath
              });
            }
          }
        }
      }
    }
  } catch (e) {
    parseErrors++;
  }
}

console.log(`Parse errors: ${parseErrors}`);
console.log(`Total steps with tool_calls: ${toolCallsCount}`);
console.log(`Total view_file calls: ${viewFileCallsCount}`);
console.log(`Matched view_file calls: ${viewFileCalls.length}`);

// Unique screenshots in order of first appearance
const uniqueScreenshots = [];
const seen = new Set();
for (const call of viewFileCalls) {
  if (!seen.has(call.screenshotNum)) {
    seen.add(call.screenshotNum);
    uniqueScreenshots.push(call);
  }
}

console.log(`Unique screenshots view_file calls: ${uniqueScreenshots.length}`);

const mappings = [];
for (let i = 0; i < Math.min(mediaFiles.length, uniqueScreenshots.length); i++) {
  mappings.push({
    screenshotNum: uniqueScreenshots[i].screenshotNum,
    screenshotName: `スクリーンショット (${uniqueScreenshots[i].screenshotNum}).png`,
    mediaName: mediaFiles[i].name,
    mediaPath: mediaFiles[i].path,
    mtime: mediaFiles[i].mtime,
    callTime: uniqueScreenshots[i].time
  });
}

console.log(`Mapped ${mappings.length} items.`);
fs.writeFileSync('scratch/media_mappings.json', JSON.stringify(mappings, null, 2));
