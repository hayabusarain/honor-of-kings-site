const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, '../scratch/extracted_items');

const subagents = [
    '2fd5731a-fb13-4b17-856b-bde73446743c', // Group 2
    '0606f4df-8054-47b4-a618-e7dfa4d4d7ac'  // Group 5
];

let totalCopied = 0;

subagents.forEach(id => {
    // サブエージェントの scratch/extracted_items のパス
    const srcDir = `C:\\Users\\81901\\.gemini\\antigravity\\brain\\${id}\\scratch\\extracted_items`;
    console.log(`Checking subagent source: ${srcDir}`);
    
    if (fs.existsSync(srcDir)) {
        const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));
        console.log(`  Found ${files.length} JSON files.`);
        files.forEach(file => {
            const srcPath = path.join(srcDir, file);
            const destPath = path.join(destDir, file);
            fs.copyFileSync(srcPath, destPath);
            totalCopied++;
        });
    } else {
        console.log(`  Directory does not exist!`);
    }
});

console.log(`Successfully collected ${totalCopied} missing JSON files.`);
