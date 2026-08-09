const fs = require('fs');
const patchesPath = 'src/data/patches.json';
if (fs.existsSync(patchesPath)) {
  let content = fs.readFileSync(patchesPath, 'utf8');
  content = content.replace(/"Bai Long"/g, '"Ao Yin"');
  content = content.replace(/"白龍"/g, '"アオイン"');
  content = content.replace(/"Da Si Ming"/g, '"Augran"');
  content = content.replace(/"大司命"/g, '"オーグラン"');
  fs.writeFileSync(patchesPath, content);
  console.log('Patches updated!');
}
