const fs = require('fs');

const newVersion = "6月17日S15【グランド・ベンチャー】バージョンアップデートのお知らせ";
const oldVersion = "6.17";

const patchesData = JSON.parse(fs.readFileSync('./src/data/patches.json', 'utf8'));

// Update version string for all patches that were previously 6.17
const updatedPatches = patchesData.map(p => {
  if (p.version === oldVersion) {
    p.version = newVersion;
    p.id = p.id.replace(oldVersion, "s15");
  }
  return p;
});

fs.writeFileSync('./src/data/patches.json', JSON.stringify(updatedPatches, null, 2));

console.log('Successfully updated patches.json!');

// Now update patch_meta.json
const patchMetaPath = './src/data/patch_meta.json';
const patchMetaData = JSON.parse(fs.readFileSync(patchMetaPath, 'utf8'));

const targetMetaIndex = patchMetaData.findIndex(m => m.version === oldVersion);

if (targetMetaIndex !== -1) {
  patchMetaData[targetMetaIndex].version = newVersion;
  patchMetaData[targetMetaIndex].id = patchMetaData[targetMetaIndex].id.replace(oldVersion, "s15");
  fs.writeFileSync(patchMetaPath, JSON.stringify(patchMetaData, null, 2));
  console.log('Successfully updated patch_meta.json!');
} else {
  console.log('Could not find meta for version 6.17');
}
