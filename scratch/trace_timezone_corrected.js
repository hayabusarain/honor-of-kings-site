const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain';

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

const dirs = fs.readdirSync(brainDir);
for (const dir of dirs) {
  const transcriptPath = path.join(brainDir, dir, '.system_generated', 'logs', 'transcript.jsonl');
  if (!fs.existsSync(transcriptPath)) continue;

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
              const cleanedPath = absPath.replace(/["]/g, '').replace(/\\\\/g, '/').replace(/\\/g, '/');
              if (cleanedPath.toLowerCase().endsWith('.png') && !cleanedPath.includes('media__')) {
                // Correct for 9-hour JST/UTC offset
                // JST is UTC+9. If step.created_at is JST (e.g. 17:00 JST), and filename is UTC (08:00 UTC = 1780128000000)
                // step.created_at parsed directly as JST/UTC gives JST 17:00 UTC (which is 9 hours ahead of actual UTC time).
                // So we subtract 9 hours (32400000 ms) to convert step JST to UTC!
                const jstMs = new Date(step.created_at || Date.now()).getTime();
                const utcMs = jstMs - 9 * 60 * 60 * 1000;
                viewCalls.push({
                  path: cleanedPath,
                  filename: path.basename(cleanedPath),
                  utcTimestamp: utcMs,
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

console.log(`Total non-media PNG view calls (UTC-corrected): ${viewCalls.length}`);

// Map targets
const mappings = [];
for (const targetName of targetFiles) {
  const fileTimestamp = parseInt(targetName.match(/\d+/)[0], 10);
  
  let closest = null;
  let minDiff = Infinity;
  for (const call of viewCalls) {
    const diff = Math.abs(call.utcTimestamp - fileTimestamp);
    if (diff < minDiff) {
      minDiff = diff;
      closest = call;
    }
  }
  
  mappings.push({
    target: targetName,
    screenshot: closest ? closest.filename : 'None',
    diffSeconds: minDiff / 1000,
    convId: closest ? closest.convId : 'None',
    step: closest ? closest.step : 'None'
  });
}

// Print results
mappings.forEach(m => {
  console.log(`${m.target} -> ${m.screenshot} (diff: ${m.diffSeconds}s, conv: ${m.convId}, step: ${m.step})`);
});
