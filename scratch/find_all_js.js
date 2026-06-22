const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3';

function scan(d) {
  const files = fs.readdirSync(d);
  files.forEach(f => {
    const p = path.join(d, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (f !== '.system_generated' && f !== 'node_modules' && f !== '.git') {
        scan(p);
      }
    } else if (f.endsWith('.js')) {
      console.log(`File: ${p} (${stat.size} bytes)`);
    }
  });
}

scan(dir);
scan('c:\\Users\\81901\\Desktop\\ワイリフサイト\\scratch');
