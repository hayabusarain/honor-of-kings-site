const fs = require('fs');
const readline = require('readline');
const path = require('path');

const parentTranscriptPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\.system_generated\\logs\\transcript.jsonl';
const brainDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain';

async function main() {
  if (!fs.existsSync(parentTranscriptPath)) {
    console.error('Parent transcript not found:', parentTranscriptPath);
    return;
  }

  console.log('Reading parent transcript...');
  const fileStream = fs.createReadStream(parentTranscriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const subagentIds = [];

  for await (const line of rl) {
    try {
      const step = JSON.parse(line);
      // Look for subagent creation response
      if (step.type === 'INVOKE_SUBAGENT' && step.content) {
        // Content contains JSON blocks with conversationId
        const matches = step.content.match(/"conversationId":\s*"([a-f0-9\-]+)"/g);
        if (matches) {
          matches.forEach(m => {
            const id = m.match(/"conversationId":\s*"([a-f0-9\-]+)"/)[1];
            if (!subagentIds.includes(id)) {
              subagentIds.push(id);
            }
          });
        }
      }
    } catch (e) {}
  }

  console.log('Found subagent IDs in parent transcript:', subagentIds);

  // Now, search each subagent's transcript.jsonl for write_to_file calls containing "スクリーンショット ("
  console.log('Scanning subagent transcripts for written screenshots...');
  
  const results = {};

  for (const id of subagentIds) {
    const subTranscriptPath = path.join(brainDir, id, '.system_generated', 'logs', 'transcript.jsonl');
    if (!fs.existsSync(subTranscriptPath)) {
      continue;
    }
    
    try {
      const subLines = fs.readFileSync(subTranscriptPath, 'utf8').split('\n');
      subLines.forEach(subLine => {
        if (!subLine.trim()) return;
        try {
          const step = JSON.parse(subLine);
          if (step.tool_calls) {
            step.tool_calls.forEach(call => {
              if (call.name === 'write_to_file' && call.args && call.args.TargetFile) {
                const targetFile = call.args.TargetFile;
                if (targetFile.includes('スクリーンショット (')) {
                  const match = targetFile.match(/スクリーンショット \((\d+)\)/);
                  if (match) {
                    const num = parseInt(match[1]);
                    if (!results[num]) {
                      results[num] = [];
                    }
                    results[num].push({
                      subagentId: id,
                      content: call.args.CodeContent,
                      timestamp: step.created_at
                    });
                  }
                }
              }
            });
          }
        } catch (e) {}
      });
    } catch (e) {
      console.error(`Error reading transcript for ${id}:`, e.message);
    }
  }

  console.log('Found screenshots data in subagent logs:');
  const nums = Object.keys(results).map(Number).sort((a, b) => a - b);
  nums.forEach(num => {
    console.log(`Screenshot (${num}) has ${results[num].length} entries.`);
  });

  // Save the extracted data to a file
  fs.writeFileSync(
    path.join(__dirname, 'subagent_logs_extracted.json'),
    JSON.stringify(results, null, 2),
    'utf8'
  );
  console.log('Saved to scratch/subagent_logs_extracted.json');
}

main();
