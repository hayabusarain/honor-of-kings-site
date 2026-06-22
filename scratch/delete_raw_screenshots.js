const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '../public/images/items/raw');

try {
    if (fs.existsSync(rawDir)) {
        const files = fs.readdirSync(rawDir);
        let deletedCount = 0;
        files.forEach(file => {
            const filePath = path.join(rawDir, file);
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
                deletedCount++;
            }
        });
        console.log(`Successfully deleted ${deletedCount} raw screenshots from ${rawDir}`);
    } else {
        console.log(`Directory ${rawDir} does not exist.`);
    }
} catch (e) {
    console.error('Error deleting raw screenshots:', e.message);
}
