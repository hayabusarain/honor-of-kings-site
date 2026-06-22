const fs = require('fs');
const logPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
const attachments = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT') {
      // Look for files or inlineData or parts containing files
      const parts = obj.content ? JSON.stringify(obj.content) : '';
      if (obj.parts || obj.content) {
        // Let's scan the whole object for attachment-like fields
        const str = JSON.stringify(obj);
        if (str.includes('media__') || str.includes('screenshot') || str.includes('スクリーンショット')) {
          attachments.push({
            step: obj.step_index,
            time: obj.created_at,
            content: obj.content ? obj.content.substring(0, 100) : '',
            raw: obj
          });
        }
      }
    }
  } catch (e) {}
}

console.log(`Found ${attachments.length} attachments.`);
for (const a of attachments) {
  console.log(`Step ${a.step} at ${a.time}: ${a.content}`);
  // If there are files in parts or metadata, let's print them
  if (a.raw.parts) {
    console.log('Parts:', JSON.stringify(a.raw.parts, null, 2));
  }
  if (a.raw.attachments) {
    console.log('Attachments:', JSON.stringify(a.raw.attachments, null, 2));
  }
}

