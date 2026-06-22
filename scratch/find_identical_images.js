const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const brainDir = 'C:\\Users\\81901\\.gemini\\antigravity\\brain\\e8b7ecd2-02e7-415a-9624-b012415fa3d1';
const rawDir = 'c:\\Users\\81901\\Desktop\\ワイリフサイト\\public\\images\\items\\raw';

// 54 target files
const targetFiles = [
  'media__1779553450815.png', 'media__1779553882505.png', 'media__1779555675243.png',
  'media__1779556193892.png', 'media__1779558807076.png', 'media__1779602814430.png',
  'media__1779616754246.png', 'media__1779616830111.png', 'media__1779616894582.png',
  'media__1779617647422.png', 'media__1779622000682.png', 'media__1779623308930.png',
  'media__1779623326867.png', 'media__1779623337896.png', 'media__1779623350043.png',
  'media__1779623360171.png', 'media__1779623402532.png', 'media__1779626776949.png',
  'media__1779626798025.png', 'media__1779627064972.png', 'media__1779627159776.png',
  'media__1779635327824.png', 'media__1779635981564.png', 'media__1779636289186.png',
  'media__1779636619684.png', 'media__1779639702282.png', 'media__1779639986034.png',
  'media__1779640162160.png', 'media__1779640271356.png', 'media__1779640676301.png',
  'media__1779883318850.png', 'media__1779885440266.png', 'media__1779891737806.png',
  'media__1779892309798.png', 'media__1779987305057.png', 'media__1779987340017.png',
  'media__1779987371127.png', 'media__1779987390049.png', 'media__1779987805153.png',
  'media__1780071497953.png', 'media__1780073725767.png', 'media__1780073855979.png',
  'media__1780073943960.png', 'media__1780073977191.png', 'media__1780074032361.png',
  'media__1780079338885.png', 'media__1780079392479.png', 'media__1780079457984.png',
  'media__1780079770450.png', 'media__1780081730034.png', 'media__1780081766673.png',
  'media__1780128755711.png', 'media__1780128858274.png', 'media__1780128883685.png'
];

function getHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

console.log('Hashing raw screenshots...');
const rawHashMap = new Map();
if (fs.existsSync(rawDir)) {
  fs.readdirSync(rawDir).forEach(file => {
    if (file.toLowerCase().endsWith('.png')) {
      const p = path.join(rawDir, file);
      const hash = getHash(p);
      if (hash) rawHashMap.set(hash, file);
    }
  });
}

console.log('Matching target media files...');
let matchCount = 0;
targetFiles.forEach(targetName => {
  const targetPath = path.join(brainDir, targetName);
  const hash = getHash(targetPath);
  if (!hash) {
    console.log(`${targetName} -> [File Not Found]`);
    return;
  }
  const matchFile = rawHashMap.get(hash);
  if (matchFile) {
    console.log(`${targetName} -> ${matchFile}`);
    matchCount++;
  } else {
    console.log(`${targetName} -> [No Match found in raw dir] (hash: ${hash}, size: ${fs.statSync(targetPath).size} bytes)`);
  }
});

console.log(`Matched ${matchCount} of ${targetFiles.length} files.`);
