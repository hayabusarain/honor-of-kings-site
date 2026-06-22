const fs = require('fs');
const path = require('path');

const targets = [
  'スクリーンショット (10).json',
  'スクリーンショット (11).json',
  'スクリーンショット (12).json',
  'スクリーンショット (100).json',
  'スクリーンショット (101).json',
  'スクリーンショット (102).json',
  'スクリーンショット (103).json',
  'スクリーンショット (104).json',
  'スクリーンショット (105).json',
  'スクリーンショット (106).json',
  'スクリーンショット (107).json',
  'スクリーンショット (108).json',
  'スクリーンショット (109).json',
  'スクリーンショット (110).json',
  'スクリーンショット (111).json',
  'スクリーンショット (112).json',
  'スクリーンショット (113).json',
  'スクリーンショット (114).json',
  'スクリーンショット (115).json',
  'スクリーンショット (116).json',
  'スクリーンショット (117).json',
  'スクリーンショット (118).json',
  'スクリーンショット (119).json',
  'スクリーンショット (120).json',
  'スクリーンショット (121).json',
  'スクリーンショット (122).json',
  'スクリーンショット (123).json',
  'スクリーンショット (124).json',
  'スクリーンショット (125).json',
  'スクリーンショット (126).json'
];

const dir = 'c:/Users/81901/Desktop/ワイリフサイト/scratch/extracted_items';
const result = {};

for (const name of targets) {
  const p = path.join(dir, name);
  if (fs.existsSync(p)) {
    try {
      const content = fs.readFileSync(p, 'utf8');
      result[name] = JSON.parse(content);
    } catch (e) {
      result[name] = { error: e.message };
    }
  } else {
    result[name] = { error: 'Not found' };
  }
}

console.log(JSON.stringify(result, null, 2));
