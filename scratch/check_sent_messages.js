const fs = require('fs');
const path = require('path');

const logPath = 'C:\\\\Users\\\\81901\\\\.gemini\\\\antigravity\\\\brain\\\\e3616c4c-cd9e-45b9-9e7a-2b61650ce957\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);

const messages = [];

for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'send_message') {
          messages.push({
            step: obj.step_index,
            time: obj.created_at,
            recipient: call.args.Recipient,
            msg: call.args.Message
          });
        }
      }
    }
  } catch (e) {}
}

console.log(`Subagent called send_message ${messages.length} times:`);
messages.forEach((m, idx) => {
  console.log(`--- Message ${idx + 1} (Step ${m.step}, Time ${m.time}) ---`);
  console.log(`To: ${m.recipient}`);
  console.log(`Message: ${m.msg}`);
  console.log('----------------------------------------------------');
});
