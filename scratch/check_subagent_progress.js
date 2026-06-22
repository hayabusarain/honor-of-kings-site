const fs = require('fs');

const subagents = [
  { id: '695c5942-8023-40cf-8b29-b7bd000c1885', group: 1 },
  { id: '771185cf-dd06-45da-a428-f4fbd50258f2', group: 2 },
  { id: '9840f493-16b2-4709-8068-913fa76d5435', group: 3 },
  { id: '540e1255-9dcb-4b5b-a950-d9dce9a10d69', group: 4 }
];

subagents.forEach(agent => {
  const logPath = `C:/Users/81901/.gemini/antigravity/brain/${agent.id}/.system_generated/logs/transcript.jsonl`;
  if (fs.existsSync(logPath)) {
    const lines = fs.readFileSync(logPath, 'utf8').trim().split('\n');
    console.log(`\nSubagent Group ${agent.group} (${agent.id}):`);
    console.log(`Log lines count: ${lines.length}`);
    
    // Find the latest step index
    try {
      const lastLine = lines[lines.length - 1];
      const parsed = JSON.parse(lastLine);
      console.log(`Last step index: ${parsed.step_index}, type: ${parsed.type}, status: ${parsed.status}`);
      
      // Let's count how many view_file calls were made
      let viewCount = 0;
      lines.forEach(l => {
        if (l.includes('"view_file"')) {
          viewCount++;
        }
      });
      console.log(`view_file tool calls count: ${viewCount}`);
    } catch (e) {
      console.log('Error parsing last log line:', e.message);
    }
  } else {
    console.log(`Subagent Group ${agent.group} log file does not exist yet.`);
  }
});
