const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/images/items/raw');
if (!fs.existsSync(dir)) {
  console.error('Directory not found');
  process.exit(1);
}

const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.png'));

// Sort files numerically by the number in parentheses if available
files.sort((a, b) => {
  const matchA = a.match(/\((\d+)\)/);
  const matchB = b.match(/\((\d+)\)/);
  if (matchA && matchB) {
    return parseInt(matchA[1]) - parseInt(matchB[1]);
  }
  return a.localeCompare(b);
});

console.log(`Total PNG screenshots: ${files.length}`);
console.log('Sorted filenames:');
files.forEach((f, index) => {
  console.log(`${index + 1}: ${f}`);
});
