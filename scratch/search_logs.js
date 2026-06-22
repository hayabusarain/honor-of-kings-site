const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '../.system_generated/logs/transcript.jsonl');
// Wait, the APP data directory is: C:\Users\81901\.gemini\antigravity
// The transcript is at: C:\Users\81901\.gemini\antigravity\brain\e8b7ecd2-02e7-415a-9624-b012415fa3d1\.system_generated\logs\transcript.jsonl
const appDataLogPath = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e8b7ecd2-02e7-415a-9624-b012415fa3d1\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(appDataLogPath)) {
    console.error('Log file not found at:', appDataLogPath);
    process.exit(1);
}

const content = fs.readFileSync(appDataLogPath, 'utf8');
const lines = content.split('\n');

console.log('Searching user messages in transcript.jsonl...');
lines.forEach((line, index) => {
    if (!line) return;
    try {
        const obj = JSON.parse(line);
        if (obj.source === 'USER_EXPLICIT' || obj.type === 'USER_INPUT') {
            console.log(`[Step ${obj.step_index || index}] User: ${obj.content}`);
        }
    } catch (e) {
        // ignore
    }
});
