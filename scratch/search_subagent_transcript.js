const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(transcriptPath)) {
  console.log("Transcript not found");
  process.exit(1);
}

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
console.log(`Searching through ${lines.length} steps of subagent...`);

lines.forEach((line, idx) => {
  if (line.includes('write_to_file') || line.includes('replace_file_content') || line.includes('runes.json')) {
    try {
      const obj = JSON.parse(line);
      console.log(`Step ${obj.step_index || idx}: type=${obj.type}, status=${obj.status}`);
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          console.log(`  Tool: ${tc.name}`);
          if (tc.arguments) {
            console.log(`    Args:`, JSON.stringify(tc.arguments).substring(0, 300));
          }
        });
      }
    } catch(e) {}
  }
});
