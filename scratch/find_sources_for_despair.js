const fs = require('fs');
const path = require('path');

const extDir = path.join(__dirname, '../scratch/extracted_items');
const files = fs.readdirSync(extDir).filter(f => f.endsWith('.json') && !f.endsWith('.metadata.json'));

const query = "絶望";

files.forEach(file => {
  const content = fs.readFileSync(path.join(extDir, file), 'utf8');
  if (content.includes(query)) {
    console.log(`Found in: ${file}`);
    console.log(content);
  }
});
