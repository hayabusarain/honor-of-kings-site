const fs = require('fs');
const path = require('path');

function searchDir(dir, filter) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        for (const file of list) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                // Skip node_modules and .git
                if (file !== 'node_modules' && file !== '.git') {
                    results = results.concat(searchDir(filePath, filter));
                }
            } else if (filter(file)) {
                results.push(filePath);
            }
        }
    } catch (e) {
        // ignore
    }
    return results;
}

const brainDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain';
console.log('Searching for files matching 24, 25, 26 in brain directory...');
const foundFiles = searchDir(brainDir, (name) => {
    return name.includes('(24)') || name.includes('(25)') || name.includes('(26)');
});

console.log(`Found ${foundFiles.length} files:`);
foundFiles.forEach(f => console.log(f));
