const fs = require('fs');
const path = require('path');

const missingNums = [59, 60, 61, 62, 63, 64, 67, 68, 69, 70, 71, 72, 73, 74, 75];
const extDir = './scratch/extracted_items';

missingNums.forEach(num => {
  const jsonPath = path.join(extDir, `スクリーンショット (${num}).json`);
  if (fs.existsSync(jsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      console.log(`スクリーンショット (${num}) => ${data.item_name}`);
    } catch (e) {
      console.log(`スクリーンショット (${num}) => Error reading JSON`);
    }
  } else {
    console.log(`スクリーンショット (${num}) => JSON file not found`);
  }
});
