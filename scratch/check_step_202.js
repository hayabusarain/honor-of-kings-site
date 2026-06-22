const fs = require('fs');
const path = require('path');

const targetPath = 'C:/Users/81901/.gemini/antigravity/brain/b480f433-46b1-471d-8680-a277fd5851f3/.system_generated/steps/202/content.md';

if (fs.existsSync(targetPath)) {
  const stat = fs.statSync(targetPath);
  console.log(`File exists! Size: ${stat.size} bytes`);
  const content = fs.readFileSync(targetPath, 'utf8');
  // print first 500 characters
  console.log(content.slice(0, 1000));
} else {
  console.log('File does not exist at path:', targetPath);
}
