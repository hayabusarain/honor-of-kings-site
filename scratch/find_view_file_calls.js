const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain';
const parentId = 'e8b7ecd2-02e7-415a-9624-b012415fa3d1';

// 54 target files
const targetFiles = [
  'media__1779553450815.png', 'media__1779553882505.png', 'media__1779555675243.png',
  'media__1779556193892.png', 'media__1779558807076.png', 'media__1779602814430.png',
  'media__1779616754246.png', 'media__1779616830111.png', 'media__1779616894582.png',
  'media__1779617647422.png', 'media__1779622000682.png', 'media__1779623308930.png',
  'media__1779623326867.png', 'media__1779623337896.png', 'media__1779623350043.png',
  'media__1779623360171.png', 'media__1779623402532.png', 'media__1779626776949.png',
  'media__1779626798025.png', 'media__1779627064972.png', 'media__1779627159776.png',
  'media__1779635327824.png', 'media__1779635981564.png', 'media__1779636289186.png',
  'media__1779636619684.png', 'media__1779639702282.png', 'media__1779639986034.png',
  'media__1779640162160.png', 'media__1779640271356.png', 'media__1779640676301.png',
  'media__1779883318850.png', 'media__1779885440266.png', 'media__1779891737806.png',
  'media__1779892309798.png', 'media__1779987305057.png', 'media__1779987340017.png',
  'media__1779987371127.png', 'media__1779987390049.png', 'media__1779987805153.png',
  'media__1780071497953.png', 'media__1780073725767.png', 'media__1780073855979.png',
  'media__1780073943960.png', 'media__1780073977191.png', 'media__1780074032361.png',
  'media__1780079338885.png', 'media__1780079392479.png', 'media__1780079457984.png',
  'media__1780079770450.png', 'media__1780081730034.png', 'media__1780081766673.png',
  'media__1780128755711.png', 'media__1780128858274.png', 'media__1780128883685.png'
];

const viewCalls = [];

function scanTranscripts() {
  const dirs = fs.readdirSync(brainDir);
  for (const dir of dirs) {
    if (dir === 'tempmediaStorage') continue;
    const transcriptPath = path.join(brainDir, dir, '.system_generated', 'logs', 'transcript.jsonl');
    if (!fs.existsSync(transcriptPath)) {
      continue;
    }
    console.log(`Scanning: ${transcriptPath}`);
    const content = fs.readFileSync(transcriptPath, 'utf8');
    const lines = content.split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const step = JSON.parse(line);
        if (step.tool_calls) {
          for (const call of step.tool_calls) {
            if (call.name === 'view_file') {
              const absPath = call.args.AbsolutePath;
              if (absPath) {
                // Remove quotes
                const cleanedPath = absPath.replace(/["]/g, '').replace(/\\\\/g, '/').replace(/\\/g, '/');
                if (cleanedPath.toLowerCase().endsWith('.png')) {
                  viewCalls.push({
                    originalPath: cleanedPath,
                    timestamp: new Date(step.created_at || Date.now()).getTime(),
                    convId: dir,
                    step: step.step_index
                  });
                }
              }
            }
          }
        }
      } catch (e) {}
    }
  }
}

scanTranscripts();
console.log(`Total view_file calls found: ${viewCalls.length}`);

// For each target file, find the closest viewCall
const results = [];
for (const targetName of targetFiles) {
  const timestamp = parseInt(targetName.match(/\d+/)[0], 10);
  
  // Find closest viewCall in time
  let closest = null;
  let minDiff = Infinity;
  for (const call of viewCalls) {
    // If the viewCall is viewing a media__ file, it's not the original screenshot view!
    if (call.originalPath.includes('media__')) continue;
    
    // Check time diff
    const diff = Math.abs(call.timestamp - timestamp);
    if (diff < minDiff) {
      minDiff = diff;
      closest = call;
    }
  }
  
  results.push({
    target: targetName,
    closestCall: closest,
    diffSeconds: minDiff / 1000
  });
}

// Print results
results.forEach(r => {
  const screenshotName = r.closestCall ? path.basename(r.closestCall.originalPath) : 'None';
  console.log(`${r.target} -> ${screenshotName} (diff: ${r.diffSeconds}s, conv: ${r.closestCall?.convId}, step: ${r.closestCall?.step})`);
});
